// Importa o bcrypt para criptografar senhas
const bcrypt = require('bcryptjs');

// Importa o model de usuários
const User = require('../models/user');

const { validationResult } = require('express-validator')

// --- FUNÇÕES POST ---

// POST /register
exports.postRegister = async (req, res) => {
    // 1. Extrai os resultados da validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // se tiver algum erro, envia-o via flash
        const errorMessages = errors.array().map(err => err.msg);
        req.flash('validation_errors', errorMessages);
        return res.redirect('/register');
    }

    // 2. Recebe os dados do formulário
    const { nome, email, senha } = req.body;

    try {
        // 3. Verifica se o usuário já existe
        const existingUser = User.findByEmail(email);
        if (existingUser) {
            req.flash('error_msg', 'Este e-mail já está cadastrado.');
            return res.redirect('/register');
        }

        // 4. Cria um hash da senha usando bcrypt
        const salt = await bcrypt.genSalt(10); // impede que senhas idênticas de usuário diferentes
                                               // sejam criptografadas de forma idêntica
        const hashedPassword = await bcrypt.hash(senha, salt);

        // 5. Cria o novo usuário com a senha criptografa
        const newUser = {
            nome,
            email,
            senha: hashedPassword,
        };

        User.create(newUser);

        // 6. Envia mensagem de sucesso e redireciona pra página de login
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
    // 1. Extrai os resultados da validação (para campos vazios)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        req.flash('validation_errors', errorMessages);
        return res.redirect('/login');
    }

    // 2. Recebe os dados do formulário
    const { email, senha } = req.body;

    try {
        // 3. Busca o usuário pelo e-mail
        const user = User.findByEmail(email);

        if (!user) {
            //4. Usuário não encontrado
            req.flash('error_msg', 'E-mail ou senha incorretos.');
            return res.redirect('/login');
        }
        //5. Usuário encontrado, agora compara a senha
        const isMatch = await bcrypt.compare(senha, user.senha);

        if (isMatch) {
            // 6. Senha correta, salva o usuário na sessão
            req.session.user = {
                id: user.id,
                nome: user.nome,
                email: user.email
            };
            // Redireciona para o painel do usuário
            return res.redirect('/painel');  // <-- PRÓXIMO PASSO: Criar esta rota
        } else {
            // Senha incorreta, volta para a página de login
            // 7. Senha incorreta, envie o erro e pare
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

// GET /logout
exports.getLogout = (req, res) => {
    // Apaga a sessão
    req.session.destroy((err) => {
        if (err) {
            console.error("Erro ao fazer logout:", err);
            return res.redirect('/'); // Redireciona para a home se der erro
        }

        // Envia mensagem de sucesso e redireciona
        req.flash('success_msg', 'Você saiu da sua conta com sucesso.');
        res.redirect('/login');
    });
};
