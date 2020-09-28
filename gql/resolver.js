const userController = require('../controllers/user');
const followController = require('../controllers/follow');
const publicationController = require('../controllers/publication');
const commentController = require('../controllers/comment');
const likeController = require('../controllers/like');


const  resolvers = {

    Query: {
        // User
        getUser: (_, {id, userName} ) => userController.getUser( id, userName ),
        search: ( _, { search }) => userController.search( search ),

        // Follow
        isFollow: ( _, { userName }, context ) => followController.isFollow( userName, context ),
        getFollowers: ( _, { userName } ) => followController.getFollow( userName ),
        getFolloweds: ( _, { userName } ) => followController.getFolloweds( userName ),
        getNotFolloweds: ( _, { }, context ) => followController.getNotFolloweds( context ),

        // Publication
        getPublications: ( _, { userName } ) => publicationController.getPublications( userName ),
        getPublicationsFolloweds: ( _, {}, context ) => publicationController.getPublicationsFolloweds( context ),


        // Comment 
        getComment: ( _, { idPublication } ) => commentController.getComment( idPublication ),

        // Like
        isLike: ( _, { idPublication }, context ) => likeController.isLike( idPublication, context ),
        countLike: ( _, { idPublication }) => likeController.countLike( idPublication ),

    },
    Mutation: {
        // User
        register: ( _, { input } ) => userController.register( input ),
        login: ( _, { input } ) => userController.login( input ),
        updateAvatar: ( _, { file}, context ) => userController.updateAvatar( file, context ),
        deleteAvatar: ( _, {}, context ) => userController.deleteAvatar( context ),
        updateUser: ( _, { input }, context ) => userController.updateUser( input,  context ),

        // Follow
        follow: ( _, { userName }, context ) => followController.follow( userName, context ),
        unFollow: ( _, { userName }, context ) => followController.unFollow( userName, context ),

        // Publication
        publish: (_, { file }, context) => publicationController.publish( file, context ),

        // Comment 
        addComment: ( _, { input }, context ) => commentController.addComment( input,  context ),

        // Like
        addLike: ( _, { idPublication }, context ) => likeController.addLike( idPublication,  context ),
        deleteLike: ( _, { idPublication }, context ) => likeController.deleteLike( idPublication,  context ),

    },
};

module.exports = resolvers;