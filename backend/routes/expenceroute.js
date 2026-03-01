const express=require('express')
const { expenseadd, getallexpence, markasdoneorundone, deleteexpence, updateexpence } = require('../controller/expensecontroller');
const isauth=require('../middleware/isauth.js');
const router=express.Router();
router.route('/addexpence').post(isauth, expenseadd);
router.route('/getallexpence').get(isauth, getallexpence);
router.route('/markasdone/:id').put(isauth, markasdoneorundone);
router.route('/deleteexpence/:id').delete(isauth, deleteexpence);
router.route('/updateexpence/:id').put(isauth, updateexpence);
module.exports=router;