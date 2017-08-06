const express = require( 'express' );
const exphbs = require( 'express-handlebars' );
const bp = require( 'body-parser' );

const db = require( './models' );
const galleryRoute = require( './routes/gallery.js' );

const PORT = process.env.PORT || 3000;
const Gallery = db.gallery;

const app = express();

const hbs = exphbs.create( {
  defaultLayout : 'main',
  extname : 'hbs'
});



app.use( bp.urlencoded() );
app.use( '/', galleryRoute );




const server = app.listen( PORT, () => {
  db.sequelize.sync();
  console.log( `server running on ${ PORT }` );
} );