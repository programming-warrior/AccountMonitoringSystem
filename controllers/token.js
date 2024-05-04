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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyTokenSocket = (con, req, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const secWebSocketProtocolHeaderIndex = req.rawHeaders.findIndex(val => /sec-websocket-protocol/i.test(val));
    if (secWebSocketProtocolHeaderIndex === -1) {
        const data = {
            event: "invalid-token",
        };
        con.send(JSON.stringify(data));
        return;
    }
    const token = (_b = (_a = req.rawHeaders[secWebSocketProtocolHeaderIndex + 1]) === null || _a === void 0 ? void 0 : _a.split(',')[1]) === null || _b === void 0 ? void 0 : _b.trim();
    if (!token) {
        const data = {
            event: "invalid-token",
        };
        con.send(JSON.stringify(data));
        return;
    }
    try {
        const secretKey = process.env.SECRET_KEY || "";
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        req.userId = decoded.userId;
        req.loginId = decoded.loginId;
        req.loginDetails = decoded.loginDetails;
        const data = {
            event: "valid-token",
            message: JSON.stringify({
                username: decoded.username,
            }),
        };
        con.send(JSON.stringify(data));
        next();
    }
    catch (e) {
        const data = {
            event: "invalid-token",
        };
        con.send(JSON.stringify(data));
        return;
    }
});
exports.default = verifyTokenSocket;
