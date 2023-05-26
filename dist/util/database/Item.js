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
const Raffle_1 = __importDefault(require("./Raffle"));
class Item {
    constructor(name, price, imageUrl) {
        this._name = name;
        this._price = price || 0;
        this._imageUrl = imageUrl || "";
    }
    get name() {
        return this._name;
    }
    get price() {
        return this._price;
    }
    get imageUrl() {
        return this._imageUrl;
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __1.prisma.item.findMany();
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __1.prisma.item.findFirst({
                where: {
                    name: this.name,
                },
            });
        });
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.get())
                return false;
            return yield __1.prisma.item.create({
                data: {
                    name: this.name,
                    price: this.price,
                    imageUrl: this.imageUrl,
                },
            });
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __1.prisma.item.findUnique({
                where: {
                    id: id,
                },
            });
        });
    }
    getEmbed() {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.get();
            if (!item)
                return null;
            const raffle = new Raffle_1.default(this);
            const raffleData = yield raffle.get();
            let countdown = "";
            if (!raffleData)
                countdown = "No raffle is currently running for this item.";
            else
                countdown = `Raffle ends <t:${Math.floor(new Date(raffleData.endingAt).getTime() / 1000)}:R>`;
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle(Messages_1.default.ITEM_EMBED_TITLE(item.name))
                .setDescription(Messages_1.default.ITEM_EMBED_DESCRIPTION(item.name, item.price) +
                "\n\n" +
                countdown)
                .setColor("#E8BCCA")
                .setImage(item.imageUrl);
            const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                .setStyle(discord_js_1.ButtonStyle.Primary)
                .setCustomId("item-" + item.id)
                .setLabel(item.name));
            return {
                embeds: [embed],
                components: [row],
            };
        });
    }
    getString() {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.get();
            if (!item)
                return null;
            return `- **${item.name}** - \`${item.price} ${Messages_1.default.CURRENCY}\``;
        });
    }
    getButton() {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.get();
            if (!item)
                return null;
            return new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                .setStyle(discord_js_1.ButtonStyle.Primary)
                .setCustomId("shop-" + item.id)
                .setLabel(item.name));
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.get();
            if (!item)
                return null;
            const raffle = new Raffle_1.default(this);
            const raffleData = yield raffle.get();
            if (raffleData) {
                yield __1.prisma.entry.deleteMany({
                    where: {
                        raffleId: raffleData === null || raffleData === void 0 ? void 0 : raffleData.id,
                    },
                });
                yield raffle.delete();
            }
            yield __1.prisma.ticket.deleteMany({
                where: {
                    itemId: item.id,
                },
            });
            return yield __1.prisma.item.delete({
                where: {
                    id: item === null || item === void 0 ? void 0 : item.id,
                },
            });
        });
    }
}
exports.default = Item;
