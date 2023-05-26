"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const discord_js_1 = require("discord.js");
const path_1 = __importDefault(require("path"));
const swagcommands_1 = __importStar(require("swagcommands/"));
const logger_1 = __importDefault(require("./util/logger"));
const client_1 = require("@prisma/client");
require("dotenv/config");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildMembers,
    ],
});
exports.prisma = new client_1.PrismaClient();
client.on("ready", () => {
    new swagcommands_1.default({
        client,
        testServers: [process.env.SERVER_ID],
        botOwners: [process.env.OWNER_ID],
        disabledDefaultCommands: [
            swagcommands_1.DefaultCommands.ChannelCommand,
            swagcommands_1.DefaultCommands.CustomCommand,
            swagcommands_1.DefaultCommands.Prefix,
            swagcommands_1.DefaultCommands.Help,
            swagcommands_1.DefaultCommands.RequiredPermissions,
            swagcommands_1.DefaultCommands.RequiredRoles,
            swagcommands_1.DefaultCommands.ToggleCommand,
        ],
        commandsDir: path_1.default.join(__dirname, "commands"),
        events: {
            dir: path_1.default.join(__dirname, "events"),
        },
        featuresDir: path_1.default.join(__dirname, "features"),
    });
    logger_1.default.info("Bot ist bereit!");
});
client.login(process.env.TOKEN);
