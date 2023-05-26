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
const Shop_1 = __importDefault(require("../../util/database/Shop"));
exports.default = {
    description: "Display the shop",
    type: swagcommands_1.CommandType.SLASH,
    testOnly: true,
    guildOnly: true,
    permissions: [discord_js_1.PermissionFlagsBits.Administrator],
    options: [],
    callback: ({ interaction, args, client }) => __awaiter(void 0, void 0, void 0, function* () {
        const shop = new Shop_1.default(client);
        const embed = yield shop.getEmbed();
        return embed;
    }),
};
