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
    description: "Show the leaderboard",
    type: swagcommands_1.CommandType.SLASH,
    testOnly: true,
    guildOnly: true,
    options: [],
    callback: ({ interaction, args, client }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const users = yield User_1.default.getTop();
        if (!users)
            return { content: "No users found", ephemeral: true };
        if (users.length === 0)
            return { content: "No users found", ephemeral: true };
        let leaderboard = "";
        // wenn weniger als 10 user in der db sind wird das "normale" leaderboard gesendet
        if (users.length <= 10) {
            for (const user of users) {
                const u = new User_1.default(user.id);
                const userData = yield u.get();
                leaderboard += `**${users.indexOf(user) + 1}.** <@${user.id}> - **${userData === null || userData === void 0 ? void 0 : userData.balance}** ${Messages_1.default.CURRENCY}\n`;
                // limit the leaderboard to 2048 characters
                if (leaderboard.length >= 2000)
                    break;
            }
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle(Messages_1.default.LEADERBOARD_TITLE)
                .setDescription(leaderboard)
                .setColor(Messages_1.default.LEADERBOARD_COLOR)
                .setTimestamp();
            return {
                embeds: [embed],
            };
        }
        const pages = [];
        // teile die user in chunks von 10 auf
        const userChunks = [...chunks(users, 10)];
        // ein leaderboard für jeden chunk erstellen
        for (const chunk of userChunks) {
            leaderboard = "";
            for (const user of chunk) {
                const u = new User_1.default(user.id);
                const userData = yield u.get();
                leaderboard += `**${users.indexOf(user) + 1}.** <@${user.id}> - **${userData === null || userData === void 0 ? void 0 : userData.balance}** ${Messages_1.default.CURRENCY}\n`;
            }
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle(Messages_1.default.LEADERBOARD_TITLE)
                .setDescription(leaderboard)
                .setColor(Messages_1.default.LEADERBOARD_COLOR)
                .setTimestamp()
                .setFooter({
                text: `Page ${pages.length + 1}/${userChunks.length}`,
            });
            pages.push(embed);
        }
        const row = getRow(0, pages);
        // die erste leaderboard page senden
        yield (interaction === null || interaction === void 0 ? void 0 : interaction.reply({
            embeds: [pages[0]],
            components: [row],
        }).catch((err) => {
            console.log(err);
        }));
        // einen collector erstellen, der auf button clicks hört
        const filter = (i) => i.user.id === (interaction === null || interaction === void 0 ? void 0 : interaction.user.id);
        const collector = yield ((_a = interaction === null || interaction === void 0 ? void 0 : interaction.channel) === null || _a === void 0 ? void 0 : _a.createMessageComponentCollector({
            filter,
            time: 60000,
        }));
        let currentPage = 0;
        collector === null || collector === void 0 ? void 0 : collector.on("collect", (i) => __awaiter(void 0, void 0, void 0, function* () {
            if (i.customId === "leaderboard-prev") {
                // wenn der user den prev button klickt, gehe zur vorherigen seite
                if (currentPage === 0)
                    return;
                currentPage--;
                const nRow = getRow(currentPage, pages);
                yield i.deferUpdate();
                yield i.editReply({
                    embeds: [pages[currentPage]],
                    components: [nRow],
                });
            }
            else if (i.customId === "leaderboard-next") {
                // wenn der user den next button klickt, gehe zur nächsten seite
                if (currentPage === pages.length - 1)
                    return;
                currentPage++;
                const nrow = getRow(currentPage, pages);
                yield i.deferUpdate();
                yield i.editReply({
                    embeds: [pages[currentPage]],
                    components: [nrow],
                });
            }
        }));
    }),
};
function* chunks(array, n) {
    // array in n große chunks aufteilen
    for (let i = 0; i < array.length; i += n)
        yield array.slice(i, i + n);
}
function getRow(currentPage, pages) {
    // buttons ertellen
    const row = new discord_js_1.ActionRowBuilder();
    const b1 = new discord_js_1.ButtonBuilder()
        .setCustomId("leaderboard-prev")
        .setLabel("Previous")
        .setStyle(discord_js_1.ButtonStyle.Primary);
    const b2 = new discord_js_1.ButtonBuilder()
        .setCustomId("leaderboard-next")
        .setLabel("Next")
        .setStyle(discord_js_1.ButtonStyle.Primary);
    // den jeweiligen button disablen, wenn es keinen vorherige/nächste seite gibt
    if (currentPage === 0) {
        b1.setDisabled(true);
    }
    if (currentPage === pages.length - 1) {
        b2.setDisabled(true);
    }
    row.addComponents(b1, b2);
    return row;
}
