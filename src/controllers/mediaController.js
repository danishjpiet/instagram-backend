const InstagramUser = require('../models/InstagramUser');
const { getUserMedia } = require('../services/instagramService');

const fetchUserMedia = async (req, res, next) => {
    try {
        const _id = req.userId;
        //find this user in the database
        const instagramUser = await InstagramUser.findById(_id);
        if (!instagramUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const media = await getUserMedia(instagramUser.instagramAccessToken);
        return res.status(200).json(media);
    } catch (error) {
        console.error("error:",error.message);
        next(error)
    }
};

module.exports = {
    fetchUserMedia
};