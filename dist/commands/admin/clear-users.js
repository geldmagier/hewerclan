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
const __1 = require("../..");
const User_1 = __importDefault(require("../../util/database/User"));
exports.default = {
    description: "Clear all user data",
    type: swagcommands_1.CommandType.SLASH,
    testOnly: true,
    guildOnly: true,
    ownerOnly: true,
    permissions: [discord_js_1.PermissionFlagsBits.Administrator],
    options: [],
    callback: ({ interaction, args, client }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const users = yield User_1.default.getAll();
        const embed = new discord_js_1.EmbedBuilder()
            .setColor("Red")
            .setTitle("Are you sure?")
            .setDescription("This will delete all user data. This action cannot be undone.")
            .setTimestamp();
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId("clear-users-confirm")
            .setLabel("Confirm")
            .setStyle(discord_js_1.ButtonStyle.Danger), new discord_js_1.ButtonBuilder()
            .setCustomId("clear-users-cancel")
            .setLabel("Cancel")
            .setStyle(discord_js_1.ButtonStyle.Primary));
        yield (interaction === null || interaction === void 0 ? void 0 : interaction.reply({
            embeds: [embed],
            components: [row],
        }));
        const filter = (i) => i.user.id === (interaction === null || interaction === void 0 ? void 0 : interaction.user.id);
        const collector = (_a = interaction === null || interaction === void 0 ? void 0 : interaction.channel) === null || _a === void 0 ? void 0 : _a.createMessageComponentCollector({
            filter,
            time: 10000,
        });
        collector === null || collector === void 0 ? void 0 : collector.on("collect", (i) => __awaiter(void 0, void 0, void 0, function* () {
            if (i.customId === "clear-users-confirm") {
                yield i.deferUpdate();
                yield i.editReply({
                    embeds: [
                        embed
                            .setDescription("Deleting all user data..")
                            .setTitle("Deleting..."),
                    ],
                    components: [],
                });
                for (const user of users) {
                    yield __1.prisma.ticket.deleteMany({
                        where: {
                            userId: user.id,
                        },
                    });
                    yield __1.prisma.entry.deleteMany({
                        where: {
                            userId: user.id,
                        },
                    });
                    yield __1.prisma.user.delete({
                        where: {
                            id: user.id,
                        },
                    });
                }
                yield i.editReply({
                    embeds: [
                        embed
                            .setDescription("All user data has been deleted.")
                            .setTitle("Success"),
                    ],
                    components: [],
                });
            }
            else if (i.customId === "clear-users-cancel") {
                yield i.deferUpdate();
                yield i.editReply({
                    embeds: [
                        embed
                            .setDescription("The action has been cancelled.")
                            .setTitle("Cancelled"),
                    ],
                    components: [],
                });
            }
        }));
    }),
};
