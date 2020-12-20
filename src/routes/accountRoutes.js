const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const AccountController = require('../controllers/accountController');

const router = express.Router();

router.use('/accounts', authMiddleware);
router.get('/accounts', AccountController.index);
router.get('/accounts/:id', AccountController.show);
router.post('/accounts', AccountController.store);
router.put('/accounts/:id', AccountController.update);
router.delete('/accounts/:id', AccountController.destroy);

module.exports = router;
