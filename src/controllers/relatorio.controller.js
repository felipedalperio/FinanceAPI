import { PrismaClient } from '../../generated/prisma/index.js'
const prisma = new PrismaClient();

export const obterResumoMensal = async (req, res) => {
  const { ano, mes } = req.params;

  try {
    const resumo = await prisma.resumoMensal.findUnique({
      where: {
        usuarioId_ano_mes: {
          usuarioId: req.usuarioId,
          ano: parseInt(ano),
          mes: parseInt(mes)
        }
      }
    });

    if (!resumo) {
      return res.status(404).json({ error: 'Resumo mensal não encontrado' });
    }

    res.json(resumo);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar resumo mensal' });
  }
};
