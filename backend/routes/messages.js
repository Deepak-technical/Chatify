const{addMessages,getMessages}=require('../controllers/messageControllers')

const router=require("express").Router();

router.post("/addmsg/",addMessages);
router.post("/getmsg/",getMessages);

module.exports = router;
