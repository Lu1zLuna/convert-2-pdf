// Importa o modelo através do index criado pelo sequelize
const { User } = require('../models'); 

// GET /painel
exports.getUserPanel = (req, res) => {
    // A sessão continua igual, não precisa ser async aqui pois pega da memória
    if (req.session.user) {
        res.render('painel', { user: req.session.user });
    } else {
        req.flash('error_msg', 'Você precisa estar logado.');
        res.redirect('/login');
    }
}

// --- UPDATE ---
exports.postUpdateProfile = async (req, res) => {
    const { nome } = req.body;
    const email = req.session.user.email;

    try {
        // Atualiza no Banco de Dados (SQLite)
        await User.update({ nome: nome }, {
            where: { email: email }
        });

        // Atualiza a sessão
        req.session.user.nome = nome;

        req.flash('success_msg', 'Perfil atualizado com sucesso!');
        res.redirect('/painel');
    } catch (error) {
        console.log(error);
        req.flash('error_msg', 'Erro ao atualizar perfil.');
        res.redirect('/painel');
    }
}

// --- DELETE ---
exports.postDeleteAccount = async (req, res) => {
    const email = req.session.user.email;

    try {
        // Deleta do Banco de Dados
        await User.destroy({
            where: { email: email }
        });

        req.flash('success_msg', 'Conta excluída com sucesso!');
        
        // Destrói a sessão
        req.session.destroy(() => {
            res.redirect('/');
        });
    } catch (error) {
        console.log(error);
        req.flash('error_msg', 'Erro ao excluir conta.');
        res.redirect('/painel');
    }
};