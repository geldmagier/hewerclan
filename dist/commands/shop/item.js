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
    description: "Show a specific Item",
    type: swagcommands_1.CommandType.SLASH,
    testOnly: true,
    options: [
        {
            name: "name",
            description: "The name of the item",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        },
    ],
    autocomplete: (command, arg) => __awaiter(void 0, void 0, void 0, function* () {
        if (arg === "name") {
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
        return item.getEmbed();
    }),
};
