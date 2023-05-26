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
    description: "Remove an Item from the shop",
    type: swagcommands_1.CommandType.SLASH,
    testOnly: true,
    guildOnly: true,
    permissions: [discord_js_1.PermissionFlagsBits.Administrator],
    options: [
        {
            name: "item",
            description: "The item to remove",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        },
    ],
    autocomplete: (command, arg) => __awaiter(void 0, void 0, void 0, function* () {
        if (arg === "item") {
            const items = yield Item_1.default.getAll();
            const names = items.map((item) => item.name);
            return names;
        }
    }),
    callback: ({ interaction, args, client }) => __awaiter(void 0, void 0, void 0, function* () {
        const item = new Item_1.default(args[0]);
        const itemData = yield item.get();
        if (!itemData)
            return {
                content: `Item \`${args[0]}\` not found.`,
                ephemeral: true,
            };
        try {
            const deleted = yield item.delete();
            if (!deleted)
                return {
                    content: `An error occured while deleting the item \`${args[0]}\``,
                    ephemeral: true,
                };
            return {
                content: `Item \`${args[0]}\` deleted!`,
                ephemeral: true,
            };
        }
        catch (err) {
            console.log(err);
            return {
                content: `An error occured while deleting the item \`${args[0]}\``,
                ephemeral: true,
            };
        }
    }),
};
