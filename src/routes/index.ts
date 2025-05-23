import { Router } from 'express';
import memberRoutes from './member.routes';

const router = Router();

router.use('/members', memberRoutes);

export default router;
