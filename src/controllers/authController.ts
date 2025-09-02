import {Request, Response} from "express";
import {AuthService} from "../services/authService";

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const {email, password} = req.body;
            if (!email || !password) {
                return res.status(400).json ({error: "email and password required"});
            }
const result = await AuthService.register(email, password);
res.json(result);
        }catch (err: any) {
            res.status(400).json ({error: err.message});
        }
    
    }

    static async login(req: Request, res: Response){
    try{
        const {email, password}= req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "email and password required" });
        }
        const result = await AuthService.login(email, password);
        res.json(result);
    } catch (err: any) {
        res.status(400).json({error: err.message})
    }
}
}
