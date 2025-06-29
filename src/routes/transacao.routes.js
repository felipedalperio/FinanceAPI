import { Router } from 'express';
import { criarTransacao,updateTransacao, listarDespesas, listarReceitas, listarTransacoes, listarCategoria, criarCategoria, deleteTransicao } from '../controllers/transacao.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', criarTransacao);
router.put('/:id', updateTransacao);
router.get('/listar', listarTransacoes);
router.get('/despesas', listarDespesas);
router.get('/receitas', listarReceitas);
router.get('/categorias', listarCategoria);
router.post('/categoria', criarCategoria);
router.delete('/delete/:id', deleteTransicao);

export default router;
