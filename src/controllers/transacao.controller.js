import { PrismaClient } from '../../generated/prisma/index.js'


const prisma = new PrismaClient();

export const criarTransacao = async (req, res) => {

  const { categoriaId, tipo, descricao, valor, dataTransacao, formaPagamento, parcelas } = req.body;

  const data = {
    usuarioId: req.usuarioId,
    tipo,
    descricao,
    valor,
    dataTransacao: new Date(dataTransacao + 'T12:00:00'),
    formaPagamento,
    parcelas
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

export const updateTransacao = async (req, res) => {
  const { id } = req.params;
  const { categoriaId, tipo, descricao, valor, dataTransacao, formaPagamento, parcelas } = req.body;

  const data = {
    usuarioId: req.usuarioId,
    tipo,
    descricao,
    valor,
    dataTransacao: new Date(dataTransacao + 'T12:00:00'),
    formaPagamento,
    parcelas
  };

  if (categoriaId) {
    data.categoriaId = categoriaId;
  }

  try {
    const transacao = await prisma.transacao.update({
      where: {
        usuarioId: req.usuarioId, id: id,
      },
      data,
    });

    res.status(200).json(transacao);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


/*
export const listarTransacoes = async (req, res) => {
  try {
    const { inicio, fim, ultimosDoze } = req.query;

    const anoAtual = new Date().getFullYear();
    const dataAtual = new Date();

    let dataInicio = new Date();
    let dataFim = dataAtual;

    if (inicio && fim) {
      dataInicio = new Date(inicio + 'T00:00:00');
      dataFim = new Date(fim + 'T23:59:59');
    } else if (ultimosDoze === 'true') {
      dataInicio.setMonth(dataInicio.getMonth() - 12);
    } else {
      // ANO ATUAL – AJUSTE: incluir transações do final do ano passado com parcelas
      // Começa 12 meses antes de janeiro do ano atual
      dataInicio = new Date(`${anoAtual}-01-01T00:00:00`);
      dataInicio.setMonth(dataInicio.getMonth() - 11); // retrocede 11 meses para incluir parcelas anteriores
      dataFim = new Date(`${anoAtual}-12-31T23:59:59`);
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
      orderBy: { dataTransacao: 'desc' }
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
}; */


export const listarTransacoes = async (req, res) => {
  try {
    const { inicio, fim, ultimosDoze } = req.query;

    const anoAtual = new Date().getFullYear();
    const dataAtual = new Date();

    let dataInicio = new Date();
    let dataFim = dataAtual;

    if (inicio && fim) {
      // Se as datas foram enviadas via query
      dataInicio = new Date(inicio + 'T00:00:00');
      dataFim = new Date(fim + 'T23:59:59');
    } else if (ultimosDoze === 'true') {
      dataInicio.setMonth(dataInicio.getMonth() - 12);
    } else {
      dataInicio = new Date(`${anoAtual}-01-01T00:00:00`);
      dataFim = new Date(`${anoAtual}-12-31T23:59:59`);
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
      orderBy: { dataTransacao: 'desc' }
    });

    const transacoesFormatadas = transacoes.map(transacao => ({
      ...transacao,
      dataTransacao: new Date(transacao.dataTransacao).toLocaleDateString('pt-BR'),
      valorFormatado: formatarValorCompleto(transacao.valor),
      categoria: transacao.tipo === 'RECEITA' ? 'Entrada' : (transacao.categoria ? transacao.categoria.nome : 'Sem categoria'),
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
    const { inicio, fim } = req.query;

    let dataInicio = new Date(`${new Date().getFullYear()}-01-01T00:00:00`);
    let dataFim = new Date(`${new Date().getFullYear()}-12-31T23:59:59`);

    if (inicio && fim) {
      dataInicio = new Date(`${inicio}T00:00:00`);
      dataFim = new Date(`${fim}T23:59:59`);
    }

    const transacoes = await prisma.transacao.findMany({
      where: {
        usuarioId: req.usuarioId,
        tipo: "RECEITA",
        dataTransacao: {
          gte: dataInicio,
          lte: dataFim
        }
      }
    });

    res.json(transacoes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar receitas' });
  }
};

export const listarDespesas = async (req, res) => {
  try {
    const { inicio, fim } = req.query;

    let dataInicio = new Date(`${new Date().getFullYear()}-01-01T00:00:00`);
    let dataFim = new Date(`${new Date().getFullYear()}-12-31T23:59:59`);

    if (inicio && fim) {
      dataInicio = new Date(`${inicio}T00:00:00`);
      dataFim = new Date(`${fim}T23:59:59`);
    }

    const transacoes = await prisma.transacao.findMany({
      where: {
        usuarioId: req.usuarioId,
        tipo: "DESPESA",
        dataTransacao: {
          gte: dataInicio,
          lte: dataFim
        }
      }
    });

    res.json(transacoes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar despesas' });
  }
};


export const listarCategoria = async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      where: { ativa: true },
      orderBy: {
        dataCriacao: 'asc'
      }
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

