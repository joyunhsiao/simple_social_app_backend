const express = require('express');
const router = express.Router();
const postsControllers = require('../controllers/posts');

router.get('/', postsControllers.getPosts);
router.post('/', postsControllers.createPost);

module.exports = router;