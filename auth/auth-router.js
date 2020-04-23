const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('../api/secrets.js');

const Users = require('../users/users-model.js');

// POST - Register New User
router.post('/register', (req, res) => {
    let user = req.body;

    const rounds = process.env.HASH_ROUNDS || 8;
    const hash = bcrypt.hashSync(user.password, rounds);
    user.password = hash;

    Users.add(user) 
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: error.message });
        });
});

// POST - Login User
router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .then(([user]) => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = generateToken(user);

                res.status(200).json({ message: `Welcome ${user.username}, you are logged in!`, token });
            } else {
                res.status(401).json({ message: 'You shall not pass!' });
            }
        })
        .catch(error => {
            res.status(500).json({ errorMessage: error.message });
        });
});

function generateToken(user) {
    const payload = {
        userId: user.id,
        username: user.username,
        department: user.department || 'user'
    };
    const secret = secrets.jwtSecret;
    const options = {
        expiresIn: '1d'
    };

    return jwt.sign(payload, secret, options);
};

module.exports = router;