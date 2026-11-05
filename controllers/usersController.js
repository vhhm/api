import { client } from "../index.js";
import dayjs from "dayjs";

/* =========================================================
   NITRO
========================================================= */

const nitroLevels = [
  { badge: "nitro", lowerLimit: 0, upperLimit: 0 },
  { badge: "nitro_bronze", lowerLimit: 1, upperLimit: 2 },
  { badge: "nitro_silver", lowerLimit: 3, upperLimit: 5 },
  { badge: "nitro_gold", lowerLimit: 6, upperLimit: 11 },
  { badge: "nitro_platinum", lowerLimit: 12, upperLimit: 23 },
  { badge: "nitro_diamond", lowerLimit: 24, upperLimit: 35 },
  { badge: "nitro_emerald", lowerLimit: 36, upperLimit: 59 },
  { badge: "nitro_ruby", lowerLimit: 60, upperLimit: 71 },
  { badge: "nitro_fire", lowerLimit: 72 },
];

/* =========================================================
   BOOST
========================================================= */

const boostLevels = [
  {
    level: "guild_booster_lvl1",
    lowerLimit: 0,
    upperLimit: 1,
  },
  {
    level: "guild_booster_lvl2",
    lowerLimit: 2,
    upperLimit: 2,
  },
  {
    level: "guild_booster_lvl3",
    lowerLimit: 3,
    upperLimit: 5,
  },
  {
    level: "guild_booster_lvl4",
    lowerLimit: 6,
    upperLimit: 8,
  },
  {
    level: "guild_booster_lvl5",
    lowerLimit: 9,
    upperLimit: 11,
  },
  {
    level: "guild_booster_lvl6",
    lowerLimit: 12,
    upperLimit: 14,
  },
  {
    level: "guild_booster_lvl7",
    lowerLimit: 15,
    upperLimit: 17,
  },
  {
    level: "guild_booster_lvl8",
    lowerLimit: 18,
    upperLimit: 23,
  },
  {
    level: "guild_booster_lvl9",
    lowerLimit: 24,
  },
];

/* =========================================================
   ACCOUNT AGE
========================================================= */

const accountAgeLevels = [
  { badge: "account_age_seed", lowerLimit: 1, upperLimit: 1 },
  { badge: "account_age_sprout", lowerLimit: 2, upperLimit: 2 },
  { badge: "account_age_bud", lowerLimit: 3, upperLimit: 3 },
  { badge: "account_age_sapling", lowerLimit: 4, upperLimit: 4 },
  { badge: "account_age_blossom", lowerLimit: 5, upperLimit: 5 },
  { badge: "account_age_redwood", lowerLimit: 6, upperLimit: 6 },
  { badge: "account_age_sequoia", lowerLimit: 7, upperLimit: 7 },
  { badge: "account_age_bristlecone", lowerLimit: 8, upperLimit: 8 },
  { badge: "account_age_stromatolite", lowerLimit: 9, upperLimit: 9 },
  { badge: "account_age_primordial", lowerLimit: 10 },
];

/* =========================================================
   GIFT
========================================================= */

const giftLevels = [
  { badge: "gifting_patron", lowerLimit: 1, upperLimit: 1 },
  { badge: "gifting_champion", lowerLimit: 2, upperLimit: 2 },
  { badge: "gifting_luminary", lowerLimit: 3, upperLimit: 5 },
  { badge: "gifting_icon", lowerLimit: 6, upperLimit: 9 },
  { badge: "gifting_hero", lowerLimit: 10, upperLimit: 19 },
  { badge: "gifting_legend", lowerLimit: 20 },
];

/* =========================================================
   GAME TIME
========================================================= */

const gameTimeLevels = [
  { badge: "game_time_casual", lowerLimit: 1, upperLimit: 4 },
  { badge: "game_time_recreational", lowerLimit: 5, upperLimit: 19 },
  { badge: "game_time_dedicated", lowerLimit: 20, upperLimit: 74 },
  { badge: "game_time_committed", lowerLimit: 75, upperLimit: 149 },
  { badge: "game_time_serious", lowerLimit: 150, upperLimit: 299 },
  { badge: "game_time_devoted", lowerLimit: 300, upperLimit: 499 },
  { badge: "game_time_seasoned", lowerLimit: 500, upperLimit: 999 },
  { badge: "game_time_ironclad", lowerLimit: 1000, upperLimit: 1999 },
  { badge: "game_time_unshakeable", lowerLimit: 2000, upperLimit: 4999 },
  { badge: "game_time_eternal", lowerLimit: 5000 },
];

/* =========================================================
   GAME VARIETY
========================================================= */

const gameVarietyLevels = [
  { badge: "game_variety_sampler", lowerLimit: 2, upperLimit: 4 },
  { badge: "game_variety_dabbler", lowerLimit: 5, upperLimit: 9 },
  { badge: "game_variety_enthusiast", lowerLimit: 10, upperLimit: 14 },
  { badge: "game_variety_ranger", lowerLimit: 15, upperLimit: 24 },
  { badge: "game_variety_explorer", lowerLimit: 25, upperLimit: 49 },
  { badge: "game_variety_pioneer", lowerLimit: 50 },
];

/* =========================================================
   STREAMING
========================================================= */

const streamingLevels = [
  { badge: "streaming_newcomer", lowerLimit: 1, upperLimit: 4 },
  { badge: "streaming_fledgling", lowerLimit: 5, upperLimit: 19 },
  { badge: "streaming_breakout", lowerLimit: 20, upperLimit: 74 },
  { badge: "streaming_standout", lowerLimit: 75, upperLimit: 149 },
  { badge: "streaming_trendsetter", lowerLimit: 150, upperLimit: 299 },
  { badge: "streaming_headliner", lowerLimit: 300, upperLimit: 499 },
  { badge: "streaming_star", lowerLimit: 500, upperLimit: 999 },
  { badge: "streaming_sensation", lowerLimit: 1000, upperLimit: 1999 },
  { badge: "streaming_visionary", lowerLimit: 2000, upperLimit: 4999 },
  { badge: "streaming_phenomenon", lowerLimit: 5000 },
];

/* =========================================================
   CURRENT NITRO BADGE
========================================================= */

async function getCurrentNitroBadge(months, nitroSinceDate) {
  if (!nitroSinceDate || !nitroSinceDate.isValid()) {
    return { badge: null, currentBadgeDate: null };
  }

  const currentBadge = nitroLevels.find((badge) => {
    const inLowerLimit = months >= badge.lowerLimit;
    const inUpperLimit =
      typeof badge.upperLimit === "undefined" || months <= badge.upperLimit;
    return inLowerLimit && inUpperLimit;
  });

  return {
    badge: currentBadge?.badge || null,
    currentBadgeDate: nitroSinceDate,
  };
}

/* =========================================================
   NEXT NITRO BADGE
========================================================= */

async function getNextNitroBadge(months, nitroSinceDate) {
  if (!nitroSinceDate || !nitroSinceDate.isValid()) {
    return { badge: null, nextBadgeDate: null };
  }

  for (let i = 0; i < nitroLevels.length; i++) {
    const badge = nitroLevels[i];

    const inside =
      months >= badge.lowerLimit &&
      (typeof badge.upperLimit === "undefined" || months <= badge.upperLimit);

    if (inside) {
      const nextBadge = nitroLevels[i + 1];

      if (nextBadge) {
        const nextBadgeDate = nitroSinceDate.add(nextBadge.lowerLimit, "months");
        return { badge: nextBadge.badge, nextBadgeDate };
      }

      return { badge: "max_badge", nextBadgeDate: null };
    }
  }

  return { badge: null, nextBadgeDate: null };
}

/* =========================================================
   CURRENT BOOST LEVEL
========================================================= */

async function getCurrentBoostLevel(months) {
  const current = boostLevels.find((level) => {
    const above = months >= level.lowerLimit;
    const below =
      typeof level.upperLimit === "undefined" || months <= level.upperLimit;
    return above && below;
  });

  return current?.level || null;
}

/* =========================================================
   NEXT BOOST LEVEL
========================================================= */

async function getNextBoostLevel(months) {
  for (let i = 0; i < boostLevels.length; i++) {
    const level = boostLevels[i];

    const inside =
      months >= level.lowerLimit &&
      (typeof level.upperLimit === "undefined" || months <= level.upperLimit);

    if (inside) {
      const next = boostLevels[i + 1];
      return next ? next.level : "max_level";
    }
  }

  return null;
}

/* =========================================================
   ACCOUNT AGE BADGE
========================================================= */

function getAccountAgeBadge(createdTimestamp) {
  if (!createdTimestamp) {
    return {
      years: 0,
      currentBadge: null,
      nextBadge: null,
      nextBadgeDate: null,
    };
  }

  const createdAt = dayjs(createdTimestamp);
  const now = dayjs();
  const years = now.diff(createdAt, "year");

  const current = accountAgeLevels.find((level) => {
    const above = years >= level.lowerLimit;
    const below =
      typeof level.upperLimit === "undefined" || years <= level.upperLimit;
    return above && below;
  });

  let next = null;
  let nextBadgeDate = null;

  for (let i = 0; i < accountAgeLevels.length; i++) {
    const level = accountAgeLevels[i];

    const inside =
      years >= level.lowerLimit &&
      (typeof level.upperLimit === "undefined" || years <= level.upperLimit);

    if (inside) {
      const candidate = accountAgeLevels[i + 1];
      if (candidate) {
        next = candidate.badge;
        nextBadgeDate = createdAt.add(candidate.lowerLimit, "year");
      }
      break;
    }
  }

  return {
    years,
    createdAt: createdAt.toISOString(),
    currentBadge: current?.badge || null,
    nextBadge: next || (current ? "max_badge" : null),
    nextBadgeDate: nextBadgeDate ? nextBadgeDate.toISOString() : null,
  };
}

/* =========================================================
   GIFT BADGE
========================================================= */

function getGiftBadge(giftCount = 0) {
  if (!giftCount || giftCount < 1) {
    return { count: giftCount, badge: null };
  }

  const current = giftLevels.find((level) => {
    const above = giftCount >= level.lowerLimit;
    const below =
      typeof level.upperLimit === "undefined" || giftCount <= level.upperLimit;
    return above && below;
  });

  return {
    count: giftCount,
    badge: current?.badge || null,
  };
}

/* =========================================================
   GAME TIME BADGE
========================================================= */

function getGameTimeBadge(hours = 0) {
  if (!hours || hours < 1) {
    return { hours, badge: null };
  }

  const current = gameTimeLevels.find((level) => {
    const above = hours >= level.lowerLimit;
    const below =
      typeof level.upperLimit === "undefined" || hours <= level.upperLimit;
    return above && below;
  });

  return {
    hours,
    badge: current?.badge || null,
  };
}

/* =========================================================
   GAME VARIETY BADGE
========================================================= */

function getGameVarietyBadge(gameCount = 0) {
  if (!gameCount || gameCount < 2) {
    return { games: gameCount, badge: null };
  }

  const current = gameVarietyLevels.find((level) => {
    const above = gameCount >= level.lowerLimit;
    const below =
      typeof level.upperLimit === "undefined" || gameCount <= level.upperLimit;
    return above && below;
  });

  return {
    games: gameCount,
    badge: current?.badge || null,
  };
}

/* =========================================================
   STREAMING BADGE
========================================================= */

function getStreamingBadge(hours = 0) {
  if (!hours || hours < 1) {
    return { hours, badge: null };
  }

  const current = streamingLevels.find((level) => {
    const above = hours >= level.lowerLimit;
    const below =
      typeof level.upperLimit === "undefined" || hours <= level.upperLimit;
    return above && below;
  });

  return {
    hours,
    badge: current?.badge || null,
  };
}

/* =========================================================
   BADGES
========================================================= */

async function getUserBadges(response) {
  if (!Array.isArray(response?.badges)) {
    return [];
  }

  return response.badges
    .map((badge) => {
      if (typeof badge === "string") {
        return badge;
      }

      if (badge && typeof badge.id === "string") {
        return badge.id;
      }

      return null;
    })
    .filter(Boolean);
}

/* =========================================================
   STATUS / PRESENCE
========================================================= */

async function getUserPresence(userId) {
  try {
    const guilds = client.guilds.cache;
    let foundPresence = null;

    for (const guild of guilds.values()) {
      try {
        const member = guild.members.cache.get(userId);
        if (!member) continue;

        const status = member.presence?.status;
        if (!status) continue;

        if (status === "dnd") return "dnd";

        if (status === "idle" && foundPresence !== "dnd") {
          foundPresence = "idle";
        }

        if (status === "online" && !foundPresence) {
          foundPresence = "online";
        }
      } catch {
        continue;
      }
    }

    return foundPresence || "offline";
  } catch {
    return "offline";
  }
}

/* =========================================================
   MAIN RESPONSE
========================================================= */

async function getUserResponse(response) {
  /* =====================================================
     BANNER
  ===================================================== */

  let bannerUrl = null;

  if (response?.user_profile?.banner) {
    const extension = response.user_profile.banner.startsWith("a_")
      ? ".gif?size=4096"
      : ".png?size=4096";

    bannerUrl = `https://cdn.discordapp.com/banners/${response.user.id}/${response.user_profile.banner}${extension}`;
  }

  /* =====================================================
     DATAS
  ===================================================== */

  const currentDate = dayjs();

  const nitroSinceDate = response?.premium_since
    ? dayjs(response.premium_since)
    : null;

  const premiumSinceDate = response?.premium_guild_since
    ? dayjs(response.premium_guild_since)
    : null;

  /* =====================================================
     MESES NITRO
  ===================================================== */

  const monthsPassedNitro =
    nitroSinceDate && nitroSinceDate.isValid()
      ? currentDate.diff(nitroSinceDate, "month")
      : 0;

  /* =====================================================
     MESES BOOST
  ===================================================== */

  const monthsPassedBoost =
    premiumSinceDate && premiumSinceDate.isValid()
      ? currentDate.diff(premiumSinceDate, "month")
      : 0;

  /* =====================================================
     BOOST CALCULADO
  ===================================================== */

  let currentBoostLevel = null;
  let nextBoostLevel = null;

  if (premiumSinceDate && premiumSinceDate.isValid()) {
    currentBoostLevel = await getCurrentBoostLevel(monthsPassedBoost);
    nextBoostLevel = await getNextBoostLevel(monthsPassedBoost);
  }

  /* =====================================================
     DATAS DE BOOST
  ===================================================== */

  let nextDate = null;

  if (premiumSinceDate && premiumSinceDate.isValid()) {
    const monthsVerification = [2, 3, 6, 9, 12, 15, 18, 24];

    const futureDates = monthsVerification
      .map((months) => {
        const targetDate = premiumSinceDate.add(months, "months");
        if (currentDate.isBefore(targetDate)) {
          return targetDate;
        }
        return null;
      })
      .filter(Boolean);

    nextDate = futureDates.length > 0 ? futureDates[0] : null;
  }

  /* =====================================================
     NITRO BADGES
  ===================================================== */

  const currentNitroBadgeData = await getCurrentNitroBadge(
    monthsPassedNitro,
    nitroSinceDate
  );

  const nextNitroBadgeData = await getNextNitroBadge(
    monthsPassedNitro,
    nitroSinceDate
  );

  /* =====================================================
     BADGES ORIGINAIS
  ===================================================== */

  const badges = await getUserBadges(response);

  if (
    currentNitroBadgeData?.badge &&
    !badges.includes(currentNitroBadgeData.badge)
  ) {
    badges.unshift(currentNitroBadgeData.badge);
  }

  /* =====================================================
     DISCORD USER
  ===================================================== */

  const target = await client.users.fetch(response.user.id);

  /* =====================================================
     ACCOUNT AGE BADGE
  ===================================================== */

  const accountAgeData = getAccountAgeBadge(target.createdTimestamp);

  if (
    accountAgeData.currentBadge &&
    !badges.includes(accountAgeData.currentBadge)
  ) {
    badges.push(accountAgeData.currentBadge);
  }

  /* =====================================================
     ENGAGEMENT BADGES
  ===================================================== */

  // Valores vindos da resposta da API (quando presentes).
  // A API de perfil não expõe esses contadores por padrão;
  // se o seu backend já os fornece, eles entram aqui.
  const giftCount = response?.gift_count ?? 0;
  const gameTimeHours = response?.game_time_hours ?? 0;
  const gameVarietyCount = response?.game_variety_count ?? 0;
  const streamingHours = response?.streaming_hours ?? 0;

  const giftData = getGiftBadge(giftCount);
  const gameTimeData = getGameTimeBadge(gameTimeHours);
  const gameVarietyData = getGameVarietyBadge(gameVarietyCount);
  const streamingData = getStreamingBadge(streamingHours);

  for (const data of [giftData, gameTimeData, gameVarietyData, streamingData]) {
    if (data.badge && !badges.includes(data.badge)) {
      badges.push(data.badge);
    }
  }

  /* =====================================================
     PRESENCE
  ===================================================== */

  const status = await getUserPresence(response.user.id);

  /* =====================================================
     THEME
  ===================================================== */

  const theme_colors = response?.user_profile?.theme_colors;

  const colorsArray = Object.values(theme_colors || {}).map(
    (color) => `#${color.toString(16).padStart(6, "0")}`
  );

  const colorsString = colorsArray.join(", ");

  /* =====================================================
     RESPONSE
  ===================================================== */

  return {
    user: {
      id: response.user.id,

      createdAt: target.createdAt,

      createdTimestamp: target.createdTimestamp,

      username: response.user.username,

      tag: target.tag,

      global_name: response.user.global_name,

      legacy_username: response?.legacy_username || null,

      discriminator: response.user.discriminator,

      flags: response.user.flags,

      avatar: response.user.avatar,

      avatar_url: target.displayAvatarURL({
        size: 4096,
        extension: "png",
        dynamic: true,
      }),

      banner: response.user.banner,

      banner_url: bannerUrl,
    },

    user_profile: {
      bio: response?.user_profile?.bio || null,

      pronouns: response?.user_profile?.pronouns || null,

      theme_colors: colorsString || null,
    },

    /* ===================================================
       PRESENCE
    =================================================== */

    presence: {
      status,
    },

    /* ===================================================
       ACCOUNT AGE
    =================================================== */

    account_age: {
      years: accountAgeData.years,

      created_at: accountAgeData.createdAt,

      current_badge: accountAgeData.currentBadge,

      next_badge: accountAgeData.nextBadge,

      next_badge_date: accountAgeData.nextBadgeDate,
    },

    /* ===================================================
       NITRO
    =================================================== */

    nitro: {
      premium_type:
        response?.premium_type == 1
          ? "nitro_classic"
          : response?.premium_type == 2
            ? "nitro_boost"
            : response?.premium_type == 3
              ? "nitro_basic"
              : null,

      premium_since: response?.premium_since || null,

      premium_guild_since: response?.premium_guild_since || null,

      current_badge: currentNitroBadgeData?.badge || null,

      current_badge_date: currentNitroBadgeData?.currentBadgeDate || null,

      next_badge: nextNitroBadgeData?.badge || null,

      next_badge_date: nextNitroBadgeData?.nextBadgeDate || null,
    },

    /* ===================================================
       BOOST
    =================================================== */

    boost: {
      current_level: currentBoostLevel || null,

      current_level_date: response?.premium_guild_since || null,

      next_level: nextBoostLevel || null,

      next_level_date: nextDate ? nextDate.format() : null,
    },

    /* ===================================================
       ENGAGEMENT
    =================================================== */

    engagement: {
      gifting: giftData,

      game_time: gameTimeData,

      game_variety: gameVarietyData,

      streaming: streamingData,
    },

    badges,

    connected_accounts: response?.connected_accounts || [],
  };
}

export { getUserResponse };
