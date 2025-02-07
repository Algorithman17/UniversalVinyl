// En tant qu'utilisateur je peut:
//  Consulter les annonces
//  Consulter les commentaires
//  Consulter les utilisateurs
//  Ajouter des commentaires
//  Ajouter des annonces
//  Modifier mes commentaires
//  Modifier mes annonces
//  Supprimer mes commentaires
//  Supprimer mes annonces
//  Supprimer mon compte
//  Modifier mon compte
//  Consulter mon compte
//  Consulter mes annonces
//  Consulter mes commentaires
//  Consulter mes favoris
//  Ajouter des annonces à mes favoris
//  Supprimer des annonces de mes favoris
//  Consulter les annonces de mes favoris

const { CommentModel, UserModel, AnnonceModel } = require('../models');

const UserService = {
    getAnnonces: async () => {
        try {
            const annonces = await AnnonceModel.find();
            return annonces;
        } catch (error) {
            throw error;
        }
    },
    getComments: async () => {
        try {
            const comments = await CommentModel.find();
            return comments;
        } catch (error) {
            throw error;
        }
    },
    getUsers: async () => {
        try {
            const users = await UserModel.find();
            return users;
        } catch (error) {
            throw error;
        }
    },
    addComment: async (comment) => {
        try {
            const newComment = await CommentModel.create(comment);
            return newComment;
        } catch (error) {
            throw error;
        }
    },
    addAnnonce: async (annonce) => {
        try {
            const newAnnonce = await AnnonceModel.create(annonce);
            return newAnnonce;
        } catch (error) {
            throw error;
        }
    },
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
            const annonces = await AnnonceModel.find({ user: userId });
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