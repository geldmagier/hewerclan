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
const Messages_1 = __importDefault(require("../../../util/config/Messages"));
const User_1 = __importDefault(require("../../../util/database/User"));
exports.default = (interaction, instance) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isButton())
        return;
    if (interaction.customId !== "check-balance")
        return;
    const user = new User_1.default(interaction === null || interaction === void 0 ? void 0 : interaction.user.id);
    const userData = yield user.get();
    if (!userData || userData.balance === 0) {
        return interaction.reply({
            content: `You don't have any ${Messages_1.default.CURRENCY} right now.`,
            ephemeral: true,
        });
    }
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle(`${interaction === null || interaction === void 0 ? void 0 : interaction.user.username}'s Balance`)
        .setDescription(`You have **${userData.balance} ${Messages_1.default.CURRENCY}**.`)
        .setColor("Random")
        .setTimestamp()
        .setImage(interaction === null || interaction === void 0 ? void 0 : interaction.user.displayAvatarURL());
    interaction.reply({ embeds: [embed], ephemeral: true });
});
