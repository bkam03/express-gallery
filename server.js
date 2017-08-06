const express = require( 'express' );
const exphbs = require( 'express-handlebars' );
const bp = require( 'body-parser' );
const methodOverride = require( 'method-override' );

const db = require( './models' );
const galleryRoute = require( './routes/gallery.js' );

const PORT = process.env.PORT || 3000;
const Gallery = db.gallery;

const app = express();

const hbs = exphbs.create( {
  defaultLayout : 'main',
  extname : 'hbs'
});
app.engine( 'hbs', hbs.engine );
app.set( 'view engine', 'hbs' );


app.use( bp.urlencoded() );
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(methodOverride(function (req, res) {
  if(req.body && typeof req.body === 'object' && '_method' in req.body) {
    // Look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use( '/', galleryRoute );




const server = app.listen( PORT, () => {
  db.sequelize.sync();
  console.log( `server running on ${ PORT }` );
} );