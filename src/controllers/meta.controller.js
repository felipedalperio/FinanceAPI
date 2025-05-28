import { PrismaClient } from '../../generated/prisma/index.js'

const prisma = new PrismaClient();

export const criarMeta = async (req, res) => {
  const { titulo, descricao, valorObjetivo, dataObjetivo } = req.body;

  try {
    const meta = await prisma.meta.create({
      data: {
        usuarioId: req.usuarioId,
        titulo,
        descricao,
        valorObjetivo,
        dataObjetivo: dataObjetivo ? new Date(dataObjetivo) : null
      }
    });

    res.status(201).json(meta);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar meta' });
  }
};

export const listarMetas = async (req, res) => {
  try {
    const metas = await prisma.meta.findMany({
      where: { usuarioId: req.usuarioId }
    });

    res.json(metas);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar metas' });
  }
};
