import express from 'express';
import { PrismaClient } from './generated/prisma/index.js'
import authRoutes from './src/routes/auth.routes.js';
import transacaoRoutes from './src//routes/transacao.routes.js';
import metaRoutes from './src//routes/meta.routes.js';
import relatorioRoutes from './src//routes/relatorio.routes.js';




const prisma = new PrismaClient()

const app = express();
app.use(express.json())


// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/transacoes', transacaoRoutes);
app.use('/api/metas', metaRoutes);
app.use('/api/relatorio', relatorioRoutes);


/*
app.post('/user', async (req, res) => {
  try {
    const { email, name, password, imgProfile, balance, transactions } = req.body

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Criar usuário com transações
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        imgProfile,
        balance,
        transactions: {
          create: transactions?.map((tx) => ({
            title: tx.title,
            amount: tx.amount,
            category: tx.category,
            type: tx.type
          }))
        }
      },
      include: {
        transactions: true // para retornar também as transações
      }
    })

    res.status(201).json(newUser)
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    res.status(500).json({ error: 'Erro ao criar usuário' })
  }
}) */


const PORT = 5000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));