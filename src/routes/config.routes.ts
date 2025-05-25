import { Router } from 'express';
import { ConfigController } from '../controllers/config.controller';

const router = Router();
const configController = new ConfigController();

// Route to get public configuration
router.get('/', configController.getPublicConfig);

export default router;
