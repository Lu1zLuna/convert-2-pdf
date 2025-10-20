// Importa o bcrypt para criptografar senhas
const bcrypt = require('bcryptjs');

// Importa o model de usuários
const User = require('../models/user');

// --- FUNÇÕES POST ---

// POST /register
exports.registerUser = async (req, res) => {
    // 1. Recebe os dados do formulário
    const { name, email, password } = req.body;

    try {
        // Verifica se o usuário já existe
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            // Será renderizada uma página de registro com um erro
            // Provisoriamente vou enviar uma mensagem
            return res.status(400).send('Este e-mail já está em uso.');
        }

        // 2. Cria um hash da senha usando bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Cria o novo usuário com a senha criptografa
        const newUser = {
            name,
            email,
            password: hashedPassword,
        };

        await User.create(newUser);

        // 4. Redireciona para a página de login quando for bem sucedido
        return res.redirect('/login');
    } catch (error) {
        console.error("Erro no registo:", error);
        res.status(500).send("Ocorreu um erro ao registrar o usuário.");
    }
}

// POST /login
exports.loginUser = async (req, res) => {
    // 1. Recebe os dados do formulário
    const { email, password } = req.body;

    try {
        // 2. Busca o usuário pelo e-mail
        const user = await User.findByEmail(email);

        if (user) {
            // Usuário encontrado, agora compara a senha
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                // 4. Senha correta, salva o usuário na sessão
                req.session.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email
                };
                // Redireciona para o painel do usuário
                return res.redirect('/painel');
            } else {
                // Senha incorreta, volta para a página de login
                // Falta implementar mensagem de erro
                return res.redirect('/login');
            }
        } else {
            // Usuário não encontrado, volta para a página de login
            // Falta implementar mensagem de erro
            return res.redirect('/login');
        }
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).send("Ocorreu um erro ao fazer login.");
    }
};


// --- FUNÇÕES GET ---

// GET /painel
exports.getUserPanel = (req, res) => {
    // Verifica se existe um usuário na sessão
    if (req.session.user) {
        // Se sim, renderiza a view painel.ejs, passando os dados do usuário
        res.render('painel', { user: req.session.user });
    } else {
        // Se não, volta para a página de login
        res.redirect('/login');
    }
}

// GET /logout
exports.logoutUser = (req, res) => {
    // Apaga a sessão
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/painel'); // Se der erro, mantém o usuário no painel
        }
        // Redireciona para a página inicial após o logout
        res.redirect('/');
    });
};