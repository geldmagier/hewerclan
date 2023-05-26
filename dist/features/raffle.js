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
const __1 = require("..");
const Messages_1 = __importDefault(require("../util/config/Messages"));
const Item_1 = __importDefault(require("../util/database/Item"));
const Raffle_1 = __importDefault(require("../util/database/Raffle"));
const Ticket_1 = __importDefault(require("../util/database/Ticket"));
exports.default = (instance, client) => __awaiter(void 0, void 0, void 0, function* () {
    const doRaffles = () => __awaiter(void 0, void 0, void 0, function* () {
        const raffles = yield Raffle_1.default.getAll();
        const guild = yield client.guilds.fetch(process.env.SERVER_ID);
        raffles.forEach((raffle) => __awaiter(void 0, void 0, void 0, function* () {
            //check if raffle ending time is the current date, hour and minute
            const raffleDate = new Date(raffle.endingAt);
            const currentDate = new Date();
            if (raffleDate.getDate() === currentDate.getDate() &&
                raffleDate.getHours() === currentDate.getHours() &&
                raffleDate.getMinutes() === currentDate.getMinutes()) {
                const ticketId = Math.floor(Math.random() * 9000) + 10000;
                const item = yield Item_1.default.getById(raffle.itemId);
                const i = new Item_1.default(item === null || item === void 0 ? void 0 : item.name);
                const r = new Raffle_1.default(i, raffle.id);
                const raffleData = yield r.get();
                const entries = yield r.getEntries();
                const winner = yield getWinner(entries);
                const wUser = yield client.users.fetch(winner.userId);
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle(`Raffle Ended!`)
                    .setDescription(`The raffle for ${item === null || item === void 0 ? void 0 : item.name} has ended! The winner is <@${winner.userId}>!`)
                    .setTimestamp()
                    .setColor("#E8BCCA")
                    .setAuthor({
                    name: (wUser === null || wUser === void 0 ? void 0 : wUser.username) + "#" + (wUser === null || wUser === void 0 ? void 0 : wUser.discriminator),
                    iconURL: wUser === null || wUser === void 0 ? void 0 : wUser.avatarURL(),
                })
                    .setImage(item === null || item === void 0 ? void 0 : item.imageUrl);
                const raffleChannel = (yield client.channels.cache.get(process.env.RAFFLE_CHANNEL));
                raffleChannel === null || raffleChannel === void 0 ? void 0 : raffleChannel.send({ embeds: [embed] });
                try {
                    yield (guild === null || guild === void 0 ? void 0 : guild.channels.create({
                        name: `ticket-${wUser.username}`,
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
                                id: wUser.id,
                                allow: [
                                    discord_js_1.PermissionFlagsBits.ViewChannel,
                                    discord_js_1.PermissionFlagsBits.SendMessages,
                                    discord_js_1.PermissionFlagsBits.ReadMessageHistory,
                                ],
                            },
                        ],
                    }).then((channel) => __awaiter(void 0, void 0, void 0, function* () {
                        const newTicket = yield new Ticket_1.default(item.id, channel.id, wUser.id, ticketId).create();
                        const embed = new discord_js_1.EmbedBuilder()
                            .setTitle(`Ticket for ${wUser.username} - Item: ${item === null || item === void 0 ? void 0 : item.name}`)
                            .setColor("#E8BCCA")
                            .setAuthor({
                            name: wUser.username,
                            iconURL: wUser.displayAvatarURL(),
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
                        yield wUser
                            .send({
                            content: Messages_1.default.ITEM_PURCHASED(item === null || item === void 0 ? void 0 : item.name, channel.id),
                        })
                            .catch((err) => { });
                        yield __1.prisma.entry
                            .deleteMany({
                            where: {
                                raffleId: raffleData === null || raffleData === void 0 ? void 0 : raffleData.id,
                            },
                        })
                            .then(() => __awaiter(void 0, void 0, void 0, function* () {
                            yield __1.prisma.raffle.delete({
                                where: {
                                    id: raffleData === null || raffleData === void 0 ? void 0 : raffleData.id,
                                },
                            });
                        }));
                    })));
                }
                catch (err) {
                    console.log(err);
                }
            }
            else {
                // kein raffle endet gerade
            }
        }));
        //check again in 5 seconds
        setTimeout(doRaffles, 5000);
    });
    doRaffles();
});
function getWinner(entries) {
    return __awaiter(this, void 0, void 0, function* () {
        let winner = entries[Math.floor(Math.random() * entries.length)];
        return winner;
    });
}
