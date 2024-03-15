
const express = require('express');
const {
    signUpValidator,
    loginValidator,

} = require('../shared/validators/authValidator');

const { signup, login, forgotPassword, verifyPassResetCode, resetPassword} = require('../Controllers/authController');

const router = express.Router();

//routes for authentication
router.post('/signup', signUpValidator, signup);
router.post('/login', loginValidator, login);
router.post('/forgotPassword', forgotPassword);
router.post('/verifyResetCode', verifyPassResetCode);
router.put('/resetPassword', resetPassword);




module.exports = router;