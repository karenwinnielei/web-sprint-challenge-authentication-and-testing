const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = require('express').Router();

const Users = require('../users/users-model');
const { isValid } = require('../users/users-service');

router.post('/register', (req, res) => {
  const credentials = req.body;

  if (isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;

    const hash = bcryptjs.hashSync(credentials.password, rounds);

    credentials.password = hash;

    Users.add(credentials)
      .then((user) => {
        res.status(201).json({ data: user });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (isValid(req.body)) {
    Users.findBy({ username: username })
      .then(([user]) => {
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = makeJwt(user);

          res
            .status(200)
            .json({ message: 'welcome to the api', token });
        } else {
          res.status(401).json({ message: 'invalid credentials' });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  }
});

function makeJwt(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const secret = process.env.JWT_SECRET || 'the secret';

  const options = {
    expiresIn: '1h',
  };

  return jwt.sign(payload, secret, options);
}

module.exports = router;
