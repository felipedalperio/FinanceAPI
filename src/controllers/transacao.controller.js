import { PrismaClient } from '../../generated/prisma/index.js'

const prisma = new PrismaClient();

export const criarTransacao = async (req, res) => {
  const { categoriaId, tipo, descricao, valor, dataTransacao } = req.body;
  
  try {
    const transacao = await prisma.transacao.create({
      data: {
        usuarioId: req.usuarioId,
        categoriaId,
        tipo,
        descricao,
        valor,
        dataTransacao: new Date(dataTransacao)
      }
    });

     console.log(req.usuarioId)

    res.status(201).json(transacao);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const listarTransacoes = async (req, res) => {
  try {
   const transacoes = await prisma.transacao.findMany({
      where: { usuarioId: req.usuarioId },
      orderBy: { dataCriacao: 'desc' } // ou 'asc' para crescente
    });

    const transacoesFormatadas = transacoes.map(transacao => ({
      ...transacao,
      dataTransacao: new Date(transacao.dataTransacao).toLocaleDateString('pt-BR'),
      //pegar depois pelos valores da categoria e não fixo assim na mão
      categoria: 'Teste',
      icone: 'https://ui-avatars.com/api/?name=Estudo&background=2ECC71&color=fff&rounded=true'
    }));

    res.json(transacoesFormatadas);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar transações' });
  }
};

export const listarReceitas = async (req, res) => {
  try {
    const transacoes = await prisma.transacao.findMany({
      where: { usuarioId: req.usuarioId, tipo: "RECEITA" }
    });
    res.json(transacoes);

  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar' });
  }
};

export const listarDespesas = async (req, res) => {
  try {
    const transacoes = await prisma.transacao.findMany({
      where: { usuarioId: req.usuarioId, tipo: "DESPESA" }
    });

    res.json(transacoes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar ' });
  }
};

export const listarCategoria = async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany();

    res.status(200).json(categorias);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar transações' });
  }
};

