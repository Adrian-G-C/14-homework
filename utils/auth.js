function withAuth(req, res, next) {
    req.session.user_id ? next() : res.redirect('/login');
}

module.exports = withAuth;