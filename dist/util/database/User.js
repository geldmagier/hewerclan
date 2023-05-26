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
const __1 = require("../../");
const Errors_1 = require("./Errors");
class User {
    constructor(id) {
        this._id = id;
    }
    get id() {
        return this._id;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __1.prisma.user.findUnique({
                where: {
                    id: this.id,
                },
            });
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __1.prisma.user.findMany();
        });
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.get())
                return yield this.get();
            return yield __1.prisma.user.create({
                data: {
                    id: this.id,
                },
            });
        });
    }
    buy(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.create();
            if (user.balance < amount)
                return Errors_1.ErrorType.NOT_ENOUGH_POINTS;
            return yield __1.prisma.user.update({
                where: {
                    id: this.id,
                },
                data: {
                    balance: user.balance - amount,
                },
            });
        });
    }
    add(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.create();
            return yield __1.prisma.user.update({
                where: {
                    id: this.id,
                },
                data: {
                    balance: user.balance + amount,
                },
            });
        });
    }
    subtract(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.create();
            return yield __1.prisma.user.update({
                where: {
                    id: this.id,
                },
                data: {
                    balance: user.balance - amount,
                },
            });
        });
    }
    static getTopTen() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __1.prisma.user.findMany({
                take: 10,
                orderBy: {
                    balance: "desc",
                },
            });
        });
    }
    static getTop() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __1.prisma.user.findMany({
                orderBy: {
                    balance: "desc",
                },
            });
        });
    }
}
exports.default = User;
