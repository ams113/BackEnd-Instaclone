const Like = require('../models/Like');

const addLike = async ( idPublication , context ) => {

    try {
        const like = new Like({
            idPublication,
            idUser: context.user.id
        });

        like.save();
        return true;
        
    } catch (error) {
        console.log(error);
        return false;
    }
};

const deleteLike = async ( idPublication , context ) => {

    try {
        const resultDelete = await Like.findOneAndDelete( { idPublication } ).where( {
            idUser: context.user.id
        });

        if ( resultDelete ) {
            return true;
        } else {
            return false;
        }

        
        
    } catch (error) {
        console.log(error);
        return false;
    }
};

const isLike = async ( idPublication, context ) => {

    try {
        const result = await Like.findOne( { idPublication } ).where( {
            idUser: context.user.id
        });
    
        if ( !result ) throw new Error('No hay like');
    
        return true;
        
    } catch (error) {
        console.log(error);
        return false;
    }

};
const countLike = async ( idPublication ) => {

    try {
        const result = await Like.countDocuments( { idPublication } );
    
        return result;
        
    } catch (error) {
        console.log(error);
    }

};

module.exports = {
    addLike,
    deleteLike,
    isLike,
    countLike
};