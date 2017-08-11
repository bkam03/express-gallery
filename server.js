const express = require( 'express' );
const exphbs = require( 'express-handlebars' );
const bp = require( 'body-parser' );
const methodOverride = require( 'method-override' );

const Passport = require( 'passport' );
const session = require( 'express-session' );
const LocalStrategy = require( 'passport-local' ).Strategy;

const db = require( './models' );
const { User } = db;

const galleryRoute = require( './routes/gallery.js' );

const PORT = process.env.PORT || 3000;
//const Gallery = db.gallery;

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

app.use( session({
  secret: 'thisisasecret'
}));

app.use( Passport.initialize() );
app.use( Passport.session() );

Passport.use( new LocalStrategy( function( username, password, done ) {
  console.log( 'client side username', username );
  console.log( 'clientside password', password );

  User.findOne( {
    where: {
      username: username  //table -- client
    }
  } ).then( ( user ) => {
    console.log( 'user exists i db' );
    if( user.password === password ){
      console.log( 'password matches' );
      return done( null, user );
    } else {
      console.log( 'incorrect password' );
      return done( null, false, {
        message: 'incorrect password'
      } );
    }
  } )
  .catch( (err) => {
    console.log( '@@@@', err );
  });
}));

Passport.serializeUser( function( user, done ){
  console.log( 'serializing the user into session', user.id );
  done( null, user.id );
});

Passport.deserializeUser( function( userId, done ){
  console.log( 'adding user information nto the req object@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', userId );
  User.findOne( {
    where: {
      id: userId
    }
  } ).then( ( user ) => {
    console.log('then');
    return done( null, {
      id: user.id,
      username: user.username
    } );
  } ).catch( ( err ) => {
    console.log( err );
    done( err, user );
  } );
  //done( null, user );
} );


//app.use(express.static('public'));

app.use( '/', galleryRoute );

const server = app.listen( PORT, () => {
  db.sequelize.sync();
  console.log( `server running on ${ PORT }` );
} );