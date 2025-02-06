const Ad = require('../models/AdModel');

class AdService {
    // Create a new ad
    static async createAd(data) {
        const newAd = new Ad(data);
        return await newAd.save();
    }

    // Get all ads
    static async getAllAds() {
        return await Ad.find().populate('user', 'username');
    }

    // Get an ad by ID
    static async getAdById(id) {
        return await Ad.findById(id).populate('user', 'username');
    }

    // Delete an ad
    static async deleteAd(id) {
        return await Ad.findByIdAndDelete(id);
    }
}

module.exports = AdService;