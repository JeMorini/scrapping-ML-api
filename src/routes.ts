import { Router } from "express";
import { ScrappingMLController } from "./controllers/ScrappingMLController";

const router = Router();

const scrappingMLController = new ScrappingMLController();

router.post("/products", scrappingMLController.handle);

export { router };
