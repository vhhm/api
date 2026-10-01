import { client } from "../index.js";
import { getUserResponse } from "../controllers/usersController.js";

export const method = "get";
export const name = "/user/:id";

export const execute = async (req, res) => {
 const { id } = req.params;

 const tokens = [
    "",
    "",
    ""
];

 const getUsers = async () => {
  let response = null;

  for (const token of tokens) {
   try {
    response = await fetch(`https://canary.discord.com/api/v10/users/${id}/profile`, {
     headers: { Authorization: token },
    }).then((res) => res.json());

    if (response && !response.message) {
     break;
    }
   } catch (e) {
    console.error(e);
   }
  }

  const target = await client.users?.fetch(id).catch(() => null);
  if (!target) {
   return res.status(400).json({ status: 400, message: "Coloque um id de usuário válido." });
  }

  if (!response) {
   return res.status(500).json({ status: 500, message: "Erro ao obter o perfil do usuário." });
  }

  try {
   const userResponse = await getUserResponse(response);
   return res.json(userResponse);
  } catch (error) {
   console.error(e);
   return res.status(500).json({ status: 500, message: "Erro ao processar a resposta do usuário." });
  }
 };

 await getUsers();
};