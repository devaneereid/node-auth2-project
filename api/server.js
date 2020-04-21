const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const usersRouter = require('../users/users-router.js');
const authRouter = require('../auth/auth-router.js');
const authenticator = require('../auth/authenticator.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/users', authenticator, checkRole('user'), usersRouter);
server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
    res.send('<h2>Node Auth-2 Project</h2>');
});

function checkRole(role) {
    return (req, res, next) => {
        if (
            req.decodedToken && 
            req.decodedToken.role === 'management'
        ) {
            next();
        } else {
            res.status(403).json({ you: 'Shall not pass' })
        }
    };
}

// function managementRole (req, res, next) {
//     console.log(req.decodedToken.role) 
//     if (req.decodedToken.role === 'management') {
//        next();
//     } else {
//         res.status(400).json({ message: 'access denied'})
//     }
// };

module.exports = server;
