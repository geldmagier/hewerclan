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
const Raffle_1 = __importDefault(require("../../util/database/Raffle"));
exports.default = {
    description: "Manage the raffles",
    type: swagcommands_1.CommandType.SLASH,
    testOnly: true,
    guildOnly: true,
    permissions: [discord_js_1.PermissionFlagsBits.Administrator],
    options: [
        {
            name: "start",
            description: "Start a raffle",
            type: discord_js_1.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "item",
                    description: "The item to raffle",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true,
                    autocomplete: true,
                },
                {
                    name: "duration",
                    description: "The duration of the raffle (in minutes)",
                    type: discord_js_1.ApplicationCommandOptionType.Integer,
                    required: true,
                },
            ],
        },
    ],
    autocomplete: (command, arg) => __awaiter(void 0, void 0, void 0, function* () {
        if (arg === "item") {
            const items = yield Item_1.default.getAll();
            return items.map((item) => item.name);
        }
    }),
    callback: ({ interaction, client }) => __awaiter(void 0, void 0, void 0, function* () {
        const subcommand = interaction === null || interaction === void 0 ? void 0 : interaction.options.data[0];
        const args = interaction === null || interaction === void 0 ? void 0 : interaction.options.data[0].options.map((option) => option.value);
        if ((subcommand === null || subcommand === void 0 ? void 0 : subcommand.name) === "start") {
            const item = new Item_1.default(args[0]);
            const itemData = yield item.get();
            if (!itemData)
                return {
                    content: `Item \`${args[0]}\` not found.`,
                    ephemeral: true,
                };
            const raffle = new Raffle_1.default(item);
            const raffleData = yield raffle.getByItem();
            if (raffleData)
                return {
                    content: `Raffle for \`${itemData.name}\` has already started.`,
                    ephemeral: true,
                };
            const created = yield raffle.create(parseInt(args[1]));
            if (!created)
                return {
                    content: `Failed to create raffle for \`${itemData.name}\`.`,
                    ephemeral: true,
                };
            const embed = new discord_js_1.EmbedBuilder()
                .setColor("#E8BCCA")
                .setTitle("Raffle Started")
                .setDescription(`Raffle for \`${itemData.name}\` has started.`)
                .setFooter({
                text: `Ends in ${args[1]} minutes.`,
            })
                .setTimestamp()
                .setImage(itemData.imageUrl);
            return {
                embeds: [embed],
                ephemeral: true,
            };
        }
    }),
};
