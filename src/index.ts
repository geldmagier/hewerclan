import { Client, GatewayIntentBits } from "discord.js";
import path from "path";
import SWAGCommands, { DefaultCommands } from "swagcommands/";
import Logger from "./util/logger";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

export const prisma = new PrismaClient();

client.on("ready", () => {
	new SWAGCommands({
		client,
		testServers: [process.env.SERVER_ID!],
		botOwners: [process.env.OWNER_ID!],

		disabledDefaultCommands: [
			DefaultCommands.ChannelCommand,
			DefaultCommands.CustomCommand,
			DefaultCommands.Prefix,
			DefaultCommands.Help,
			DefaultCommands.RequiredPermissions,
			DefaultCommands.RequiredRoles,
			DefaultCommands.ToggleCommand,
		],

		commandsDir: path.join(__dirname, "commands"),
		events: {
			dir: path.join(__dirname, "events"),
		},
		featuresDir: path.join(__dirname, "features"),
	});

	Logger.info("Bot ist bereit!");
});

client.login(process.env.TOKEN);
