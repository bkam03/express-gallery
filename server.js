const express = require( 'express' );
const exphbs = require( 'express-handlebars' );
const bp = require( 'body-parser' );
const methodOverride = require( 'method-override' );
const Passport = require( 'passport' );
const session = require( 'express-session' );
const RedisStore = require('connect-redis')(session);
const LocalStrategy = require( 'passport-local' ).Strategy;
const bcrypt = require( 'bcrypt' );

const Config = require('./config/config.json');
const db = require( './models' );
const galleryRoute = require( './routes/gallery.js' );

const { User } = db;
const PORT = process.env.PORT || 3000;




//const Gallery = db.gallery;

const app = express();

const hbs = exphbs.create( {
  defaultLayout : 'main',
  extname : 'hbs'
});
app.engine( 'hbs', hbs.engine );
app.set( 'view engine', 'hbs' );

app.use(express.static('public'));

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
  secret: Config.SESSION_SECRET,
  store: new RedisStore(),
  cookie: {
    maxAge: 604800000
  },
  saveUninitialized: true
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
    bcrypt.compare( password, user.password )
      .then( ( result ) => {
        console.log( 'compare result', result );
        if( result ){
          console.log( 'authenticated' );
          return done( null, user );
        } else {
          console.log( 'password does not match' );
          return done( null, false, { message: 'incorrect password' });
        }
      } )
      .catch( ( err ) => {
        console.log( 'compare error', err );
      } );
  } )
  .catch( (err) => {
    console.log( 'username search error', err );
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



app.use( '/', galleryRoute );

const server = app.listen( PORT, () => {
  db.sequelize.sync();
  console.log( `server running on ${ PORT }` );
} );