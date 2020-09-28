require('dotenv').config( {path: '.env'} );

const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const typeDefs = require('./gql/schema');
const resolvers = require('./gql/resolver');
const jwt= require('jsonwebtoken');

mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true

}, (err, _) => {
    if ( err ) {
        console.log('Error de conexión MongoDB');
    } else {
        console.log('Conexión MongoDB establecida');
        server();
    }
});

const server = () => {

    const serverApollo = new ApolloServer({
        typeDefs,
        resolvers,
        context: ( { req } ) => {
            const token = req.headers.authorization;

            if ( token ) {
                try {

                    const user = jwt.verify(
                        token.replace('Bearer ', ''),
                        process.env.SECRET_KEY
                    );

                    return {
                        user
                    };
                    
                } catch (error) {
                    console.error('#### ERROR ####');
                    console.log(error);
                    throw new Error('Token Invalido');
                }
            }
        }
    });

    serverApollo.listen({ port: process.env.PORT || 4000 })
        .then( ( { url }) => {
            console.log('##########################################');
            console.log('Server Apollo running ' + url);
            console.log('##########################################');
        });
};
