import { Router } from "express";
import UploadFileController from "../controller/UploadFileController";
import express from "express";
const router = Router();

const uploadFileController = new UploadFileController();

router.post("/:path", uploadFileController.uploadFile);

export default router;
