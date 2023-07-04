const express = require('express');
const router = express.Router();
const { User, Post, Comment } = require('../models');

router.get('/', handleHomepage);
router.get('/login', handleLogin);
router.get('/signup', handleSignup);
router.get('/post/:id', handleSinglePost);

function handleHomepage(req, res) {
    Post.findAll({
        order: [['created_at', 'DESC']],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));

        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(handleError(res));
}

function handleLogin(req, res) {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
}

function handleSignup(req, res) {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup');
}

function handleSinglePost(req, res) {
    Post.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found at this id!' });
            return;
        }

        const post = dbPostData.get({ plain: true });

        res.render('single-post', {
            post,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(handleError(res));
}

function handleError(res) {
    return function (err) {
        console.log(err);
        res.status(500).json(err);
    };
}

module.exports = router;
