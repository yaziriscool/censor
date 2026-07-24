export const maxDuration = 60;

const VOICEFORGE_PROJECT_ID = "voiceforge-aacb8";
const TOKEN_URL = "https://securetoken.googleapis.com/v1/token";
const VOICEFORGE_URL = "https://www.voiceforge.com/api/generate-speech";
const READLOUD_ORIGIN = "https://readloud.net";
const REQUEST_TIMEOUT_MS = 60_000;

const VOICEFORGE_VOICES = new Set([
  "Amy",
  "Belle",
  "Callie",
  "CallieQ",
  "Charlie",
  "Conrad",
  "Dallas",
  "Damien",
  "David",
  "Designer",
  "Diane",
  "Diesel",
  "Dog",
  "Duchess",
  "Duncan",
  "Emily",
  "EvilGenius",
  "Frank",
  "French-fry",
  "Gregory",
  "Jerkface",
  "JerseyGirl",
  "Kayla",
  "Kevin",
  "Kidaroo",
  "Lawrence",
  "Linda",
  "Millie",
  "Obama",
  "Princess",
  "RansomNote",
  "Robin",
  "Shouty",
  "Shygirl",
  "Susan",
  "Tamika",
  "TopHat",
  "Vixen",
  "Vlad",
  "Walter",
  "Warren",
  "Whispery",
  "William",
  "Wiseguy",
  "Zach"
]);

const READLOUD_VOICES = Object.freeze({
  "russell-GoNuTTS": "/english/australian/48-male-voice-russell.html",
  "nicole-GoNuTTS": "/english/australian/43-female-voice-nicole.html",
  "ricardo-GoNuTTS": "/portuguese/brasilian/46-voz-masculina-ricardo.html",
  "amy-GoNuTTS": "/english/british/5-female-voice-amy.html",
  "emma-GoNuTTS": "/english/british/17-female-voice-emma.html",
  "brian-GoNuTTS": "/english/british/1-male-voice-brian.html",
  "chantal-GoNuTTS": "/french/canadian/13-voix-de-femme-chantal.html",
  "enrique-GoNuTTS": "/spanish/castilian/18-voz-masculina-enrique.html",
  "conchita-GoNuTTS": "/spanish/castilian/14-voz-femenina-conchita.html",
  "mads-GoNuTTS": "/danish/37-mandlig-stemme-mads.html",
  "naja-GoNuTTS": "/danish/42-kvinde-stemme-naja.html",
  "lotte-GoNuTTS": "/dutch/36-vrouwelijke-stem-lotte.html",
  "ruben-GoNuTTS": "/dutch/47-mannelijke-stem-ruben.html",
  "mathieu-GoNuTTS": "/french/40-voix-masculine-mathieu.html",
  "hans-GoNuTTS": "/german/24-mannerstimme-hans.html",
  "marlene-GoNuTTS": "/german/39-frauenstimme-marlene.html",
  "karl-GoNuTTS": "/icelandic/31-male-rodd-karl.html",
  "giorgio-GoNuTTS": "/italian/22-voce-maschile-giorgio.html",
  "carla-GoNuTTS": "/italian/8-voce-femminile-carla.html",
  "liv-GoNuTTS": "/norwegian/34-kvinne-stemme-liv.html",
  "jacek-GoNuTTS": "/polish/26-meski-glos-jacek.html",
  "jan-GoNuTTS": "/polish/27-meski-glos-jan.html",
  "maja-GoNuTTS": "/polish/38-kobiecy-glos-maja.html",
  "ewa-GoNuTTS": "/polish/19-kobiecy-glos-ewa.html",
  "cristiano-GoNuTTS": "/portuguese/15-voz-masculina-cristiano.html",
  "tatyana-GoNuTTS": "/russian/50-zhenskiy-golos-tatyana.html",
  "astrid-GoNuTTS": "/swedish/10-kvinnlig-rost-astrid.html",
  "filiz-GoNuTTS": "/turkish/20-kadın-sesi-filiz.html",
  "justin-GoNuTTS": "/english/american/30-child-s-boy-voice-justin.html",
  "kendra-GoNuTTS": "/english/american/32-female-voice-kendra.html",
  "ivy-GoNuTTS": "/english/american/25-child-s-girl-voice-ivy.html",
  "joey-GoNuTTS": "/english/american/29-male-voice-joey.html",
  "salli-GoNuTTS": "/english/american/2-girl-s-voice-sally.html",
  "kimberly-GoNuTTS": "/english/american/33-female-voice-kimberly.html",
  "geraint-GoNuTTS": "/english/welsh/21-male-voice-geraint.html",
  "eric": "/english/american/3-male-voice-eric.html",
  "jennifer": "/english/american/28-female-voice-jennifer.html",
  "skippy": "/english/american/49-funny-toy-voice-skippy-the-chipmunk.html",
  "gwynethenglish": "/english/welsh/23-female-voice-gwyneth.html",
  "agnieszka": "/polish/9-kobiecy-glos-agnieszka.html"
});


const READLOUD_TTSTOOL_VOICES = Object.freeze({
  "russell-GoNuTTS": { voiceId: "Amazon Australian English (Russell)", lang: "en-AU" },
  "nicole-GoNuTTS": { voiceId: "Amazon Australian English (Nicole)", lang: "en-AU" },
  "ricardo-GoNuTTS": { voiceId: "Amazon Brazilian Portuguese (Ricardo)", lang: "pt-BR" },
  "amy-GoNuTTS": { voiceId: "Amazon British English (Amy)", lang: "en-GB" },
  "emma-GoNuTTS": { voiceId: "Amazon British English (Emma)", lang: "en-GB" },
  "brian-GoNuTTS": { voiceId: "Amazon British English (Brian)", lang: "en-GB" },
  "chantal-GoNuTTS": { voiceId: "Amazon Canadian French (Chantal)", lang: "fr-CA" },
  "enrique-GoNuTTS": { voiceId: "Amazon Castilian Spanish (Enrique)", lang: "es-ES" },
  "conchita-GoNuTTS": { voiceId: "Amazon Castilian Spanish (Conchita)", lang: "es-ES" },
  "mads-GoNuTTS": { voiceId: "Amazon Danish (Mads)", lang: "da-DK" },
  "naja-GoNuTTS": { voiceId: "Amazon Danish (Naja)", lang: "da-DK" },
  "lotte-GoNuTTS": { voiceId: "Amazon Dutch (Lotte)", lang: "nl-NL" },
  "ruben-GoNuTTS": { voiceId: "Amazon Dutch (Ruben)", lang: "nl-NL" },
  "mathieu-GoNuTTS": { voiceId: "Amazon French (Mathieu)", lang: "fr-FR" },
  "hans-GoNuTTS": { voiceId: "Amazon German (Hans)", lang: "de-DE" },
  "marlene-GoNuTTS": { voiceId: "Amazon German (Marlene)", lang: "de-DE" },
  "karl-GoNuTTS": { voiceId: "Amazon Icelandic (Karl)", lang: "is-IS" },
  "giorgio-GoNuTTS": { voiceId: "Amazon Italian (Giorgio)", lang: "it-IT" },
  "carla-GoNuTTS": { voiceId: "Amazon Italian (Carla)", lang: "it-IT" },
  "liv-GoNuTTS": { voiceId: "Amazon Norwegian (Liv)", lang: "nb-NO" },
  "jacek-GoNuTTS": { voiceId: "Amazon Polish (Jacek)", lang: "pl-PL" },
  "jan-GoNuTTS": { voiceId: "Amazon Polish (Jan)", lang: "pl-PL" },
  "maja-GoNuTTS": { voiceId: "Amazon Polish (Maja)", lang: "pl-PL" },
  "ewa-GoNuTTS": { voiceId: "Amazon Polish (Ewa)", lang: "pl-PL" },
  "cristiano-GoNuTTS": { voiceId: "Amazon Portuguese (Cristiano)", lang: "pt-PT" },
  "tatyana-GoNuTTS": { voiceId: "Amazon Russian (Tatyana)", lang: "ru-RU" },
  "astrid-GoNuTTS": { voiceId: "Amazon Swedish (Astrid)", lang: "sv-SE" },
  "filiz-GoNuTTS": { voiceId: "Amazon Turkish (Filiz)", lang: "tr-TR" },
  "justin-GoNuTTS": { voiceId: "Amazon US English (Justin)", lang: "en-US" },
  "kendra-GoNuTTS": { voiceId: "Amazon US English (Kendra)", lang: "en-US" },
  "ivy-GoNuTTS": { voiceId: "Amazon US English (Ivy)", lang: "en-US" },
  "joey-GoNuTTS": { voiceId: "Amazon US English (Joey)", lang: "en-US" },
  "salli-GoNuTTS": { voiceId: "Amazon US English (Salli)", lang: "en-US" },
  "kimberly-GoNuTTS": { voiceId: "Amazon US English (Kimberly)", lang: "en-US" },
  "geraint-GoNuTTS": { voiceId: "Amazon Welsh (Geraint)", lang: "cy-GB" },
  "gwynethenglish": { voiceId: "Amazon Welsh (Gwyneth)", lang: "cy-GB" }
});

let cachedSession = null;
let refreshPromise = null;
let activeRefreshToken = null;

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

  const configuredOrigins =
    String(process.env.ALLOWED_ORIGINS || "")
      .split(",")
      .map(origin => origin.trim())
      .filter(Boolean);

  return new Set([ownOrigin, ...configuredOrigins]);
}

function getCorsHeaders(request) {
  const origin = request.headers.get("Origin");

  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-TTS-Client",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };

  if (
    origin &&
    getAllowedOrigins(request).has(origin)
  ) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function assertAllowedOrigin(request) {
  const origin = request.headers.get("Origin");

  if (
    origin &&
    !getAllowedOrigins(request).has(origin)
  ) {
    throw Object.assign(
      new Error(
        "This website is not allowed to call the API."
      ),
      { statusCode: 403 }
    );
  }
}

function decodeJwtPayload(token) {
  const parts = String(token).split(".");

  if (parts.length !== 3) {
    throw new Error(
      "Firebase returned a malformed ID token."
    );
  }

  let payload =
    parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

  while (payload.length % 4 !== 0) {
    payload += "=";
  }

  return JSON.parse(
    Buffer.from(payload, "base64").toString("utf8")
  );
}

async function fetchWithTimeout(
  url,
  options = {},
  timeout = REQUEST_TIMEOUT_MS
) {
  return await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(timeout),
  });
}

async function readError(response) {
  const text = (await response.text()).trim();

  if (!text) {
    return `HTTP ${response.status}`;
  }

  try {
    const data = JSON.parse(text);

    return String(
      data.error?.message ||
      data.error ||
      data.message ||
      text
    ).slice(0, 1000);
  } catch {
    return text.slice(0, 1000);
  }
}

async function refreshVoiceForgeSession(
  forceRefresh = false
) {
  const now = Date.now();

  if (
    !forceRefresh &&
    cachedSession &&
    cachedSession.expiresAt > now + 60_000
  ) {
    return cachedSession;
  }

  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const apiKey =
      String(
        process.env.VOICEFORGE_API_KEY || ""
      ).trim();

    const configuredRefreshToken =
      String(
        process.env.VOICEFORGE_REFRESH_TOKEN || ""
      ).trim();

    const expectedUid =
      String(
        process.env.VOICEFORGE_UID || ""
      ).trim();

    if (!apiKey || !configuredRefreshToken) {
      throw new Error(
        "VOICEFORGE_API_KEY or VOICEFORGE_REFRESH_TOKEN is missing."
      );
    }

    if (!activeRefreshToken) {
      activeRefreshToken =
        configuredRefreshToken;
    }

    const body =
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: activeRefreshToken,
      });

    const response =
      await fetchWithTimeout(
        `${TOKEN_URL}?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
          body,
        }
      );

    if (!response.ok) {
      throw new Error(
        "Firebase authentication failed: " +
        await readError(response)
      );
    }

    const result = await response.json();
    const idToken =
      String(result.id_token || "");

    const uid =
      String(result.user_id || "");

    if (!idToken || !uid) {
      throw new Error(
        "Firebase did not return both an ID token and user ID."
      );
    }

    if (
      expectedUid &&
      uid !== expectedUid
    ) {
      throw new Error(
        "Firebase returned a different VoiceForge user ID."
      );
    }

    const claims = decodeJwtPayload(idToken);

    if (
      claims.aud !== VOICEFORGE_PROJECT_ID
    ) {
      throw new Error(
        "Firebase returned a token for the wrong project."
      );
    }

    if (
      String(claims.sub || "") !== uid
    ) {
      throw new Error(
        "Firebase token UID does not match the returned user ID."
      );
    }

    if (result.refresh_token) {
      activeRefreshToken =
        String(result.refresh_token);
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

function isWaveBuffer(buffer) {
  return (
    Buffer.isBuffer(buffer) &&
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WAVE"
  );
}

function isMp3Buffer(
  buffer,
  contentType = ""
) {
  if (
    !Buffer.isBuffer(buffer) ||
    buffer.length < 4
  ) {
    return false;
  }

  if (
    buffer.subarray(0, 3).toString("ascii") === "ID3"
  ) {
    return true;
  }

  if (
    buffer[0] === 0xff &&
    (buffer[1] & 0xe0) === 0xe0
  ) {
    return true;
  }

  return /audio\/(?:mpeg|mp3)|application\/octet-stream/i
    .test(String(contentType));
}

async function requestVoiceForgeWav(
  voice,
  text,
  allowRetry = true
) {
  const session =
    await refreshVoiceForgeSession(false);

  const legacyVoice =
    voice.startsWith("legacy:")
      ? voice
      : `legacy:${voice}`;

  const response =
    await fetchWithTimeout(
      VOICEFORGE_URL,
      {
        method: "POST",
        headers: {
          Accept:
            "audio/wav, application/json",
          Authorization:
            `Bearer ${session.idToken}`,
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          text,
          voice: legacyVoice,
          soundEffect: "none",
          firebaseUid: session.uid,
        }),
      }
    );

  if (
    (
      response.status === 401 ||
      response.status === 403
    ) &&
    allowRetry
  ) {
    cachedSession = null;

    await refreshVoiceForgeSession(true);

    return requestVoiceForgeWav(
      voice,
      text,
      false
    );
  }

  if (!response.ok) {
    throw new Error(
      "VoiceForge failed: " +
      await readError(response)
    );
  }

  const wav =
    Buffer.from(
      await response.arrayBuffer()
    );

  if (!isWaveBuffer(wav)) {
    throw new Error(
      "VoiceForge returned data that was not a WAV file."
    );
  }

  return wav;
}

function readLoudCookieHeader(headers) {
  let values = [];

  if (typeof headers.getSetCookie === "function") {
    values = headers.getSetCookie();
  } else {
    const value = headers.get("set-cookie");
    if (value) values = [value];
  }

  return values
    .map(value => String(value).split(";", 1)[0])
    .filter(Boolean)
    .join("; ");
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function decodeReadLoudMarkup(value) {
  return String(value)
    .replace(/&amp;/gi, "&")
    .replace(/&#0*39;/gi, "'")
    .replace(/&quot;/gi, '\"')
    .replace(/\\u002f/gi, "/")
    .replace(/\\u003a/gi, ":")
    .replace(/\\\//g, "/");
}

function findReadLoudMp3Url(htmlText, pageUrl) {
  const decoded = decodeReadLoudMarkup(htmlText);

  const patterns = [
    /(?:src|href|data-src|data-url|url)\s*[=:]\s*["']([^"'<>]+?\.mp3(?:\?[^"'<>]*)?)["']/gi,
    /(https?:\/\/[^"'<>\s]+?\.mp3(?:\?[^"'<>\s]*)?)/gi,
    /(\/\/[^"'<>\s]+?\.mp3(?:\?[^"'<>\s]*)?)/gi,
    /(\/tmp\/[^"'<>\s]+?\.mp3(?:\?[^"'<>\s]*)?)/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(decoded)) !== null) {
      try {
        const url = new URL(match[1], pageUrl);
        if (url.protocol === "https:" && /\.mp3(?:$|[?#])/i.test(url.href)) {
          return url;
        }
      } catch {}
    }
  }

  try {
    const data = JSON.parse(decoded);
    const queue = [data];
    while (queue.length) {
      const item = queue.shift();
      if (typeof item === "string") {
        try {
          const url = new URL(item, pageUrl);
          if (url.protocol === "https:" && /\.mp3(?:$|[?#])/i.test(url.href)) {
            return url;
          }
        } catch {}
      } else if (Array.isArray(item)) {
        queue.push(...item);
      } else if (item && typeof item === "object") {
        queue.push(...Object.values(item));
      }
    }
  } catch {}

  throw new Error("ReadLoud returned HTML, but no generated MP3 URL was found.");
}

async function downloadReadLoudMp3(url, headers = {}) {
  const response = await fetchWithTimeout(url, {
    method: "GET",
    headers: {
      Accept: "audio/mpeg,audio/*;q=0.9,*/*;q=0.8",
      ...headers,
    },
  });

  if (!response.ok) {
    throw new Error("ReadLoud MP3 download failed: " + await readError(response));
  }

  const mp3 = Buffer.from(await response.arrayBuffer());
  if (!isMp3Buffer(mp3, response.headers.get("content-type") || "")) {
    throw new Error("ReadLoud did not return MP3 audio.");
  }

  return mp3;
}

async function requestReadLoudToolMp3(voice, text) {
  const config = READLOUD_TTSTOOL_VOICES[voice];
  if (!config) return null;

  const createResponse = await fetchWithTimeout(
    "https://support.readaloud.app/ttstool/createParts",
    {
      method: "POST",
      headers: {
        Accept: "application/json,text/plain,*/*",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/150 Safari/537.36",
      },
      body: JSON.stringify([
        {
          voiceId: config.voiceId,
          ssml: `<speak version="1.0" xml:lang="${config.lang}">${escapeXml(text)}</speak>`,
        },
      ]),
    }
  );

  if (!createResponse.ok) {
    throw new Error("ReadLoud TTSTool creation failed: " + await readError(createResponse));
  }

  const responseText = (await createResponse.text()).trim();
  let result;
  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error(`ReadLoud TTSTool returned invalid JSON: ${responseText.slice(0, 500)}`);
  }

  const first = Array.isArray(result) ? result[0] : result;
  const partId = typeof first === "string"
    ? first
    : first?.id || first?.key || first?.q || first?.partId;

  if (!partId) {
    throw new Error("ReadLoud TTSTool did not return an audio part ID.");
  }

  return downloadReadLoudMp3(
    `https://support.readaloud.app/ttstool/getParts?q=${encodeURIComponent(String(partId))}`,
    { Referer: "https://support.readaloud.app/" }
  );
}

async function requestReadLoudSiteMp3(voice, text) {
  const pagePath = READLOUD_VOICES[voice];
  const pageUrl = new URL(pagePath, READLOUD_ORIGIN);

  const commonHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "identity",
    Connection: "keep-alive",
  };

  const pageResponse = await fetchWithTimeout(pageUrl, {
    method: "GET",
    headers: {
      ...commonHeaders,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  if (!pageResponse.ok) {
    throw new Error("ReadLoud page request failed: " + await readError(pageResponse));
  }

  const cookie = readLoudCookieHeader(pageResponse.headers);
  const body = new URLSearchParams({
    but1: text,
    butS: "0",
    butP: "0",
    butPauses: "0",
    butt0: "Submit",
  });

  const speechResponse = await fetchWithTimeout(pageUrl, {
    method: "POST",
    headers: {
      ...commonHeaders,
      Accept: "audio/mpeg,text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      Origin: READLOUD_ORIGIN,
      Referer: pageUrl.href,
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body,
  });

  if (!speechResponse.ok) {
    throw new Error("ReadLoud generation failed: " + await readError(speechResponse));
  }

  const contentType = speechResponse.headers.get("content-type") || "";
  const responseBytes = Buffer.from(await speechResponse.arrayBuffer());

  if (isMp3Buffer(responseBytes, contentType)) {
    return responseBytes;
  }

  const htmlText = responseBytes.toString("utf8");
  const mp3Url = findReadLoudMp3Url(htmlText, pageUrl);

  return downloadReadLoudMp3(mp3Url, {
    ...commonHeaders,
    Referer: pageUrl.href,
    ...(cookie ? { Cookie: cookie } : {}),
  });
}

async function requestReadLoudMp3(voice, text) {
  if (!READLOUD_VOICES[voice]) {
    throw Object.assign(
      new Error("The requested ReadLoud voice is unavailable."),
      { statusCode: 400 }
    );
  }

  const errors = [];

  if (READLOUD_TTSTOOL_VOICES[voice]) {
    try {
      return await requestReadLoudToolMp3(voice, text);
    } catch (error) {
      errors.push(`TTSTool: ${error?.message || error}`);
    }
  }

  try {
    return await requestReadLoudSiteMp3(voice, text);
  } catch (error) {
    errors.push(`ReadLoud site: ${error?.message || error}`);
  }

  throw new Error(`ReadLoud generation failed. ${errors.join(" | ")}`);
}

function validateInput(value) {
  const provider =
    typeof value?.provider === "string"
      ? value.provider.trim().toLowerCase()
      : "voiceforge";

  const voice =
    typeof value?.voice === "string"
      ? value.voice.trim()
      : "";

  const text =
    typeof value?.text === "string"
      ? value.text.trim()
      : "";

  if (
    provider !== "voiceforge" &&
    provider !== "readloud"
  ) {
    throw Object.assign(
      new Error(
        "Provider must be voiceforge or readloud."
      ),
      { statusCode: 400 }
    );
  }

  if (!text) {
    throw Object.assign(
      new Error("Enter some text first."),
      { statusCode: 400 }
    );
  }

  const maximumLength =
    provider === "voiceforge"
      ? 500
      : 300;

  if (text.length > maximumLength) {
    throw Object.assign(
      new Error(
        `Text must be ${maximumLength} characters or fewer for ${provider}.`
      ),
      { statusCode: 400 }
    );
  }

  if (
    provider === "voiceforge" &&
    !VOICEFORGE_VOICES.has(
      voice.replace(/^legacy:/, "")
    )
  ) {
    throw Object.assign(
      new Error(
        "The requested VoiceForge legacy voice is unavailable."
      ),
      { statusCode: 400 }
    );
  }

  if (
    provider === "readloud" &&
    !Object.prototype.hasOwnProperty.call(
      READLOUD_VOICES,
      voice
    )
  ) {
    throw Object.assign(
      new Error(
        "The requested ReadLoud voice is unavailable."
      ),
      { statusCode: 400 }
    );
  }

  return {
    provider,
    voice:
      provider === "voiceforge"
        ? voice.replace(/^legacy:/, "")
        : voice,
    text,
  };
}

export default {
  async fetch(request) {
    const corsHeaders =
      getCorsHeaders(request);

    if (request.method === "OPTIONS") {
      try {
        assertAllowedOrigin(request);

        return new Response(null, {
          status: 204,
          headers: corsHeaders,
        });
      } catch (error) {
        return json(
          { error: error.message },
          error.statusCode || 403,
          corsHeaders
        );
      }
    }

    if (request.method !== "POST") {
      return json(
        { error: "Method not allowed." },
        405,
        {
          ...corsHeaders,
          Allow: "POST, OPTIONS",
        }
      );
    }

    try {
      assertAllowedOrigin(request);

      const input =
        validateInput(
          await request.json()
        );

      let audio;
      let contentType;
      let extension;

      if (
        input.provider === "voiceforge"
      ) {
        audio =
          await requestVoiceForgeWav(
            input.voice,
            input.text
          );

        contentType = "audio/wav";
        extension = "wav";
      } else {
        audio =
          await requestReadLoudMp3(
            input.voice,
            input.text
          );

        contentType = "audio/mpeg";
        extension = "mp3";
      }

      return new Response(audio, {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": contentType,
          "Content-Length":
            String(audio.length),
          "Content-Disposition":
            `inline; filename="tts.${extension}"`,
          "Cache-Control": "no-store",
          "X-Content-Type-Options":
            "nosniff",
          "X-TTS-Provider":
            input.provider,
        },
      });
    } catch (error) {
      console.error(
        "TTS API error:",
        error
      );

      const status =
        Number.isInteger(
          error?.statusCode
        )
          ? error.statusCode
          : 500;

      return json(
        {
          error:
            error?.message ||
            "Voice generation failed on the server.",
        },
        status,
        corsHeaders
      );
    }
  },
};
