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
const Item_1 = __importDefault(require("../../../util/database/Item"));
const User_1 = __importDefault(require("../../../util/database/User"));
const Errors_1 = require("../../../util/database/Errors");
const Messages_1 = __importDefault(require("../../../util/config/Messages"));
const Raffle_1 = __importDefault(require("../../../util/database/Raffle"));
const Entry_1 = __importDefault(require("../../../util/database/Entry"));
const Ticket_1 = __importDefault(require("../../../util/database/Ticket"));
exports.default = (interaction, instance) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isButton())
        return;
    const { guild, user } = interaction;
    const args = interaction.customId.split("-");
    if (args[0] === "shop" || args[0] === "item") {
        const ticketId = Math.floor(Math.random() * 9000) + 10000;
        const item = yield Item_1.default.getById(args[1]);
        if (!item)
            return interaction.reply({ content: "Item not found!", ephemeral: true });
        const i = new Item_1.default(item === null || item === void 0 ? void 0 : item.name);
        const { price, name } = item;
        const user = new User_1.default(interaction.user.id);
        const userData = yield user.get();
        // if userDate is undefined, then balance is 0
        const balance = (userData === null || userData === void 0 ? void 0 : userData.balance) || 0;
        const raffle = new Raffle_1.default(i);
        const raffleData = yield raffle.getByItem();
        if (!raffleData) {
            const bought = yield user.buy(price);
            if (bought === Errors_1.ErrorType.NOT_ENOUGH_POINTS) {
                return interaction.reply({
                    content: `You do not have enough ${Messages_1.default.CURRENCY} to buy **${name}**! \`(${balance} ${Messages_1.default.CURRENCY} / ${price} ${Messages_1.default.CURRENCY})\``,
                    ephemeral: true,
                });
            }
            try {
                yield (guild === null || guild === void 0 ? void 0 : guild.channels.create({
                    name: `ticket-${interaction.user.username}`,
                    type: discord_js_1.ChannelType.GuildText,
                    parent: process.env.TICKET_CATEGORY,
                    permissionOverwrites: [
                        {
                            id: process.env.EVERYONE,
                            deny: [
                                discord_js_1.PermissionFlagsBits.ViewChannel,
                                discord_js_1.PermissionFlagsBits.SendMessages,
                                discord_js_1.PermissionFlagsBits.ReadMessageHistory,
                            ],
                        },
                        {
                            id: interaction.user.id,
                            allow: [
                                discord_js_1.PermissionFlagsBits.ViewChannel,
                                discord_js_1.PermissionFlagsBits.SendMessages,
                                discord_js_1.PermissionFlagsBits.ReadMessageHistory,
                            ],
                        },
                    ],
                }).then((channel) => __awaiter(void 0, void 0, void 0, function* () {
                    const newTicket = yield new Ticket_1.default(item.id, channel.id, interaction.user.id, ticketId).create();
                    const embed = new discord_js_1.EmbedBuilder()
                        .setTitle(`Ticket for ${interaction.user.username} - Item: ${item === null || item === void 0 ? void 0 : item.name}`)
                        .setColor("#E8BCCA")
                        .setAuthor({
                        name: interaction.user.username,
                        iconURL: interaction.user.displayAvatarURL(),
                    })
                        .setImage(item === null || item === void 0 ? void 0 : item.imageUrl)
                        .setTimestamp();
                    const button = new discord_js_1.ActionRowBuilder().setComponents(new discord_js_1.ButtonBuilder()
                        .setCustomId("close")
                        .setLabel("Close Ticket")
                        .setStyle(discord_js_1.ButtonStyle.Primary)
                        .setEmoji("❌"));
                    channel.send({
                        embeds: [embed],
                        components: [button],
                    });
                    yield interaction
                        .reply({
                        content: Messages_1.default.ITEM_PURCHASED(item === null || item === void 0 ? void 0 : item.name, channel.id),
                        ephemeral: true,
                    })
                        .catch((err) => { });
                    return;
                })));
            }
            catch (err) {
                return;
            }
        }
        else {
            // check if raffle ending time is the current date, hour and minute
            const raffleDate = new Date(raffleData.endingAt);
            const currentDate = new Date();
            if (raffleDate.getDate() === currentDate.getDate() &&
                raffleDate.getHours() === currentDate.getHours() &&
                raffleDate.getMinutes() === currentDate.getMinutes()) {
                return interaction.reply({
                    content: `The raffle for ${name} has already ended / is currently ending! Please try again in a few minutes!`,
                    ephemeral: true,
                });
            }
            const entry = new Entry_1.default(interaction.user.id, raffleData.id);
            const entryData = yield entry.create();
            if (entryData.entries >= parseInt(process.env.MAX_ENTRIES)) {
                return interaction.reply({
                    content: `You have reached the maximum amount of entries for this raffle!`,
                    ephemeral: true,
                });
            }
            const payed = yield user.buy(price);
            if (payed === Errors_1.ErrorType.NOT_ENOUGH_POINTS) {
                return interaction.reply({
                    content: `You do not have enough ${Messages_1.default.CURRENCY} to buy **${name}**! \`(${balance} ${Messages_1.default.CURRENCY} / ${price} ${Messages_1.default.CURRENCY})\``,
                    ephemeral: true,
                });
            }
            const newEntry = yield entry.addEntry();
            if (!newEntry)
                return interaction.reply({
                    content: "Something went wrong! Please try again later!",
                    ephemeral: true,
                });
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle(`You have entered the raffle for ${name}!`)
                .setColor("#E8BCCA")
                .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
            })
                .setImage(item === null || item === void 0 ? void 0 : item.imageUrl)
                .setDescription(`You have entered the raffle for **${name}**! You have **${newEntry.entries}** entries in this raffle!\n\nThe raffle will end <t:${parseInt(`${raffleData.endingAt.getTime() / 1000}`)}:R>`)
                .setTimestamp();
            return interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }
    }
});
