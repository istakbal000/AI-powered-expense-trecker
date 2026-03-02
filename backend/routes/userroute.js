const express=require('express')
const router=express.Router();
const userController=require('../controller/usercontroller');
const isauth=require('../middleware/isauth');

router.route('/register').post(userController.registerUser);
router.route('/login').post(userController.loginUser);
router.route('/logout').post(userController.logoutUser);
router.route('/google-auth').post(userController.googleAuth);
router.route('/update-profile').put(isauth, userController.updateProfile);
router.route('/update-password').put(isauth, userController.updatePassword);

module.exports=router;
