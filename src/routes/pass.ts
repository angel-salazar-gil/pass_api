import { Router } from "express"
import { PassController } from "../controller/PassController";
import { checkJwt } from "../middlewares/jwt";

const router = Router();

// Get all passes
router.get('/', [checkJwt], PassController.getAll);

// Get one pass
router.get('/:id', [checkJwt], PassController.getById);

// Create a new pass
router.post('/', [checkJwt], PassController.newPass);

// Edit pass
router.patch('/:id', [checkJwt], PassController.editPass);

// Delete pass
router.delete('/:id', [checkJwt], PassController.deletePass);

export default router