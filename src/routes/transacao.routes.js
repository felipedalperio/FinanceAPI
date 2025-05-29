import { Router } from 'express';
import { criarTransacao, listarDespesas, listarReceitas, listarTransacoes, listarCategoria } from '../controllers/transacao.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', criarTransacao);
router.get('/', listarTransacoes);
router.get('/despesas', listarDespesas);
router.get('/receitas', listarReceitas);
router.get('/categorias', listarCategoria);

export default router;
