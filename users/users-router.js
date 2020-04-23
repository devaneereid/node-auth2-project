const router = require('express').Router();

const Users = require('./users-model.js');

// GET USERS
router.get('/', ( req, res) => {
    console.log('token', req.decodedToken);
    Users.find()
        .then(users => {
            res.json(users);
        }) 
        .catch(error => {
            console.log(error);
            res.send(error);
        });
});

module.exports = router;