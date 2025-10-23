exports.getHomePage = (req, res) => {
    res.render('index');
}

exports.getLoginPage = (req, res) => {
    res.render('login');
}

exports.getRegisterPage = (req, res) => {
    res.render('register');
}

exports.getImageToPdfPage = (req, res) => {
    res.render('image-to-pdf');
}

exports.getCombinarPdf = (req, res) => {
    res.render('combinar-pdf');
}

exports.getFaqPage = (req, res) => {
    res.render('faq');
}