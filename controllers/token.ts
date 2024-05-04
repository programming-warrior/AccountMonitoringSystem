import jwt from 'jsonwebtoken';
import { WebsocketRequestHandler } from 'express-ws';


declare global {
    namespace Express {
        interface Request {
            userId?: string;
            loginId?:string,
            loginDetails?:{[key:string]:string}
        }
    }
}
const verifyTokenSocket: WebsocketRequestHandler = async (con, req, next) => {
    const secWebSocketProtocolHeaderIndex = req.rawHeaders.findIndex(val => /sec-websocket-protocol/i.test(val));
    if (secWebSocketProtocolHeaderIndex === -1) {
        const data = {
            event: "invalid-token",
        };
        con.send(JSON.stringify(data));
        return;
    }

    const token = req.rawHeaders[secWebSocketProtocolHeaderIndex + 1]?.split(',')[1]?.trim();
    if (!token) {
        const data = {
            event: "invalid-token",
        };
        con.send(JSON.stringify(data));
        return;
    }

    try {
        const secretKey: string = process.env.SECRET_KEY || "";
        const decoded: any = jwt.verify(token, secretKey);
        req.userId = decoded.userId;
        req.loginId=decoded.loginId;
        req.loginDetails=decoded.loginDetails;

        const data = {
            event: "valid-token",
            message: JSON.stringify({
                username: decoded.username,
            }),
        };
        con.send(JSON.stringify(data));
        next();
    } catch (e) {
        const data = {
            event: "invalid-token",
        };
        con.send(JSON.stringify(data));
        return;
    }
};

export default verifyTokenSocket;
