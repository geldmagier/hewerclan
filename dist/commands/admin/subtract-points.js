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
    description: "Subtract points from a user",
    type: swagcommands_1.CommandType.SLASH,
    testOnly: true,
    guildOnly: true,
    permissions: [discord_js_1.PermissionFlagsBits.Administrator],
    options: [
        {
            name: "user",
            description: "The user to subtract points from",
            type: discord_js_1.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "amount",
            description: "The amount of points to subtract",
            type: discord_js_1.ApplicationCommandOptionType.Integer,
            required: true,
        },
    ],
    callback: ({ interaction, args, client }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = new User_1.default(args[0]);
        const userData = yield user.get();
        const amount = parseInt(args[1]);
        if (isNaN(amount))
            return {
                content: "The amount must be a number",
                ephemeral: true,
            };
        if (amount < 0)
            return {
                content: "The amount must be a positive number",
                ephemeral: true,
            };
        if (amount > (userData === null || userData === void 0 ? void 0 : userData.balance))
            return {
                content: `You can't subtract more than ${userData === null || userData === void 0 ? void 0 : userData.balance} ${Messages_1.default.CURRENCY} from <@${args[0]}>`,
                ephemeral: true,
            };
        yield user.subtract(amount).catch((err) => {
            console.error(err);
            return {
                content: "An error occurred while subtracting points",
                ephemeral: true,
            };
        });
        return {
            content: `You subtracted \`${amount}\` ${Messages_1.default.CURRENCY} from <@${args[0]}> 's balance.`,
            ephemeral: true,
        };
    }),
};
