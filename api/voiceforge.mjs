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

function getCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-TTS-Client",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "no-store",
  };
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

  if (
    typeof headers.getSetCookie === "function"
  ) {
    values = headers.getSetCookie();
  } else {
    const value =
      headers.get("set-cookie");

    if (value) values = [value];
  }

  return values
    .map(value =>
      String(value).split(";", 1)[0]
    )
    .filter(Boolean)
    .join("; ");
}

function findReadLoudMp3Url(
  htmlText,
  pageUrl
) {
  const decoded =
    String(htmlText)
      .replace(/&amp;/gi, "&")
      .replace(/&#0*39;/gi, "'")
      .replace(/&quot;/gi, '"');

  const patterns = [
    /(?:src|href)\s*=\s*["']([^"'<>]*\/tmp\/[^"'<>]+?\.mp3(?:\?[^"'<>]*)?)["']/gi,
    /(?:src|href)\s*=\s*["']([^"'<>]+?\.mp3(?:\?[^"'<>]*)?)["']/gi,
    /(\/tmp\/[^"'<>\s]+?\.mp3(?:\?[^"'<>\s]*)?)/gi,
  ];

  for (const pattern of patterns) {
    let match;

    while (
      (match = pattern.exec(decoded)) !== null
    ) {
      try {
        const url =
          new URL(match[1], pageUrl);

        if (
          url.hostname === "readloud.net" &&
          /\.mp3(?:$|[?#])/i.test(url.href)
        ) {
          return url;
        }
      } catch {}
    }
  }

  throw new Error(
    "ReadLoud returned HTML, but no generated MP3 URL was found."
  );
}

async function requestReadLoudMp3(
  voice,
  text
) {
  const pagePath =
    READLOUD_VOICES[voice];

  if (!pagePath) {
    throw Object.assign(
      new Error(
        "The requested ReadLoud voice is unavailable."
      ),
      { statusCode: 400 }
    );
  }

  const pageUrl =
    new URL(pagePath, READLOUD_ORIGIN);

  const commonHeaders = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36",
    "Accept-Language":
      "en-US,en;q=0.9",
    "Accept-Encoding":
      "identity",
  };

  const pageResponse =
    await fetchWithTimeout(
      pageUrl,
      {
        method: "GET",
        headers: {
          ...commonHeaders,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      }
    );

  if (!pageResponse.ok) {
    throw new Error(
      "ReadLoud page request failed: " +
      await readError(pageResponse)
    );
  }

  const cookie =
    readLoudCookieHeader(
      pageResponse.headers
    );

  const body =
    new URLSearchParams({
      but1: text,
      butS: "0",
      butP: "0",
      butPauses: "0",
      butt0: "Submit",
    });

  const speechResponse =
    await fetchWithTimeout(
      pageUrl,
      {
        method: "POST",
        headers: {
          ...commonHeaders,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Content-Type":
            "application/x-www-form-urlencoded;charset=UTF-8",
          Origin: READLOUD_ORIGIN,
          Referer: pageUrl.href,
          ...(cookie ? { Cookie: cookie } : {}),
        },
        body,
      }
    );

  if (!speechResponse.ok) {
    throw new Error(
      "ReadLoud generation failed: " +
      await readError(speechResponse)
    );
  }

  const htmlText =
    await speechResponse.text();

  const mp3Url =
    findReadLoudMp3Url(
      htmlText,
      pageUrl
    );

  const audioResponse =
    await fetchWithTimeout(
      mp3Url,
      {
        method: "GET",
        headers: {
          ...commonHeaders,
          Accept:
            "audio/mpeg,audio/*;q=0.9,*/*;q=0.8",
          Referer: pageUrl.href,
          ...(cookie ? { Cookie: cookie } : {}),
        },
      }
    );

  if (!audioResponse.ok) {
    throw new Error(
      "ReadLoud MP3 download failed: " +
      await readError(audioResponse)
    );
  }

  const mp3 =
    Buffer.from(
      await audioResponse.arrayBuffer()
    );

  if (
    !isMp3Buffer(
      mp3,
      audioResponse.headers.get(
        "content-type"
      ) || ""
    )
  ) {
    throw new Error(
      "ReadLoud did not return MP3 audio."
    );
  }

  return mp3;
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
      getCorsHeaders();

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
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
