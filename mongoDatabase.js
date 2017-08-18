const mongoClient = require( 'mongodb' ).MongoClient;
const mongoURL = 'mongodb://localhost:27017/galleryMeta';
let photoMetas = null;

mongoClient.connect( mongoURL, function( err, db ) {
  console.log( 'connected to mongoDB' );
  photoMetas = db.collection( 'photoMetas' );
} );

module.exports = {
  photoMetas: () => photoMetas
};
