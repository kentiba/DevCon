const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys').secretOrKey;

const router = express.Router();

// Load Input Validation
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');

//Load user model
const User = require('../../models/User');
//@route   GET api/users/test
//@desc    Tests users route
//@access  Public
router.get('/test', (req, res) => res.json({msg: 'users works'}));

//@route   GET api/users/register
//@desc    REGISTER user
//@access  Public
router.post('/register', (req, res) => {
    const {errors, isValid} = validateRegisterInput(req.body);

    //check validations
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email}).then(user => {
        if (user) {
            return res.status(400).json({email: 'Email already exist'});
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200', //Siza
                r: 'pg', //Rating
                d: 'mm', //Default
            });

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password,
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

//@route   GET api/users/login
//@desc    login user / return JWT Token
//@access  Public

router.post('/login', (req, res) => {
    const {errors, isValid} = validateLoginInput(req.body);

    //check validations
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;

    //find user by email
    User.findOne({email}).then(user => {
        if (!user) {
            errors.email = 'User not found';
            return res.status(404).json(errors);
        }

        //check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // user matched
                //create jwt payload
                const payload = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                };
                //sign token
                jwt.sign(payload, keys, {expiresIn: 3600}, (err, token) => {
                    res.json({
                        success: true,
                        token: 'Bearer ' + token,
                    });
                });
            } else {
                errors.password = 'Password is incorrect';
                res.status(400).json(errors);
            }
        });
    });
});

//@route   GET api/users/current
//@desc    return current user
//@access  Private
router.get(
    '/current',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
        });
    },
);

module.exports = router;
