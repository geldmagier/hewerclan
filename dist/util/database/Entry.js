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
class default_1 {
    constructor(userId, raffleId) {
        this._userId = userId;
        this._raffleId = raffleId;
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            const entry = yield this.get();
            if (entry)
                return entry;
            return yield __1.prisma.entry.create({
                data: {
                    user: {
                        connect: {
                            id: this._userId,
                        },
                    },
                    raffle: {
                        connect: {
                            id: this._raffleId,
                        },
                    },
                },
            });
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __1.prisma.entry.findFirst({
                where: {
                    userId: this._userId,
                    raffleId: this._raffleId,
                },
            });
        });
    }
    addEntry() {
        return __awaiter(this, void 0, void 0, function* () {
            const entry = yield this.get();
            if (!entry)
                return false;
            return yield __1.prisma.entry.update({
                where: {
                    id: entry.id,
                },
                data: {
                    entries: entry.entries + 1,
                },
            });
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __1.prisma.entry.findMany();
        });
    }
}
exports.default = default_1;
