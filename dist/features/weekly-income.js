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
const User_1 = __importDefault(require("../util/database/User"));
exports.default = (instance, client) => __awaiter(void 0, void 0, void 0, function* () {
    // alle member suchen
    const weeklyIncome = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // wenn es montag ist, dann weekly income hinzufügen (1 = montag)
        const today = new Date();
        if (today.getDay() === 1) {
            // alle user des servers suchen
            const us = yield ((_a = client.guilds.cache
                .get(process.env.SERVER_ID)) === null || _a === void 0 ? void 0 : _a.members.fetch({ force: true }));
            us === null || us === void 0 ? void 0 : us.forEach((u) => __awaiter(void 0, void 0, void 0, function* () {
                const user = new User_1.default(u.id);
                // wenn der user kein hewerbox holder ist, dann nichts machen
                if (!u.roles.cache.has(process.env.HEWERBOX_HOLDER_ROLE))
                    return;
                const userData = yield user.create();
                // weekly income hinzufügen
                if (u.roles.cache.has(process.env.CORPORAL_ROLE)) {
                    user
                        .add(parseInt(process.env.CORPORAL_WEEKLY_INCOME))
                        .catch((e) => { });
                }
                else if (u.roles.cache.has(process.env.SKILLED_ROLE)) {
                    user
                        .add(parseInt(process.env.SKILLED_WEEKLY_INCOME))
                        .catch((e) => { });
                }
                else if (u.roles.cache.has(process.env.EXPERT_ROLE)) {
                    user
                        .add(parseInt(process.env.EXPERT_WEEKLY_INCOME))
                        .catch((e) => { });
                }
                else if (u.roles.cache.has(process.env.MASTERFUL_ROLE)) {
                    user
                        .add(parseInt(process.env.MASTERFUL_WEEKLY_INCOME))
                        .catch((e) => { });
                }
                else if (u.roles.cache.has(process.env.SAGE_ROLE)) {
                    user.add(parseInt(process.env.SAGE_WEEKLY_INCOME)).catch((e) => { });
                }
            }));
            setTimeout(weeklyIncome, 1000 * 60 * 60 * 24);
        }
        setTimeout(weeklyIncome, 1000 * 60 * 60);
    });
    weeklyIncome();
});
