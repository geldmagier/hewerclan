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
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
class Raffle {
    constructor(item, id) {
        this._item = item;
        this._id = id;
    }
    get item() {
        return this._item;
    }
    getItem() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.item.get();
        });
    }
    getByItem() {
        return __awaiter(this, void 0, void 0, function* () {
            const itemData = yield this.item.get();
            return yield __1.prisma.raffle.findFirst({
                where: {
                    itemId: itemData === null || itemData === void 0 ? void 0 : itemData.id,
                },
            });
        });
    }
    create(m) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // the time in m minutes
            const endingTime = new Date();
            endingTime.setMinutes(endingTime.getMinutes() + m);
            // raffle ends the same day at 23:59:59
            const newRaffle = yield __1.prisma.raffle.create({
                data: {
                    item: {
                        connect: {
                            id: (_a = (yield this.item.get())) === null || _a === void 0 ? void 0 : _a.id,
                        },
                    },
                    endingAt: endingTime,
                },
            });
            this._id = newRaffle.id;
            return newRaffle;
        });
    }
    getRaffle(minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const raffle = yield this.get();
            if (raffle)
                return false;
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __1.prisma.raffle.findFirst({
                where: {
                    id: this._id,
                },
            });
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __1.prisma.raffle.findMany();
        });
    }
    getEntries() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __1.prisma.entry.findMany({
                where: {
                    raffleId: this._id,
                },
            });
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const raffle = yield this.get();
            if (!raffle)
                return false;
            return yield __1.prisma.raffle.deleteMany({
                where: {
                    id: raffle.id,
                },
            });
        });
    }
}
exports.default = Raffle;
