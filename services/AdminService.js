// En tant qu'admin je peut:

// Supprimer les commentaires

// Supprimer les annonces

// Supprimer les utilisateurs


const { CommentModel, UserModel, AnnonceModel } = require('../models');

const AdminService = {
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
    deleteUser: async (userId) => {
        try {
        const user = await UserModel.findByIdAndDelete(userId);
        return user;
        } catch (error) {
            throw error;
        }
    }
};
