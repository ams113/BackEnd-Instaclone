const  Publication = require('../models/Publication');
const  Follow = require('../models/Follow');
const awsUploadImage = require('../utils/aws-upload-image');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

const publish = async ( file, context ) => {
   


    const { id, userName } = context.user;
    const { createReadStream, mimetype } = await file;
    
    const extension = mimetype.split('/')[1];
    const filePath = `publication/${userName}-${ uuidv4() }.${ extension }`;
    const fileData = createReadStream();

    try {
        
        const result = await awsUploadImage( fileData, filePath );
        
        const publication = new Publication( {
            idUser: id,
            file: result,
            typeFile: mimetype.split('/')[0],
            createAt: Date.now()
        });

        publication.save();

        return {
            status: true,
            urlFile: result
        };

    } catch (error) {
        console.log(error);
        return {
            status: false,
            urlFile: ""
        };
    }
    
};

const getPublications = async ( userName ) => {

 

    const user = await User.findOne( { userName } );

    
    if( !user ) throw new Error("Usuario no encontrado");

    const publications = await Publication.find()
        .where( { idUser: user._id } )
        .sort( {createAt: -1 } );

    return publications;
};

const getPublicationsFolloweds = async ( context ) => {

    const followeds = await Follow.find( { idUser: context.user.id } )
                            .populate('follow');

    const followedsList = [];
    const publicationList = [];

    for await ( const data of followeds ) {
        followedsList.push( data.follow );
    }

    for await ( const data of followedsList ) {
       const publications = await Publication.find().where({
            idUser: data._id
       })
       .sort( { createAt: -1 } )
       .populate( 'idUser' );

       publicationList.push(...publications);
    }

    const result = publicationList.sort( ( a, b ) => {
        return new Date( b.createAt ) - new Date( a.createAt );
    });

    return result;
};

module.exports = {
    publish,
    getPublications,
    getPublicationsFolloweds
};