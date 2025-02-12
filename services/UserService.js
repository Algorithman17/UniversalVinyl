// En tant qu'utilisateur je peut:
//  Consulter mes annonces
//  Ajouter des annonces
//  Modifier mes annonces
//  Supprimer mes annonces
//  Supprimer mon compte
//  Modifier mon compte

cookie("theme", "#008080", {httpOnly:true, maxAge:10000000000})

const { CommentModel, UserModel, AnnonceModel } = require('../models');

const UserService = {
    // 
    addComment: async (comment) => {
        try {
            const newComment = await CommentModel.create(comment);
            return newComment;
        } catch (error) {
            throw error;
        }
    },
    // Dans la page myComments.ejs
    updateComment: async (commentId, comment) => {
        try {
            const updatedComment = await CommentModel.findByIdAndUpdate(commentId, comment, { new: true });
            return updatedComment;
        } catch (error) {
            throw error;
        }
    },
    updateAnnonce: async (annonceId, annonce) => {
        try {
            const updatedAnnonce = await AnnonceModel.findByIdAndUpdate(annonceId, annonce, { new: true });
            return updatedAnnonce;
        } catch (error) {
            throw error;
        }
    },
    deleteComment: async (commentId) => {
        try {
            const comment = await CommentModel.findByIdAndDelete(commentId);
            return comment;
        } catch (error) {
            throw error;
        }
    },
    deleteAnnonce: async (annonceId) => {
        try {
            const annonce = await AnnonceModel.findByIdAndDelete(annonceId);
            return annonce;
        } catch (error) {
            throw error;
        }
    },
    deleteMyComment: async (commentId) => {
        try {
            const comment = await CommentModel.findByIdAndDelete(commentId);
            return comment;
        } catch (error) {
            throw error;
        }
    },
    deleteMyAnnonce: async (annonceId) => {
        try {
            const annonce = await AnnonceModel.findByIdAndDelete(annonceId);
            return annonce;
        } catch (error) {
            throw error;
        }
    },
    deleteMyAccount: async (userId) => {
        try {
            const user = await UserModel.findByIdAndDelete(userId);
            return user;
        } catch (error) {
            throw error;
        }
    },
    updateMyAccount: async (userId, user) => {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(userId, user, { new: true });
            return updatedUser;
        } catch (error) {
            throw error;
        }
    },
    getMyAccount: async (userId) => {
        try {
            const user = await UserModel.findById(userId);
            return user;
        } catch (error) {
            throw error;
        }
    },
    getMyAnnonces: async (userId) => {
        try {
            const annonces = await AnnonceModel.find({ user: req.session.user._id });
            return annonces;
        } catch (error) {
            throw error;
        }
    },
    getMyComments: async (userId) => {
        try {
            const comments = await CommentModel.find({ user: userId });
            return comments;
        } catch (error) {
            throw error;
        }
    },
    getMyFavorites: async (userId) => {
        try {
            const user = await UserModel.findById(userId).populate('favorites');
            return user.favorites;
        } catch (error) {
            throw error;
        }
    },
    addFavorite: async (userId, annonceId) => {
        try {
            const user = await UserModel.findById(userId);
            user.favorites.push(annonceId);
            await user.save();
            return user;
        } catch (error) {
            throw error;
        }
    },
    removeFavorite: async (userId, annonceId) => {
        try {
            const user = await UserModel.findById(userId);
            user.favorites = user.favorites.filter(favorite => favorite.toString() !== annonceId);
            await user.save();
            return user;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = UserService;