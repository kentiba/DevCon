const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

//Load validations
const validatePostInput = require('../../validations/post');

//@route   GET api/posts/test
//@desc    Tests posts route
//@access  Public
router.get('/test', (req, res) => res.json({msg: 'posts works'}));

//@route   Get api/posts
//@desc    Get all posts
//@access  Public

router.get('/', (req, res) => {
    Post.find()
        .sort({date: -1})
        .then(posts => res.status(200).json(posts))
        .catch(err => res.status(400).json({error: 'There are no posts'}));
});

//@route   Get api/posts
//@desc    Get single posts
//@access  Public

router.get('/:post_id', (req, res) => {
    Post.findOne({_id: req.params.post_id})
        .then(posts => res.status(200).json(posts))
        .catch(err =>
            res.status(400).json({error: 'no post found with that ID'}),
        );
});

//@route   POST api/posts
//@desc    Create new Post
//@access  Private

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validatePostInput(req.body);
    //check validation
    if (!isValid) {
        //return any errors
        res.status(400).json(errors);
    }
    const {user} = req.user.id;
    const {text, name, avatar} = req.body;
    const newPost = new Post({
        text,
        name,
        avatar,
        user,
    });
    newPost
        .save()
        .then(post => res.status(200).json(post))
        .catch(err => res.status(400).json(err));
});

//@route   Delete api/posts
//@desc    Delete single posts
//@access  Private

router.delete(
    '/:id',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Profile.findOne({user: req.user.id})
            .then(profile => {
                Post.findById(req.params.id)
                    .then(post => {
                        if (post.user.toString() !== req.user.id) {
                            return res.status(401).json({
                                error: 'User is not authorized',
                            });
                        }
                        post.remove()
                            .then(() =>
                                res
                                    .status(200)
                                    .json({success: 'Post is deleted'}),
                            )
                            .catch(err => res.status(400).json(err));
                    })
                    .catch(err => res.status(400).json(err));
            })
            .catch(err => res.status(400).json(err));
    },
);

//@route   POST api/posts/like/:id
//@desc    Like a Post
//@access  Private

router.post(
    '/like/:id',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Profile.findOne({user: req.user.id})
            .then(profile => {
                Post.findById(req.params.id)
                    .then(post => {
                        //check if user liked the post
                        if (
                            post.likes.filter(
                                like => like.user.toString() === req.user.id,
                            ).length > 0
                        ) {
                            res.status(404).json({
                                alreadyLiked:
                                    'User has already liked this post',
                            });
                        }

                        post.likes.unshift({user: req.user.id});

                        post.save()
                            .then(post => res.status(200).json(post))
                            .catch(err => res.status(400).json(err));
                    })
                    .catch(err => res.status(404).json(err));
            })
            .catch(err => res.status(404).json(err));
    },
);

//@route   POST api/posts/unlike/:id
//@desc    Dislike a Post
//@access  Private

router.post(
    '/unlike/:id',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Profile.findOne({user: req.user.id})
            .then(profile => {
                Post.findById(req.params.id)
                    .then(post => {
                        //check if user liked the post
                        if (
                            post.likes.filter(
                                like => like.user.toString() === req.user.id,
                            ).length === 0
                        ) {
                            res.status(404).json({
                                notLiked: 'User hasnt liked this post',
                            });
                        }
                        const removeIndex = post.likes
                            .map(item => item.user.toString())
                            .indexOf(req.user.id);
                        post.likes.splice(removeIndex, 1);

                        post.save()
                            .then(post => res.status(200).json(post))
                            .catch(err => res.status(400).json(err));
                    })
                    .catch(err => res.status(404).json(err));
            })
            .catch(err => res.status(404).json(err));
    },
);

//@route   POST api/posts/comment/:id
//@desc    post a comment
//@access  Private

router.post(
    '/comment/:id',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const {errors, isValid} = validatePostInput(req.body);
        //check validation
        if (!isValid) {
            //return any errors
            res.status(400).json(errors);
        }
        Post.findById(req.params.id)
            .then(post => {
                const user = req.user.id;
                const {text, name, avatar} = req.body;
                const newComment = {text, name, avatar, user};
                post.comments.unshift(newComment);
                post.save()
                    .then(post => res.status(200).json(post))
                    .catch(err => res.status(400).json(err));
            })
            .catch(err => res.status(404).json(err));
    },
);

//@route   Delete api/posts/comment/:id
//@desc    delete a comment
//@access  Private

router.delete(
    '/comment/:id/:comment_id',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Post.findById(req.params.id)
            .then(post => {
                //checj to see if comment exists
                if (
                    post.comments.filter(
                        comment =>
                            comment._id.toString() === req.params.comment_id,
                    ).length === 0
                ) {
                    res.status(404).json({
                        nocomment: 'there is no comment with this id',
                    });
                }
                const removeIndex = post.comments
                    .map(item => item._id.toString())
                    .indexOf(req.params.comment_id);
                post.comments.splice(removeIndex, 1);
                post.save()
                    .then(post => res.status(200).json(post))
                    .catch(err => res.status(400).json(err));
            })
            .catch(err => res.status(404).json(err));
    },
);

module.exports = router;
