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
const Ticket_1 = __importDefault(require("../../../util/database/Ticket"));
const Item_1 = __importDefault(require("../../../util/database/Item"));
exports.default = (interaction, instance) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!interaction.isButton())
        return;
    const { member } = interaction;
    if (interaction.customId === "close") {
        // check ob der user admin ist
        if (!member.permissions.has(discord_js_1.PermissionFlagsBits.Administrator))
            return interaction.reply({
                content: "You can't close this ticket!",
                ephemeral: true,
            });
        const t = yield Ticket_1.default.getByChannelId(interaction.channelId);
        if (!t)
            return interaction.reply({
                content: "Something went wrong, the item for this ticket may have been deleted!",
                ephemeral: true,
            });
        const ticket = new Ticket_1.default(t.itemId, t.channelId, t.userId, parseInt(t.id));
        const item = yield Item_1.default.getById(t.itemId);
        if (t.closed === true)
            return interaction.reply({
                content: "This ticket is already being deleted...",
                ephemeral: true,
            });
        yield ticket.close();
        const deletingEmbed = new discord_js_1.EmbedBuilder()
            .setTitle("Closing Ticket...")
            .setDescription("This ticket will be closed in 10 seconds...")
            .setColor("Red")
            .setFooter({
            text: member === null || member === void 0 ? void 0 : member.user.tag,
            iconURL: member === null || member === void 0 ? void 0 : member.displayAvatarURL(),
        })
            .setTimestamp();
        (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send({ embeds: [deletingEmbed] });
        setTimeout(() => {
            var _a;
            (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.delete();
        }, 10000);
    }
});
