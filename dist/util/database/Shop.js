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
const __1 = require("../..");
const Messages_1 = __importDefault(require("../config/Messages"));
const Item_1 = __importDefault(require("./Item"));
class Shop {
    constructor(client) {
        this._client = client;
    }
    get client() {
        return this._client;
    }
    getItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield __1.prisma.item.findMany({
                orderBy: {
                    price: "asc",
                },
            });
            const list = [];
            for (const item of items) {
                list.push(new Item_1.default(item.name, item.price, item.imageUrl));
            }
            return list;
        });
    }
    getEmbed() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.getItems();
            let itemListString = "";
            for (const item of items) {
                itemListString += (yield item.getString()) + "\n";
            }
            const guild = yield this.client.guilds.cache.get(process.env.SERVER_ID);
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle(Messages_1.default.SHOP_EMBED_TITLE)
                .setDescription(Messages_1.default.SHOP_EMBED_DESCRIPTION + "\n\n" + itemListString)
                .setColor(Messages_1.default.SHOP_COLOR)
                .setImage(Messages_1.default.SHOP_IMAGE)
                .setAuthor({
                name: guild === null || guild === void 0 ? void 0 : guild.name,
                iconURL: guild === null || guild === void 0 ? void 0 : guild.iconURL(),
            });
            const buttons = [];
            for (const item of items) {
                buttons.push(yield item.getButton());
            }
            // die buttons in 5er gruppen aufteilen, damit sie nebeneinander angezeigt werden, und discord nicht meckert
            // hilfe das ist selbst mir zu kompliziert, ich weiß nicht mehr was ich hier mache. hilfe.
            const result = [...chunks(buttons, 5)];
            result.forEach((row) => {
                const mainRow = row[0];
                const otherRows = row.slice(1);
                const otherButtons = otherRows.map((row) => row.components[0]);
                mainRow.addComponents(otherButtons);
                //
                row.splice(1);
            });
            return {
                embeds: [embed],
                components: result.map((row) => {
                    return {
                        type: 1,
                        components: row[0].components,
                    };
                }),
            };
        });
    }
}
exports.default = Shop;
function* chunks(array, n) {
    // array in n große chunks aufteilen
    for (let i = 0; i < array.length; i += n)
        yield array.slice(i, i + n);
}
