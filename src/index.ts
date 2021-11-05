import { GatewayServer } from "slash-create";
import client from "./client";
import creator from "./creator";
import dotenv from "dotenv";
import { generateDocs } from "./docs";
import path from "path";
import player from "./player";
import { registerPlayerEvents } from "./events";

dotenv.config();

registerPlayerEvents(player);

client.on("ready", () => {
  if (!client.user) {
    console.log("User not found");
    return;
  }

  console.log(`Logged in as ${client.user.tag}!`);

  generateDocs(creator.commands);
});

creator
  .withServer(
    new GatewayServer((handler) => client.ws.on("INTERACTION_CREATE", handler))
  )
  .registerCommandsIn(path.join(__dirname, "commands"));

if (process.env.DISCORD_GUILD_ID) {
  creator.syncCommandsIn(process.env.DISCORD_GUILD_ID);
} else creator.syncCommands();

client.login(process.env.DISCORD_CLIENT_TOKEN);

export { creator };
