import express from "express";
import { submitContact } from "../controllers/contactController.js";

const router = express.Router();

router.post("/", submitContact);
router.get("/", getContacts);

export default router;
