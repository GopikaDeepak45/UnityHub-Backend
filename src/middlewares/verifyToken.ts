import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Define a custom interface that extends Express's Request interface
interface CustomRequest extends Request {
    user?: {
        username: string;
        userId:string;
        role: string;
    };
}

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    console.log('verify token called')

    const authHeader: string | string[] | undefined = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || (Array.isArray(authHeader) && authHeader.length === 0)) {

        return res.status(401).json({ message: 'Unauthorized' });
    }

    let token: string;
    if (typeof authHeader === 'string') {
        token = authHeader.split(' ')[1];
       
    } else {
        token = authHeader[0].split(' ')[1];
    }

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
        (err:any, decoded) => {

            if (err) {
                
                return res.status(403).json({ message: 'Forbidden' });
            }
            if (!decoded) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const decodedUserInfo = decoded as JwtPayload;

            req.user = decodedUserInfo.UserInfo
            next();
        }
    );
};


export default verifyToken;
