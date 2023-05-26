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
const Errors_1 = require("./Errors");
class Ticket {
    constructor(itemId, channelId, userId, ticketId) {
        this._itemId = itemId;
        this._channelId = channelId;
        this._userId = userId;
        this._ticketId = ticketId;
    }
    get itemId() {
        return this._itemId;
    }
    get channelId() {
        return this._channelId;
    }
    get userId() {
        return this._userId;
    }
    get ticketId() {
        return this._ticketId.toString();
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __1.prisma.ticket.findFirst({
                where: {
                    id: this.ticketId,
                    itemId: this.itemId,
                    channelId: this.channelId,
                    userId: this.userId,
                },
            });
        });
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __1.prisma.ticket.create({
                data: {
                    id: this.ticketId,
                    itemId: this.itemId,
                    channelId: this.channelId,
                    userId: this.userId,
                },
            });
        });
    }
    static getByChannelId(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __1.prisma.ticket.findFirst({
                where: {
                    channelId: channelId,
                },
            });
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            const ticket = yield this.get();
            if (!ticket)
                return Errors_1.ErrorType.TICKET_NOT_FOUND;
            return yield __1.prisma.ticket.update({
                where: {
                    id: ticket.id,
                },
                data: {
                    closed: true,
                },
            });
        });
    }
}
exports.default = Ticket;
