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