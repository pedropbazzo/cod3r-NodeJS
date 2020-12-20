const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const UserController = require('../controllers/userController');

const router = express.Router();

router.get('/users', authMiddleware, UserController.index);
router.post('/users', UserController.store);

module.exports = router;
