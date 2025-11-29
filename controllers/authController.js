// Importa o bcrypt para criptografar senhas
const bcrypt = require('bcryptjs');

// --- Importação do Model via Sequelize ---
const { User } = require('../models'); 

const { validationResult } = require('express-validator')

// --- FUNÇÕES POST ---

// POST /register
exports.postRegister = async (req, res) => {
    // 1. Extrai os resultados da validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        req.flash('validation_errors', errorMessages);
        return res.redirect('/register');
    }

    // 2. Recebe os dados do formulário
    const { nome, email, senha } = req.body;

    try {
        // --- Busca no Banco ---
        const existingUser = await User.findOne({ where: { email: email } });
        
        if (existingUser) {
            req.flash('error_msg', 'Este e-mail já está cadastrado.');
            return res.redirect('/register');
        }

        // 4. Cria um hash da senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        // --- Criar usuario no banco ---
        await User.create({
            nome,
            email,
            senha: hashedPassword
        });

        // 6. Sucesso
        req.flash('success_msg', 'Você foi registrado com sucesso e já pode fazer login!');
        return res.redirect('/login')

    } catch (error) {
        console.error("Erro no registro:", error);
        req.flash('error_msg', 'Ocorreu um erro no servidor. Tente novamente.');
        res.redirect('/register');
    }
}

// POST /login
exports.postLogin = async (req, res) => {
    // 1. Extrai erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        req.flash('validation_errors', errorMessages);
        return res.redirect('/login');
    }

    // 2. Recebe dados
    const { email, senha } = req.body;

    try {
        // --- Busca usuário pelo email ---
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            // 4. Usuário não encontrado
            req.flash('error_msg', 'E-mail ou senha incorretos.');
            return res.redirect('/login');
        }
        
        // 5. Usuário encontrado, compara a senha
        const isMatch = await bcrypt.compare(senha, user.senha);

        if (isMatch) {
            // 6. Senha correta, salva na sessão
            req.session.user = {
                id: user.id,
                nome: user.nome,
                email: user.email
            };
            return res.redirect('/painel');
        } else {
            // 7. Senha incorreta
            req.flash('error_msg', 'E-mail ou senha incorretos.');
            return res.redirect('/login');
        }
    } catch (error) {
        console.error("Erro no login:", error);
        req.flash('error_msg', 'Ocorreu um erro no servidor. Tente novamente.');
        res.redirect('/login');
    }
}


// --- FUNÇÕES GET ---

exports.getLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Erro ao fazer logout:", err);
            return res.redirect('/'); 
        }

        res.redirect('/login'); 
    });
};