import { Router, Request, Response } from "express";
import AuthController from "../controller/Auth";

const router = Router();
const authController = new AuthController();

router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello world");
});

router.post("/", authController.login);

export default router;
