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
   CURRENT NITRO BADGE
========================================================= */

async function getCurrentNitroBadge(
  months,
  nitroSinceDate
) {
  if (
    !nitroSinceDate ||
    !nitroSinceDate.isValid()
  ) {
    return {
      badge: null,
      currentBadgeDate: null,
    };
  }

  const currentBadge =
    nitroLevels.find((badge) => {
      const inLowerLimit =
        months >= badge.lowerLimit;

      const inUpperLimit =
        typeof badge.upperLimit === "undefined" ||
        months <= badge.upperLimit;

      return (
        inLowerLimit &&
        inUpperLimit
      );
    });

  return {
    badge: currentBadge?.badge || null,
    currentBadgeDate: nitroSinceDate,
  };
}

/* =========================================================
   NEXT NITRO BADGE
========================================================= */

async function getNextNitroBadge(
  months,
  nitroSinceDate
) {
  if (
    !nitroSinceDate ||
    !nitroSinceDate.isValid()
  ) {
    return {
      badge: null,
      nextBadgeDate: null,
    };
  }

  for (
    let i = 0;
    i < nitroLevels.length;
    i++
  ) {
    const badge = nitroLevels[i];

    const inside =
      months >= badge.lowerLimit &&
      (
        typeof badge.upperLimit === "undefined" ||
        months <= badge.upperLimit
      );

    if (inside) {
      const nextBadge =
        nitroLevels[i + 1];

      if (nextBadge) {
        const nextBadgeDate =
          nitroSinceDate.add(
            nextBadge.lowerLimit,
            "months"
          );

        return {
          badge: nextBadge.badge,
          nextBadgeDate,
        };
      }

      return {
        badge: "max_badge",
        nextBadgeDate: null,
      };
    }
  }

  return {
    badge: null,
    nextBadgeDate: null,
  };
}

/* =========================================================
   CURRENT BOOST LEVEL
========================================================= */

async function getCurrentBoostLevel(
  months
) {
  const current =
    boostLevels.find((level) => {
      const above =
        months >= level.lowerLimit;

      const below =
        typeof level.upperLimit === "undefined" ||
        months <= level.upperLimit;

      return above && below;
    });

  return current?.level || null;
}

/* =========================================================
   NEXT BOOST LEVEL
========================================================= */

async function getNextBoostLevel(
  months
) {
  for (
    let i = 0;
    i < boostLevels.length;
    i++
  ) {
    const level =
      boostLevels[i];

    const inside =
      months >= level.lowerLimit &&
      (
        typeof level.upperLimit === "undefined" ||
        months <= level.upperLimit
      );

    if (inside) {
      const next =
        boostLevels[i + 1];

      return next
        ? next.level
        : "max_level";
    }
  }

  return null;
}

/* =========================================================
   BADGES

   Aqui está a regra importante:

   O que já veio em response.badges é preservado.

   NÃO adicionamos guild_booster_lvl1/2/etc
   automaticamente.

   Portanto:

   badges:
   [
     "nitro_gold",
     "premium_tenure_6_month_v2"
   ]

   NÃO terá boost.

   Se o Discord/API retornar:

   badges:
   [
     "nitro_gold",
     "premium_tenure_6_month_v2",
     "guild_booster_lvl1"
   ]

   aí terá boost.
========================================================= */

async function getUserBadges(response) {
  if (
    !Array.isArray(response?.badges)
  ) {
    return [];
  }

  return response.badges
    .map((badge) => {
      if (typeof badge === "string") {
        return badge;
      }

      if (
        badge &&
        typeof badge.id === "string"
      ) {
        return badge.id;
      }

      return null;
    })
    .filter(Boolean);
}

/* =========================================================
   STATUS / PRESENCE
========================================================= */

/*
  O endpoint de usuário não traz presença por padrão.

  Tentamos encontrar o usuário nos servidores
  em que o bot está e pegar:

  member.presence.status

  Valores:

  online
  idle
  dnd
  offline
*/

async function getUserPresence(userId) {
  try {
    const guilds =
      client.guilds.cache;

    let foundPresence = null;

    for (const guild of guilds.values()) {
      try {
        const member =
          guild.members.cache.get(
            userId
          );

        if (!member) {
          continue;
        }

        const status =
          member.presence?.status;

        if (!status) {
          continue;
        }

        /*
          Se encontrar DND, damos prioridade.
        */

        if (status === "dnd") {
          return "dnd";
        }

        if (
          status === "idle" &&
          foundPresence !== "dnd"
        ) {
          foundPresence = "idle";
        }

        if (
          status === "online" &&
          !foundPresence
        ) {
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

  if (
    response?.user_profile?.banner
  ) {
    const extension =
      response.user_profile.banner.startsWith(
        "a_"
      )
        ? ".gif?size=4096"
        : ".png?size=4096";

    bannerUrl =
      `https://cdn.discordapp.com/banners/${response.user.id}/${response.user_profile.banner}${extension}`;
  }

  /* =====================================================
     DATAS
  ===================================================== */

  const currentDate =
    dayjs();

  const nitroSinceDate =
    response?.premium_since
      ? dayjs(
          response.premium_since
        )
      : null;

  const premiumSinceDate =
    response?.premium_guild_since
      ? dayjs(
          response.premium_guild_since
        )
      : null;

  /* =====================================================
     MESES NITRO
  ===================================================== */

  const monthsPassedNitro =
    nitroSinceDate &&
    nitroSinceDate.isValid()
      ? currentDate.diff(
          nitroSinceDate,
          "month"
        )
      : 0;

  /* =====================================================
     MESES BOOST

     Só calcula se realmente
     existir premium_guild_since.
  ===================================================== */

  const monthsPassedBoost =
    premiumSinceDate &&
    premiumSinceDate.isValid()
      ? currentDate.diff(
          premiumSinceDate,
          "month"
        )
      : 0;

  /* =====================================================
     BOOST CALCULADO

     Isso fica apenas no objeto boost.

     NÃO entra em badges.
  ===================================================== */

  let currentBoostLevel = null;
  let nextBoostLevel = null;

  if (
    premiumSinceDate &&
    premiumSinceDate.isValid()
  ) {
    currentBoostLevel =
      await getCurrentBoostLevel(
        monthsPassedBoost
      );

    nextBoostLevel =
      await getNextBoostLevel(
        monthsPassedBoost
      );
  }

  /* =====================================================
     DATAS DE BOOST
  ===================================================== */

  let nextDate = null;

  if (
    premiumSinceDate &&
    premiumSinceDate.isValid()
  ) {
    const monthsVerification = [
      2,
      3,
      6,
      9,
      12,
      15,
      18,
      24,
    ];

    const futureDates =
      monthsVerification
        .map((months) => {
          const targetDate =
            premiumSinceDate.add(
              months,
              "months"
            );

          if (
            currentDate.isBefore(
              targetDate
            )
          ) {
            return targetDate;
          }

          return null;
        })
        .filter(Boolean);

    nextDate =
      futureDates.length > 0
        ? futureDates[0]
        : null;
  }

  /* =====================================================
     NITRO BADGES
  ===================================================== */

  const currentNitroBadgeData =
    await getCurrentNitroBadge(
      monthsPassedNitro,
      nitroSinceDate
    );

  const nextNitroBadgeData =
    await getNextNitroBadge(
      monthsPassedNitro,
      nitroSinceDate
    );

  /* =====================================================
     BADGES ORIGINAIS
  ===================================================== */

  const badges =
    await getUserBadges(
      response
    );

  /*
   * Adiciona o nível de Nitro calculado
   * somente se ainda não existir.
   */

  if (
    currentNitroBadgeData?.badge &&
    !badges.includes(
      currentNitroBadgeData.badge
    )
  ) {
    badges.unshift(
      currentNitroBadgeData.badge
    );
  }

  /* =====================================================
     DISCORD USER
  ===================================================== */

  const target =
    await client.users.fetch(
      response.user.id
    );

  /* =====================================================
     PRESENCE
  ===================================================== */

  const status =
    await getUserPresence(
      response.user.id
    );

  /* =====================================================
     THEME
  ===================================================== */

  const theme_colors =
    response?.user_profile
      ?.theme_colors;

  const colorsArray =
    Object.values(
      theme_colors || {}
    ).map(
      (color) =>
        `#${color
          .toString(16)
          .padStart(6, "0")}`
    );

  const colorsString =
    colorsArray.join(", ");

  /* =====================================================
     RESPONSE
  ===================================================== */

  return {
    user: {
      id: response.user.id,

      createdAt:
        target.createdAt,

      createdTimestamp:
        target.createdTimestamp,

      username:
        response.user.username,

      tag:
        target.tag,

      global_name:
        response.user.global_name,

      legacy_username:
        response?.legacy_username ||
        null,

      discriminator:
        response.user.discriminator,

      flags:
        response.user.flags,

      avatar:
        response.user.avatar,

      avatar_url:
        target.displayAvatarURL({
          size: 4096,
          extension: "png",
          dynamic: true,
        }),

      banner:
        response.user.banner,

      banner_url:
        bannerUrl,
    },

    user_profile: {
      bio:
        response?.user_profile?.bio ||
        null,

      pronouns:
        response?.user_profile
          ?.pronouns ||
        null,

      theme_colors:
        colorsString || null,
    },

    /* ===================================================
       PRESENCE
    =================================================== */

    presence: {
      status,
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

      premium_since:
        response?.premium_since ||
        null,

      premium_guild_since:
        response?.premium_guild_since ||
        null,

      current_badge:
        currentNitroBadgeData?.badge ||
        null,

      current_badge_date:
        currentNitroBadgeData?.currentBadgeDate ||
        null,

      next_badge:
        nextNitroBadgeData?.badge ||
        null,

      next_badge_date:
        nextNitroBadgeData?.nextBadgeDate ||
        null,
    },


    boost: {
      current_level:
        currentBoostLevel || null,

      current_level_date:
        response?.premium_guild_since ||
        null,

      next_level:
        nextBoostLevel || null,

      next_level_date:
        nextDate
          ? nextDate.format()
          : null,
    },

    badges,

    connected_accounts:
      response?.connected_accounts ||
      [],
  };
}

export {
  getUserResponse,
};
