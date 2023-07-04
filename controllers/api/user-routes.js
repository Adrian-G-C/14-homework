const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

const handleErrorResponse = (res, err) => {
  console.log(err);
  res.status(500).json(err);
};

router.get('/', async (req, res) => {
  try {
    const dbUserData = await User.findAll();
    res.json(dbUserData);
  } catch (err) {
    handleErrorResponse(res, err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Post,
          attributes: ['id', 'title', 'text', 'created_at'],
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'created_at'],
          include: {
            model: User,
            attributes: ['username'],
          },
        },
      ],
    });

    if (!dbUserData) {
      res.status(404).json({ message: 'No user found at this id!' });
      return;
    }

    res.json(dbUserData);
  } catch (err) {
    handleErrorResponse(res, err);
  }
});

router.post('/', async (req, res) => {
  try {
    const dbUserData = await User.create({
      username: req.body.username,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;

      res.json(dbUserData);
    });
  } catch (err) {
    handleErrorResponse(res, err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: { username: req.body.username },
    });

    if (!dbUserData) {
      res.status(400).json({ message: 'No user found at this username' });
      return;
    }

    const validatePassword = dbUserData.checkPassword(req.body.password);

    if (!validatePassword) {
      res.status(400).json({ message: 'Incorrect password' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;

      res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
  } catch (err) {
    handleErrorResponse(res, err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.put('/:id', async (req, res) => {
  try {
    const dbUserData = await User.update(req.body, {
      individualHooks: true,
      where: { id: req.params.id },
    });

    if (!dbUserData[0]) {
      res.status(404).json({ message: 'No user found at this id!' });
      return;
    }

    res.json(dbUserData);
  } catch (err) {
    handleErrorResponse(res, err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const dbUserData = await User.destroy({
      where: { id: req.params.id },
    });

    if (!dbUserData) {
      res.status(404).json({ message: 'No user found at this id' });
      return;
    }

    res.json(dbUserData);
  } catch (err) {
    handleErrorResponse(res, err);
  }
});

module.exports = router;
