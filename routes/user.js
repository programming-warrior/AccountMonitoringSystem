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
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const routes = (0, express_1.Router)();
const UserModel_1 = __importDefault(require("../models/UserModel"));
const LoginDetailsModel_1 = __importDefault(require("../models/LoginDetailsModel"));
routes.get('/fetch/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield LoginDetailsModel_1.default.find({ userId: req.params.id });
    return res.status(200).json(data).end();
}));
routes.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let email = req.body.email;
    let password = req.body.password;
    email = email && typeof (email) == 'string' && email.trim().length > 0 ? email : null;
    password = password && typeof (password) == 'string' && password.trim().length > 0 ? password : null;
    if (!email || !password)
        return res.status(401).json({ message: "invalid request" }).end();
    try {
        const userFound = yield UserModel_1.default.findOne({ email }).exec();
        if (userFound)
            return res.status(401).json({ message: "user already exists" }).end();
        const user = yield UserModel_1.default.create({ email, password });
        const secretKey = process.env.SECRET_KEY || '';
        let index = req.rawHeaders.findIndex(val => /sec-ch-ua-platform/i.test(val));
        const platform = req.rawHeaders[index + 1];
        index = req.rawHeaders.findIndex(val => /sec-ch-ua/i.test(val));
        const browser = req.rawHeaders[index + 1].split(',')[1].split(';')[0];
        const timeStamp = new Date();
        const time = timeStamp.getHours() + "hrs " + timeStamp.getMinutes() + "mins";
        const date = timeStamp.getFullYear() + "-" + timeStamp.getMonth() + "-" + timeStamp.getDay();
        //store the login details into the database
        const savedInfo = yield LoginDetailsModel_1.default.create({ userId: user._id.toString(), browser, platform, time, date });
        const loginId = savedInfo._id;
        const token = jsonwebtoken_1.default.sign({
            userId: user._id.toString(),
            loginId: loginId.toString(),
            loginDetails: {
                time,
                date,
                platform,
                browser
            }
        }, secretKey);
        return res.status(201).json({ message: { token, loginId: loginId.toString(), userId: user._id.toString() } }).end();
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "something went wrong" }).end();
        return;
    }
}));
routes.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let email = req.body.email;
    let password = req.body.password;
    email = email && typeof (email) == 'string' && email.trim().length > 0 ? email : null;
    password = password && typeof (password) == 'string' && password.trim().length > 0 ? password : null;
    if (!email || !password)
        return res.status(401).json({ message: "invalid request" }).end();
    try {
        const user = yield UserModel_1.default.findOne({ email }).exec();
        if (!user)
            return res.status(401).json({ message: "user not found" }).end();
        if (user.password != password)
            return res.status(401).json({ message: "wrong password" }).end();
        const secretKey = process.env.SECRET_KEY || '';
        let index = req.rawHeaders.findIndex(val => /sec-ch-ua-platform/i.test(val));
        const platform = req.rawHeaders[index + 1];
        index = req.rawHeaders.findIndex(val => /sec-ch-ua/i.test(val));
        const browser = req.rawHeaders[index + 1].split(',')[1].split(';')[0];
        const timeStamp = new Date();
        const time = timeStamp.getHours() + "hrs " + timeStamp.getMinutes() + "mins";
        const date = timeStamp.getFullYear() + "-" + timeStamp.getMonth() + "-" + timeStamp.getDay();
        //store the login details into the database
        const savedInfo = yield LoginDetailsModel_1.default.create({ userId: user._id.toString(), browser, platform, time, date });
        const loginId = savedInfo._id;
        const token = jsonwebtoken_1.default.sign({
            userId: user._id.toString(),
            loginId: loginId.toString(),
            loginDetails: {
                time,
                date,
                platform,
                browser
            }
        }, secretKey);
        return res.status(201).json({ message: { token, loginId: loginId.toString(), userId: user._id.toString() } }).end();
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "something went wrong" }).end();
        return;
    }
}));
exports.default = routes;
