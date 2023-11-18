
import mongoose from "mongoose";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        res.status(201).json(listing);
    } catch (error) {
        next(error)
    }
}

export const deleteListing = async (req, res, next) => {
    // if listing exists or not
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandler(404, "Listing not found"));
    }
    
    // if user is the owner of the listing
    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, "You can only delete your own listings"));
    }
    
    try {
       await Listing.findByIdAndDelete(req.params.id);
       res.status(200).json("Listing has been deleted");
    } catch (error) {
        next(error)
    }
}

export const updateListing = async (req, res, next) => {
    try {
        const listingId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(listingId)) {
            throw errorHandler(400, "Invalid listing ID");
        }

        const listingByUser = await Listing.findById(listingId);
        
        if (req.user.id !== listingByUser.userRef) {
            throw errorHandler(401, "You can only update your own listings");
        }
        
        const updatedListing = await Listing.findByIdAndUpdate(listingId, {
            $set: req.body
        }, { new: true });
        
        res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
}

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return errorHandler(404, "Listing not found");
        }

        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}