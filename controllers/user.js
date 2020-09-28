const  User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const awsUploadImage = require('../utils/aws-upload-image');



const createToken = ( user, SECRET_KEY, expiresIn ) => {
    
    const { id, name, email, userName } = user;

    

    const payload = {
        id,
        name,
        email,
        userName
    };

    return jwt.sign( payload, SECRET_KEY, { expiresIn } );


}


 const register =  async ( input ) => {

    const newUser = input;

    newUser.email = newUser.email.toLowerCase();
    newUser.userName = newUser.userName.toLowerCase();
    
    const { email, userName, password } = newUser;

    // Revisar si el email esta en uso
    const foundEmail = await User.findOne( { email } );
    
    if ( foundEmail ) {
        throw new Error('El email ya esta en uso');
    }

    // Revisar si el userName esta en uso
    const foundUserName = await User.findOne( { userName } );
    
    if ( foundUserName ) {
        throw new Error('El nombre de usuario ya esta en uso');
    }

    // Encriptar.
    const salt = await bcryptjs.genSaltSync( 10 );
    newUser.password = await bcryptjs.hash( password, salt );

    // Guardar en MongoDB
    try {
        
        const user = new User(newUser);
        user.save();

        return user;

        
    } catch (error) {
        console.error(error);
    }
};

const login =  async ( input ) => {

    console.log(input);
    const { email, password } = input;

    const userFound = await User.findOne( { email: email.toLowerCase() } );

    if ( !userFound ) {
        throw new Error('Error en el email o password');
    }

    const passwordSuccess = await bcryptjs.compare( password, userFound.password );

    if ( !passwordSuccess ) {
        throw new Error('Error en el email o password');
    }

    return {
        token: createToken( userFound, process.env.SECRET_KEY, '24h' )
    };

  
};

const getUser = async ( id, userName ) => {

    let user = null;

    if ( id ) user = await User.findById(id);

    if ( userName ) user = await User.findOne( { userName });

    if ( !user ) throw new Error( 'El usuario no existe ');
    
    return user;
};

const updateAvatar = async ( file, context ) => {
    
    const { id, userName } = context.user;
    
    const { createReadStream, mimetype } = await file;
    const extension = mimetype.split('/')[1]; 
    const imagePath = `avatar/${userName}-${ id }.${ extension }`;
    const fileData = createReadStream();
 

    try {
        
        const result = await awsUploadImage( fileData, imagePath );

        await User.findByIdAndUpdate( id, { avatar: result });
        
        return {
            status: true,
            urlAvatar: result
        };

    } catch (error) {
        return {
            status: false,
            urlAvatar: null
        };
    }
        
    
};
  
const deleteAvatar = async ( context ) => {

    const { id } = context.user;
    console.log(id);
    try {
        
        await User.findByIdAndUpdate( id, { avatar: '' });
        return true;

    } catch (error) {
        console.log(error);
        return false;
    }

};

const updateUser = async ( input,  context ) => {
    console.log('updateUser');
    console.log('------------------------------');
    console.log(context);
    console.log('------------------------------');
    const { id } = context.user;
    console.log(id);

    try {
        
        if ( input.currentPassword && input.newPassword ) {
            
            const userFound = await User.findById(id);
            const passSuccess = await bcryptjs.compare( input.currentPassword, userFound.password );

            console.log(passSuccess);

            if ( !passSuccess ) throw new Error('Contraseña incorecta');

            const salt = await bcryptjs.genSaltSync(10);
            const newPassCrypt = await bcryptjs.hash( input.newPassword, salt );

            await User.findByIdAndUpdate( id, { password: newPassCrypt });

        } else {
            await User.findByIdAndUpdate( id, input);
        }

        return true;

    } catch (error) {
        console.log(error);
        return false;
    }
}

const search = async ( search ) => {

    const users = await User.find({
        name: { $regex: search, $options: 'i' },
    })

    return users;
}


module.exports = {
    register,
    login, 
    getUser,
    updateAvatar,
    deleteAvatar,
    updateUser,
    search,
}