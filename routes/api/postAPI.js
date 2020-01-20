const express = require('express');
const router = express.Router();
const postAPICtrl = require('../../controllers/api/postsAPI');

router.get('/',    postAPICtrl.index);
router.get('/:postId', postAPICtrl.findOnePost);
router.put('/:postId', postAPICtrl.updateOnePost);
router.delete('/:postId', postAPICtrl.deleteOnePost);

router.post('/:postId', postAPICtrl.newComment);
router.get('/:postId/:commentId', postAPICtrl.findOneComment);
router.put('/:postId/:commentId', postAPICtrl.updateOneComment);
router.delete('/:postId/:commentId', postAPICtrl.deleteOneComment);

router.get('/user/:id', postAPICtrl.findOneUser);
router.put('/user/:id', postAPICtrl.updateOneUser);

module.exports = router;