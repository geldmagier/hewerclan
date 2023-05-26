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
const User_1 = __importDefault(require("../../util/database/User"));
exports.default = {
    description: "Add points to a user",
    type: swagcommands_1.CommandType.SLASH,
    testOnly: true,
    guildOnly: true,
    permissions: [discord_js_1.PermissionFlagsBits.Administrator],
    options: [
        {
            name: "user",
            description: "The user you want to add points to",
            type: discord_js_1.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "amount",
            description: "The amount of points you want to add",
            type: discord_js_1.ApplicationCommandOptionType.Integer,
            required: true,
        },
    ],
    callback: ({ interaction, args, client }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = new User_1.default(args[0]);
        const amount = parseInt(args[1]);
        if (isNaN(amount))
            return {
                content: "The amount must be a number",
                ephemeral: true,
            };
        yield user.add(amount).catch((err) => {
            console.error(err);
            return {
                content: "An error occurred while adding points",
                ephemeral: true,
            };
        });
        return {
            content: `You added \`${amount}\` ${Messages_1.default.CURRENCY} to <@${args[0]}> 's balance.`,
        };
    }),
};
