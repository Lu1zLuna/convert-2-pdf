// middlewares/auth.js

module.exports = {
  // Permite acesso somente se existir req.session.user
  ensureAuth: (req, res, next) => {
    if (req.session && req.session.user) {
      return next();
    }
    // Se não estiver autenticado:
    req.flash('error_msg', 'Você precisa estar logado para ver esta página.');
    return res.redirect('/login');
  },

  // Permite acesso somente se NÃO estiver logado
  ensureGuest: (req, res, next) => {
    if (!req.session || !req.session.user) {
      return next();
    }
    // Se já estiver logado, redireciona para painel (ou home)
    return res.redirect('/painel');
  }
};
