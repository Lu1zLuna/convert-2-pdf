const userModel = require('../models/user')

// GET /painel
exports.getUserPanel = (req, res) => {
    // Verifica se existe um usuário na sessão
    if (req.session.user) {
        // Se sim, renderiza a view painel.ejs, passando os dados do usuário
        res.render('painel', { user: req.session.user });
    } else {
        // Se não, volta para a página de login
        req.flash('error_msg', 'Você precisa estar logado para ver esta página.');
        res.redirect('/login');
    }
}

// --- UPDATE ---
exports.postUpdateProfile = (req, res) => {
    const { nome } = req.body;
    const email = req.session.user.email;

    userModel.update(email, { nome });
    req.session.user.nome = nome;

    req.flash('success_msg', 'Perfil atualizado com sucesso!');
    res.redirect('/painel');
}

// --- DELETE ---
exports.postDeleteAccount = (req, res) => {
    const email = req.session.user.email;
    userModel.remove(email);
    req.flash('success_msg', 'Conta excluída com sucesso!');

    req.session.destroy(() => {
        res.redirect('/');
    })
};