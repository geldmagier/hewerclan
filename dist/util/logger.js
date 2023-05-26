"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
class Logger {
    static info(message) {
        console.log(`[ ${chalk_1.default.cyan("INFO")} ] ${message}`);
    }
    static warn(message) {
        console.log(`[ ${chalk_1.default.yellow("WARN")} ] ${message}`);
    }
    static error(message) {
        console.log(`[ ${chalk_1.default.red("ERROR")} ] ${message}`);
    }
}
exports.default = Logger;
