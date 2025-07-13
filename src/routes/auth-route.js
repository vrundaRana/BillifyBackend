const express = require('express');
const {registerUser, loginUser, logoutUser } = require('../controllers/auth-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const router=express.Router();
router.post('/register',registerUser)
router.post('/login', loginUser)
router.get('/check', authMiddleware, (req, res) => {
  res.sendStatus(200);
});
router.post('/logout',logoutUser)
module.exports=router
