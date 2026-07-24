const VOICEFORGE_PROJECT_ID = "voiceforge-aacb8";
const TOKEN_URL = "https://securetoken.googleapis.com/v1/token";
const VOICEFORGE_URL = "https://www.voiceforge.com/api/generate-speech";
const REQUEST_TIMEOUT_MS = 60_000;
const MAX_TEXT_LENGTH = 500;

let cachedSession = null;
let refreshPromise = null;

function json(data, status = 200, headers = {}) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store",
			...headers,
		},
	});
}

function getAllowedOrigins(request) {
	const ownOrigin = new URL(request.url).origin;
	const configuredOrigins = String(process.env.ALLOWED_ORIGINS || "")
		.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean);

	return new Set([ownOrigin, ...configuredOrigins]);
}

function getCorsHeaders(request) {
	const origin = request.headers.get("Origin");
	const headers = {
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
		Vary: "Origin",
	};

	if (origin && getAllowedOrigins(request).has(origin)) {
		headers["Access-Control-Allow-Origin"] = origin;
	}

	return headers;
}

function assertAllowedOrigin(request) {
	const origin = request.headers.get("Origin");

	if (origin && !getAllowedOrigins(request).has(origin)) {
		throw Object.assign(new Error("This website is not allowed to call the API."), {
			statusCode: 403,
		});
	}
}

function decodeJwtPayload(token) {
	const parts = String(token).split(".");
	if (parts.length !== 3) {
		throw new Error("Firebase returned a malformed ID token.");
	}

	let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
	while (payload.length % 4 !== 0) payload += "=";

	return JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
}

async function readError(response) {
	const text = (await response.text()).trim();
	if (!text) return `HTTP ${response.status}`;

	try {
		const data = JSON.parse(text);
		return data.error?.message || data.error || data.message || text.slice(0, 1000);
	} catch {
		return text.slice(0, 1000);
	}
}

async function refreshVoiceForgeSession(forceRefresh = false) {
	const now = Date.now();

	if (!forceRefresh && cachedSession && cachedSession.expiresAt > now + 60_000) {
		return cachedSession;
	}

	if (refreshPromise) return refreshPromise;

	refreshPromise = (async () => {
		const apiKey = process.env.VOICEFORGE_API_KEY;
		const refreshToken = process.env.VOICEFORGE_REFRESH_TOKEN;

		if (!apiKey || !refreshToken) {
			throw new Error(
				"VOICEFORGE_API_KEY or VOICEFORGE_REFRESH_TOKEN is missing from Vercel environment variables."
			);
		}

		const body = new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: refreshToken,
		});

		const response = await fetch(`${TOKEN_URL}?key=${encodeURIComponent(apiKey)}`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body,
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});

		if (!response.ok) {
			throw new Error(`Firebase authentication failed: ${await readError(response)}`);
		}

		const result = await response.json();
		const idToken = String(result.id_token || "");
		const uid = String(result.user_id || "");

		if (!idToken || !uid) {
			throw new Error("Firebase did not return both an ID token and user ID.");
		}

		const claims = decodeJwtPayload(idToken);
		if (claims.aud !== VOICEFORGE_PROJECT_ID) {
			throw new Error("Firebase returned a token for the wrong project.");
		}
		if (String(claims.sub || "") !== uid) {
			throw new Error("Firebase token UID does not match the returned user ID.");
		}

		cachedSession = {
			idToken,
			uid,
			expiresAt:
				typeof claims.exp === "number"
					? claims.exp * 1000
					: Date.now() + 55 * 60_000,
		};

		return cachedSession;
	})();

	try {
		return await refreshPromise;
	} finally {
		refreshPromise = null;
	}
}

function validateInput(value) {
	const text = typeof value?.text === "string" ? value.text.trim() : "";
	const rawVoice = typeof value?.voice === "string" ? value.voice.trim() : "";
	const voice = rawVoice.startsWith("legacy:") ? rawVoice : `legacy:${rawVoice}`;

	if (!text) {
		throw Object.assign(new Error("Enter some text first."), { statusCode: 400 });
	}
	if (text.length > MAX_TEXT_LENGTH) {
		throw Object.assign(
			new Error(`Text must be ${MAX_TEXT_LENGTH} characters or fewer.`),
			{ statusCode: 400 }
		);
	}
	if (!/^legacy:[A-Za-z0-9-]{1,40}$/.test(voice)) {
		throw Object.assign(new Error("Invalid VoiceForge voice name."), {
			statusCode: 400,
		});
	}

	return { text, voice };
}

async function requestVoiceForgeWav(voice, text, allowRetry = true) {
	const session = await refreshVoiceForgeSession(false);
	const response = await fetch(VOICEFORGE_URL, {
		method: "POST",
		headers: {
			Accept: "audio/wav, application/json",
			Authorization: `Bearer ${session.idToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			text,
			voice,
			soundEffect: "none",
			firebaseUid: session.uid,
		}),
		signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
	});

	if ((response.status === 401 || response.status === 403) && allowRetry) {
		cachedSession = null;
		await refreshVoiceForgeSession(true);
		return requestVoiceForgeWav(voice, text, false);
	}

	if (!response.ok) {
		throw new Error(`VoiceForge failed: ${await readError(response)}`);
	}

	const wav = Buffer.from(await response.arrayBuffer());
	const isWave =
		wav.length >= 12 &&
		wav.subarray(0, 4).toString("ascii") === "RIFF" &&
		wav.subarray(8, 12).toString("ascii") === "WAVE";

	if (!isWave) {
		throw new Error("VoiceForge returned data that was not a WAV file.");
	}

	return wav;
}

export default {
	async fetch(request) {
		const corsHeaders = getCorsHeaders(request);

		if (request.method === "OPTIONS") {
			return new Response(null, { status: 204, headers: corsHeaders });
		}

		if (request.method !== "POST") {
			return json({ error: "Method not allowed." }, 405, {
				...corsHeaders,
				Allow: "POST, OPTIONS",
			});
		}

		try {
			assertAllowedOrigin(request);
			const input = validateInput(await request.json());
			const wav = await requestVoiceForgeWav(input.voice, input.text);

			return new Response(wav, {
				status: 200,
				headers: {
					...corsHeaders,
					"Content-Type": "audio/wav",
					"Content-Disposition": 'inline; filename="voiceforge.wav"',
					"Cache-Control": "no-store",
					"X-Content-Type-Options": "nosniff",
				},
			});
		} catch (error) {
			console.error("VoiceForge API error:", error);
			const status = Number.isInteger(error?.statusCode) ? error.statusCode : 500;
			const message =
				status < 500 ? error.message : "Voice generation failed on the server.";
			return json({ error: message }, status, corsHeaders);
		}
	},
};
