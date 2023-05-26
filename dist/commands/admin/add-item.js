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
const Item_1 = __importDefault(require("../../util/database/Item"));
exports.default = {
    description: "Add an Item to the shop",
    type: swagcommands_1.CommandType.SLASH,
    testOnly: true,
    options: [
        {
            name: "name",
            description: "The name of the item",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "price",
            description: "The price of the item",
            type: discord_js_1.ApplicationCommandOptionType.Integer,
            required: true,
        },
        {
            name: "image",
            description: "The image of the item",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    callback: ({ interaction, args, client }) => __awaiter(void 0, void 0, void 0, function* () {
        const name = args[0];
        const price = args[1];
        const image = args[2];
        const item = new Item_1.default(name, parseInt(price), image);
        const created = yield item.create();
        if (!created)
            return {
                content: `An item with the name \`${name}\` already exists!`,
                ephemeral: true,
            };
        const embed = yield item.getEmbed();
        embed === null || embed === void 0 ? void 0 : embed.embeds[0].setTitle(`Item \`${name}\` created!`);
        return {
            embeds: [embed === null || embed === void 0 ? void 0 : embed.embeds[0]],
            ephemeral: true,
        };
    }),
};
