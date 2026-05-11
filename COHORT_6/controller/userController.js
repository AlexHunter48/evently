const userModel = require('../model/userModel');


exports.getAllUsers = async (req, res) => {
    try {
        const getALLusers = await userModel.find();
        return res
        .status(200)
        .json({ message: "All users fetched successfully", data: getALLusers });
    }catch (error) {
        return res
        .status(500)
        .json({ message: "Error fetching users", error });
    }
};

exports.getOneUser = async (req, res) => {
    try {
        const getOne = await userModel.findById(req.params.id);
        return res
            .status(200)
            .json({ message: "User fetched successfully", data: getOne });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Error fetching user", error });
    }
};

exports.newUser = async (req, res) => {
    try {
        const { username, password, phoneNumber, email } = req.body;
        const newUser = await userModel.create({ 
            username, 
            password, 
            phoneNumber, 
            email });
        return res
            .status(201)
            .json({ message: "User created successfully", data: newUser });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Error creating user", error });
    }
};