const  Comment = require('../models/Comment');

const addComment = async ( input,  context ) => {
    
    try {
        const comment = new Comment({
            idPublication: input.idPublication,
            idUser: context.user.id,
            comment: input.comment
        });

        comment.save();
        return comment;

    } catch (error) {
        console.log(error);
    }
};



const getComment = async ( idPublication ) => {
    
    console.log(idPublication);
    const result = await Comment.find({ idPublication })
                            .populate('idUser');
    return result;
};

module.exports = {
    addComment,
    getComment,
}