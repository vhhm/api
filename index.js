
import { Client, GatewayIntentBits, Partials } from "discord.js";
import "colors";
import cors from "cors";
import express from "express";
import requestIp from "request-ip";
import { config } from "dotenv";
import registerRoutes from "./handler.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viewsFile = path.join(__dirname, "views.json");

if (!fs.existsSync(viewsFile)) {
  fs.writeFileSync(
    viewsFile,
    JSON.stringify(
      {
        views: 0,
      },
      null,
      2
    )
  );
}

function getViews() {
  try {
    const data = fs.readFileSync(
      viewsFile,
      "utf8"
    );

    const json = JSON.parse(data);

    return Number(json.views) || 0;
  } catch (error) {
    console.error(
      "[VIEWS] Erro ao ler contador:",
      error
    );

    return 0;
  }
}

function saveViews(views) {
  fs.writeFileSync(
    viewsFile,
    JSON.stringify(
      {
        views,
      },
      null,
      2
    )
  );
}

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.Guilds,
  ],

  partials: [
    Partials.User,
    Partials.GuildMember,
  ],
});

const app = express();

app.use(requestIp.mw());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

registerRoutes(app);
app.get("/views", (req, res) => {
  const views = getViews();

  res.json({
    views,
  });
});

app.post("/views", (req, res) => {
  try {
    const currentViews = getViews();

    const newViews = currentViews + 1;

    saveViews(newViews);

    console.log(
      `[👁️ VIEW] Nova visualização: ${newViews}`
    );

    res.json({
      success: true,
      views: newViews,
    });
  } catch (error) {
    console.error(
      "[VIEWS] Erro ao registrar:",
      error
    );

    res.status(500).json({
      success: false,
      error: "Não foi possível registrar a visualização.",
    });
  }
});

app.listen(80, () => {
  console.log(
    "[📡 EXPRESS SERVER]".bgMagenta,
    "Online: Port 80".magenta
  );

  client
    .login(process.env?.bot_token)
    .then(() => {
      console.log(
        "[🤖 DISCORD BOT]".bgCyan,
        `Connected: ${client.user.tag}`.cyan
      );
    })
    .catch(console.error);
});

export { client };

process.on("unhandledRejection", (r) => {
  console.error(r);
});

process.on("uncaughtException", (e) => {
  console.error(e);
});
