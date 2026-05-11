const express = require("express");
const {
    getAllUsers , 
    getOneUser , 
    newUser,
    updateUser,
    deleteUser
} = require('../controller/userController');

const router = express.Router();

router.get("/getAllUsers", getAllUsers);
router.get("/getOneUser/:id", getOneUser);
router.post("/newUser", newUser);
router.patch("/updateUser/:id", updateUser);
router.delete("/deleteUser/:id", deleteUser);

module.exports = router;