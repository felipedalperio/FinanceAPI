import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../generated/prisma/index.js'
const saltRounds = 10

const prisma = new PrismaClient();


export const register = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        // Criptografar senha
        const hashedPassword = await bcrypt.hash(senha, saltRounds);

        // Criar usuário
        const usuario = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: hashedPassword
            }
        });

        // Gerar token
        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Retornar token e usuário
        res.status(201).json({ token, usuario });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Erro ao registrar usuário' });
    }
};

export const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await prisma.usuario.findUnique({ where: { email } });

        if (!usuario) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const isMatch = await bcrypt.compare(senha, usuario.senha);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, usuario });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro no login' });
    }
};