"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonSafeParse = void 0;
function jsonSafeParse(raw, fallback, reviver) {
    try {
        return JSON.parse(raw, reviver);
    }
    catch {
        return fallback;
    }
}
exports.jsonSafeParse = jsonSafeParse;
