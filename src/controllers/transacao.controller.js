import { PrismaClient } from '../../generated/prisma/index.js'


const prisma = new PrismaClient();

export const criarTransacao = async (req, res) => {

  const { categoriaId, tipo, descricao, valor, dataTransacao } = req.body;

  const data = {
    usuarioId: req.usuarioId,
    tipo,
    descricao,
    valor,
    dataTransacao: new Date(dataTransacao),
  };

  if (categoriaId) {
    data.categoriaId = categoriaId;
  }

  try {
    const transacao = await prisma.transacao.create({
      data
    });

    res.status(201).json(transacao);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }

};

export const listarTransacoes = async (req, res) => {
  try {
    const ultimosDoze = req.params.ultimosDoze === 'true';
    const anoAtual = new Date().getFullYear();
    const dataAtual = new Date();

    let dataInicio = new Date();
    let dataFim = dataAtual;

    if (!ultimosDoze) {
      dataInicio = new Date(`${anoAtual}-01-01`);
      dataFim = new Date(`${anoAtual}-12-31`);
    } else {
      dataInicio.setMonth(dataInicio.getMonth() - 12);
    }

    const transacoes = await prisma.transacao.findMany({
      where: {
        usuarioId: req.usuarioId,
        dataTransacao: {
          gte: dataInicio,
          lte: dataFim
        }
      },
      include: {
        categoria: true
      },
      orderBy: { dataCriacao: 'desc' }
    });

    const transacoesFormatadas = transacoes.map(transacao => ({
      ...transacao,
      dataTransacao: new Date(transacao.dataTransacao).toLocaleDateString('pt-BR'),
      valorFormatado: formatarValorCompleto(transacao.valor),
      categoria: transacao.categoria ? transacao.categoria.nome : 'Sem categoria',
    }));

    res.json(transacoesFormatadas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar transações' });
  }
};


function formatarValorCompleto(valor, moeda = 'BRL', locale = 'pt-BR') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: moeda,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}





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
    const categorias = await prisma.categoria.findMany({
      where: { ativa: true }
    });
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};


export const criarCategoria = async (req, res) => {
  try {
    const { nome, ativa } = req.body;

    const categorias = await prisma.categoria.create({
      data: {
        nome,
        ativa
      }
    })

    res.status(201).json(categorias);

  } catch (err) {
    res.status(500).send(err)
  }
}

export const deleteTransicao = async (req, res) => {
  try {
    const { id } = req.params;

    const transacao = await prisma.transacao.delete({
      where: { usuarioId: req.usuarioId, id: id }
    });

    res.status(200).json(transacao);

  } catch (err) {
    res.status(500).send(err)
  }
}

