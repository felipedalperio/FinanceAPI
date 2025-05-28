import { Router } from 'express';
import { obterResumoMensal } from '../controllers/relatorio.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/mensal/:ano/:mes', obterResumoMensal);

export default router;
