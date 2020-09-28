const  Follow = require('../models/Follow');
const  User = require('../models/User');


const follow = async ( userName, context ) => {
    const userFound = await User.findOne( {userName} );

    if ( !userFound ) throw new Error('El usuario no existe');

    try {
        const follow = new Follow ({
            idUser: context.user.id,
            follow: userFound._id
        });

        follow.save();
        return true;
        
    } catch (error) {
        console.log(error);
        return false;
    }
};

const unFollow = async ( userName, context ) => {
    const userFound = await User.findOne( {userName} );

    if ( !userFound ) throw new Error('El usuario no existe');

    const unFollow = await Follow.deleteOne({ idUser: context.user.id })
                        .where( 'follow' ).equals( userFound._id );
                        

    if ( unFollow.deletedCount > 0 ) {
        return true;
    }

    return false;
};

const isFollow = async ( userName, context ) => {

    const userFound = await User.findOne( {userName} );

    if ( !userFound ) throw new Error('El usuario no existe');

    const follow = await Follow.find({ idUser: context.user.id })
                        .where( 'follow' ).equals( userFound._id );

    if ( follow.length > 0 ) {
        return true;
    }

    return false;
};

const getFollow = async ( userName ) => {

    const userFound = await User.findOne( {userName} );

    if ( !userFound ) {
        throw new Error('El usuario no existe');
    }

    const followers = await Follow.find( { follow: userFound._id } )
                                    .populate( 'idUser' );

    const followersList = [];

    for await ( const data of followers ) {

        followersList.push( data.idUser );
    }


    return followersList;
};
const getFolloweds = async ( userName ) => {

    const userFound = await User.findOne( {userName} );

    if ( !userFound ) {
        throw new Error('El usuario no existe');
    }

    const followeds = await Follow.find( { idUser: userFound._id } )
                                    .populate( 'follow' );

    const followedsList = [];

    for await ( const data of followeds ) {

        followedsList.push( data.follow );
    }


    return followedsList;
};

const getNotFolloweds = async ( context ) => {
    const users = await User.find().limit(50);

    const arrayUsers = [];

    for await ( const user of users ) {
        const isFind = await Follow.findOne({ idUser: context.user.id })
            .where('follow')
            .equals(user._id);

        if ( !isFind ) {
            if ( user._id.toString() !== context.user.id.toString() ) {
                arrayUsers.push( user );
            }
        }
    }
    return arrayUsers;
};

module.exports = {
    follow,
    isFollow,
    unFollow,
    getFollow,
    getFolloweds,
    getNotFolloweds
}