
import { client } from "../index.js";
import { getUserResponse } from "../controllers/usersController.js";

export const method = "get";
export const name = "/user/:id";

export const execute = async (req, res) => {
  const { id } = req.params;

  if (!/^\d{17,20}$/.test(id)) {
    return res.status(400).json({
      status: 400,
      message: "ID do Discord inválido."
    });
  }

  try {
    const tokens = [
      process.env.DISCORD_TOKEN_1,
      process.env.DISCORD_TOKEN_2,
      process.env.DISCORD_TOKEN_3
    ].filter(Boolean);

    console.log("[PROFILE] ID:", id);
    console.log("[PROFILE] Tokens disponíveis:", tokens.length);

    let response = null;

    for (let i = 0; i < tokens.length; i++) {
      try {
        const discordResponse = await fetch(
          `https://canary.discord.com/api/v10/users/${id}/profile`,
          {
            headers: {
              Authorization: tokens[i]
            }
          }
        );

        const body = await discordResponse.text();

        console.log(
          `[PROFILE] Token ${i + 1} HTTP:`,
          discordResponse.status
        );

        if (!discordResponse.ok) {
          console.error(
            `[PROFILE] Resposta Discord ${i + 1}:`,
            body.slice(0, 1000)
          );
          continue;
        }

        response = JSON.parse(body);
        break;

      } catch (error) {
        console.error(
          `[PROFILE] Erro token ${i + 1}:`,
          error.message
        );
      }
    }

    if (!response) {
      return res.status(502).json({
        status: 502,
        message: "Não foi possível obter o perfil do Discord."
      });
    }

    if (!response.user?.id) {
      console.error("[PROFILE] Estrutura inesperada:", JSON.stringify(response).slice(0, 1000));

      return res.status(502).json({
        status: 502,
        message: "O Discord retornou uma resposta inesperada."
      });
    }

    const userResponse = await getUserResponse(response);

    return res.json(userResponse);

  } catch (error) {
    console.error("[PROFILE] Erro geral:", error);

    return res.status(500).json({
      status: 500,
      message: "Erro ao processar o perfil.",
      error: error.message
    });
  }
};
