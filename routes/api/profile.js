const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//load models
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// Load Input Validation
const validateProfileInput = require('../../validations/profile');
const validateExperienceInput = require('../../validations/experience');
const validateEducationInput = require('../../validations/education');

//@route   GET api/profile/test
//@desc    Tests profile route
//@access  Public
router.get('/test', (req, res) => res.json({msg: 'profile works'}));

//@route   GET api/profile/all
//@desc    Get all profiles
//@access  Public

router.get('/all', (req, res) => {
    let errors = {};
    Profile.find()
        .populate('user', 'name avatar')
        .then(profiles => {
            if (!profiles) {
                errors.noprofile = 'There are no profiles';
                res.status(404).json(errors);
            }
            res.status(200).json(profiles);
        })
        .catch(err => res.status(404).json({profile: 'There are no profiles'}));
});

//@route   GET api/profile/handle/:handle
//@desc    Get profile by handle
//@access  Public

router.get('/handle/:handle', (req, res) => {
    let errors = {};
    Profile.findOne({handle: req.params.handle})
        .populate('user', 'name avatar')
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

//@route   GET api/profile/user/:user_id
//@desc    Get profile by user_id
//@access  Public

router.get('/user/:user_id', (req, res) => {
    let errors = {};
    Profile.findOne({user: req.params.user_id})
        .populate('user', 'name avatar')
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err =>
            res
                .status(404)
                .json({profile: 'There is no profile for this user'}),
        );
});

//@route   GET api/profile
//@desc    get current user profile
//@access  private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    let errors = {};
    Profile.findOne({user: req.user.id})
        .populate('user', 'name avatar')
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'there is not prfile for this user';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

//@route   Post api/profile
//@desc    Create  or edit user profile
//@access  private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validateProfileInput(req.body);

    //check validation
    if (!isValid) {
        //return any errors
        res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
        profileFields.githubusername = req.body.githubusername;
    // Skills - Spilt into array
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({user: req.user.id}).then(profile => {
        if (profile) {
            // Update
            Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields},
                {new: true},
            ).then(profile => res.json(profile));
        } else {
            // Create

            // Check if handle exists
            Profile.findOne({handle: profileFields.handle}).then(profile => {
                if (profile) {
                    errors.handle = 'That handle already exists';
                    res.status(400).json(errors);
                }

                // Save Profile
                new Profile(profileFields)
                    .save()
                    .then(profile => res.json(profile))
                    .catch(err => res.status(400).json(err));
            });
        }
    });
});

//@route   Post api/profile/experience
//@desc    Create a new experience
//@access  private

router.post(
    '/experience',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const {errors, isValid} = validateExperienceInput(req.body);

        //check validation
        if (!isValid) {
            //return any errors
            res.status(400).json(errors);
        }
        Profile.findOne({user: req.user.id})
            .then(profile => {
                if (!profile) {
                    res.status(404).json({
                        profile: 'There is no profile for this user',
                    });
                }
                const {
                    title,
                    company,
                    location,
                    from,
                    to,
                    current,
                    description,
                } = req.body;
                const newExp = {
                    title,
                    company,
                    location,
                    from,
                    to,
                    current,
                    description,
                };

                profile.experience.unshift(newExp);
                profile
                    .save()
                    .then(profile => res.status(200).json(profile))
                    .catch(err => res.status(404).json(err));
            })
            .catch(err =>
                res
                    .status(404)
                    .json({profile: 'there is no profile for this user'}),
            );
    },
);

//@route   Post api/profile/education
//@desc    Create a new education
//@access  private

router.post(
    '/education',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const {errors, isValid} = validateEducationInput(req.body);

        //check validation
        if (!isValid) {
            //return any errors
            res.status(400).json(errors);
        }
        Profile.findOne({user: req.user.id})
            .then(profile => {
                if (!profile) {
                    res.status(404).json({
                        profile: 'There is no profile for this user',
                    });
                }
                const {
                    school,
                    degree,
                    fieldofstudy,
                    from,
                    to,
                    current,
                    description,
                } = req.body;
                const newEdu = {
                    school,
                    degree,
                    fieldofstudy,
                    from,
                    to,
                    current,
                    description,
                };

                profile.education.unshift(newEdu);
                profile
                    .save()
                    .then(profile => res.status(200).json(profile))
                    .catch(err => res.status(404).json(err));
            })
            .catch(err =>
                res
                    .status(404)
                    .json({profile: 'there is no profile for this user'}),
            );
    },
);

//@route   Delete api/profile/experience/:exp_id
//@desc    Delete experience
//@access  private

router.delete(
    '/experience/:exp_id',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Profile.findOne({user: req.user.id}).then(profile => {
            //get removed index
            const removeIndex = profile.experience
                .map(item => item.id)
                .indexOf(req.params.exp_id);

            //splice out of arry
            profile.experience.splice(removeIndex, 1);
            profile.save().then(
                res
                    .status(200)
                    .json(profile)
                    .catch(err => res.status(404).json(err)),
            );
        });
    },
);

//@route   Delete api/profile/education/:edu_id
//@desc    Delete education
//@access  private

router.delete(
    '/education/:edu_id',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Profile.findOne({user: req.user.id}).then(profile => {
            //get removed index
            const removeIndex = profile.education
                .map(item => item.id)
                .indexOf(req.params.edu_id);

            //splice out of arry
            profile.education.splice(removeIndex, 1);
            profile.save().then(
                res
                    .status(200)
                    .json(profile)
                    .catch(err => res.status(404).json(err)),
            );
        });
    },
);

//@route   Delete api/profile/
//@desc    Delete user and profile
//@access  private

router.delete(
    '/',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Profile.findOneAndDelete({user: req.user.id}).then(() => {
            User.findOneAndDelete({_id: req.user.id})
                .then(() => res.json('User and profile are deleted'))
                .catch(err => res.json(err));
        });
    },
);

module.exports = router;
