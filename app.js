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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
require("./controllers/connection");
const express_ws_1 = __importDefault(require("express-ws"));
const app = (0, express_1.default)();
const { app: wsApp, getWss } = (0, express_ws_1.default)(app);
const user_1 = __importDefault(require("./routes/user"));
const token_1 = __importDefault(require("./controllers/token"));
const LoginDetailsModel_1 = __importDefault(require("./models/LoginDetailsModel"));
const PORT = parseInt(process.env.PORT || '8000', 10);
app.use((0, cors_1.default)({
    origin: '*'
}));
app.use(express_1.default.json());
app.use('/api/v1', user_1.default);
const loginPools = {};
wsApp.ws('/', token_1.default, (con, request) => {
    if (request.userId && !loginPools.hasOwnProperty(request.userId))
        loginPools[request.userId] = {};
    if (request.userId && request.loginId && request.loginDetails && loginPools[request.userId]) {
        if (loginPools[request.userId].hasOwnProperty(request.loginId) && loginPools[request.userId][request.loginId]['con']) {
            loginPools[request.userId][request.loginId]['con'] = con;
        }
        else {
            loginPools[request.userId][request.loginId] = { con };
            for (let key in loginPools[request.userId]) {
                if (key != request.loginId) {
                    let socketCon = loginPools[request.userId][key]['con'];
                    const data = {
                        "event": "new-login",
                        "message": {
                            userId: request.userId,
                            loginId: request.loginId,
                            loginDetails: request.loginDetails
                        }
                    };
                    console.log(Object.keys(loginPools[request.userId]));
                    socketCon.send(JSON.stringify(data));
                }
            }
        }
        con.addEventListener('message', (data) => __awaiter(void 0, void 0, void 0, function* () {
            if (request.userId) {
                const socketQuery = data.data.toString();
                const { event, message } = JSON.parse(socketQuery);
                if (event === 'sign-out') {
                    const { loginId } = message;
                    //delete the login details from the database
                    const res = yield LoginDetailsModel_1.default.deleteOne({ _id: loginId });
                    const loggedOffDeviceCon = loginPools[request.userId][loginId]['con'];
                    loggedOffDeviceCon.send(JSON.stringify({ event: 'log-yourself-out', message: {} }));
                    //delete the con from the loginPools
                    delete loginPools[request.userId][loginId];
                    console.log(Object.keys(loginPools[request.userId]));
                    //broadcast this to all the devices
                    for (let key in loginPools[request.userId]) {
                        loginPools[request.userId][key]['con'].send(JSON.stringify({ event: 'log-device-out', message: { loginId } }));
                    }
                }
            }
        }));
    }
});
app.listen(PORT, () => {
    console.log(`APP IS LISTENING ON PORT ${PORT}`);
});
