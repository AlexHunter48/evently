const express = require("express");
const {
    getAllUsers , 
    getOneUser , 
    newUser,
} = require('../controller/userController');

const router = express.Router();

router.get("/getAllUsers", getAllUsers);
router.get("/getOneUser/:id", getOneUser);
router.post("/newUser", newUser);

module.exports = router;