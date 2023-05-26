"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const swagcommands_1 = require("swagcommands");
const Messages_1 = __importDefault(require("../../util/config/Messages"));
exports.default = {
    description: "Send the balance button",
    type: swagcommands_1.CommandType.SLASH,
    testOnly: true,
    guildOnly: true,
    options: [],
    permissions: [discord_js_1.PermissionFlagsBits.Administrator],
    callback: ({ interaction, args, client }) => __awaiter(void 0, void 0, void 0, function* () {
        const button = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setLabel("Check Balance")
            .setStyle(discord_js_1.ButtonStyle.Secondary)
            .setCustomId("check-balance"));
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(Messages_1.default.BALANCE_TITLE)
            .setDescription(Messages_1.default.BALANCE_DESCRIPTION)
            .setColor(Messages_1.default.BALANCE_COLOR);
        return {
            embeds: [embed],
            components: [button],
        };
    }),
};
