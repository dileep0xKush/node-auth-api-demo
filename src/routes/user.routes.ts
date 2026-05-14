import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();

// CRUD
router.post("/", UserController.create);
router.get("/", UserController.getAll);
router.get("/:id", UserController.getById);
router.put("/:id", UserController.update);
router.delete("/:id", UserController.delete);

// Role management
router.post("/:id/assign-role", UserController.assignRole);
router.post("/:id/remove-role", UserController.removeRole);

export default router;
