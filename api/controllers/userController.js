import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";

export const test = (req, res) => {
    res.json({
        message: "Test API working"
    })
}

export const updateUser = async (req, res, next) => {
    // data received from verifyUser
    if(req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can update only your account"));
    }

    try {
        // change password
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                photo: req.body.photo
            } //check if data is being changed. if not, it will not update
        }, { new: true }); //return and save the updated user

        //separate password
        const { password, ...rest } = updateUser._doc;

        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    // check token
    if(req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can delete only your account"));
    }

    try {
        await User.findByIdAndDelete(req.params.id);
        
        // delete cookie
        res.clearCookie("access_token");
        res.status(200).json("User has been deleted");
    } catch (error) {
        next(error)
    }
}

export const getUserListings = async (req, res, next) => {
    // check token
    if(req.user.id === req.params.id) {
        try {
            const listings = await Listing.find({ userRef: req.params.id });
            res.status(200).json(listings);
        } catch (error) {
            next(error)
        }
    } else {
        return next(errorHandler(401, "You can only view your own listings"));
    }
}