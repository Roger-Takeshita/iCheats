const express = require('express');
const router = express.Router();
const postAPICtrl = require('../../controllers/api/postsAPI');

router.get('/',    postAPICtrl.index);
router.get('/:postId', postAPICtrl.showOnePost);

router.get('/:postId/:commentId', postAPICtrl.showOneComment);
router.put('/:postId/:commentId', postAPICtrl.updateOneComment);
router.delete('/:postId/:commentId', postAPICtrl.deleteOneComment);

router.get('/user/:id', postAPICtrl.findOneUser);
router.put('/user/:id', postAPICtrl.updateOneUser);

module.exports = router;