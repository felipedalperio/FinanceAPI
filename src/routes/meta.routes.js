import { Router } from 'express';
import { criarMeta, listarMetas } from '../controllers/meta.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', criarMeta);
router.get('/', listarMetas);

export default router;
