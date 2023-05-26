"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
class Messages {
    static ITEM_EMBED_TITLE(item) {
        var _a;
        return ((_a = process.env.ITEM_EMBED_TITLE) === null || _a === void 0 ? void 0 : _a.replace("{item}", item)) || item;
    }
    static ITEM_EMBED_DESCRIPTION(item, price) {
        var _a;
        return (((_a = process.env.ITEM_EMBED_DESCRIPTION) === null || _a === void 0 ? void 0 : _a.replace("{item}", item).replace("{price}", price.toString())) || `${item} - ${price} ${Messages.CURRENCY}`);
    }
    static ITEM_PURCHASED(item, channelId) {
        var _a;
        return (((_a = process.env.ITEM_PURCHASED) === null || _a === void 0 ? void 0 : _a.replace("{item}", item).replace("{ticket}", `<#${channelId}>`)) || `Du hast **${item}** gekauft! Hier ist dein Ticket: <#${channelId}>`);
    }
}
exports.default = Messages;
Messages.SHOP_EMBED_TITLE = process.env.SHOP_EMBED_TITLE || "Shop";
Messages.SHOP_EMBED_DESCRIPTION = process.env.SHOP_EMBED_DESCRIPTION || "Hier kannst du dir Items kaufen!";
Messages.SHOP_IMAGE = process.env.SHOP_IMAGE || "";
Messages.SHOP_COLOR = process.env.SHOP_COLOR || "Random";
Messages.CURRENCY = process.env.CURRENCY_NAME || "Punkte";
Messages.LEADERBOARD_TITLE = process.env.LEADERBOARD_TITLE || "Leaderboard";
Messages.LEADERBOARD_COLOR = process.env.LEADERBOARD_COLOR || "Random";
Messages.BALANCE_TITLE = process.env.BALANCE_TITLE ||
    "Looking to spend some " + Messages.CURRENCY + "?";
Messages.BALANCE_DESCRIPTION = process.env.BALANCE_DESCRIPTION ||
    "Check your balance with the button below!";
Messages.BALANCE_COLOR = process.env.BALANCE_COLOR || "Random";
