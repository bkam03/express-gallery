const express = require( 'express' );
const Passport = require( 'passport' );
const bcrypt = require( 'bcrypt' );

const db = require( '../models' );

const { User } = db;
const Gallery = db.gallery;

const SaltRound = 10;

const router = express.Router();

function userAuthenticated( req, res, next ){
  if( req.isAuthenticated() ){
    console.log( 'user is authenticated' );
    next();
  } else {
    console.log( 'user fails authentication' );
    res.redirect( '/login' );
  }
}

router.get( '/gallery/new', ( req, res ) => {
  res.render( './newPhoto' );
} );

router.get( '/gallery/:id/edit', userAuthenticated, ( req, res ) => {
  Gallery.findById( parseInt( req.params.id ) )
    .then( ( photo ) => {
      let values = photo.dataValues;
      let resObject = {
        id: values.id,
        link: values.link,
        author: values.author,      };
      res.render( '../views/edit', resObject );

    } )
    .catch( ( err ) => {
      console.log( err );
    } );
} );


router.route( '/gallery/:id' )
  .get( ( req, res ) => {
    Gallery.findById( parseInt( req.params.id ) )
      .then( ( photo ) => {
        let values = photo.dataValues;
        let resObject = {
          id: values.id,
          link: values.link,
          author: values.author,
          description: values.description
        };
        res.render( 'photoView', resObject );
      } )
      .catch( (err) => {
        console.log( err );
        //maybe do something if id not found.
      });
  } )
  .put( userAuthenticated, ( req, res ) => {
    let request = req.body;
    Gallery.update( {
      author: request.author,
      link: request.link,
      description: request.description
    }, {
      where: {
        id: req.params.id
      }
    } )
      .then( ( photo ) => {
        res.redirect( 200, `./${ req.params.id }` );
      } )
      .catch( ( err ) => {
        console.log( photo );
        res.redirect( 400, `./${ req.params.id }` );
      } );

  } )
  .delete( userAuthenticated, ( req, res ) => {
    Gallery.destroy( {
      where: {
        id: req.params.id
      }
    } )
      .then( ( photoId ) => {
        console.log( `photo ${ photoId } deleted` );
        res.redirect( 200, '/' );
      } )
      .catch( ( err ) => {
        console.log( err );
      } );
  } );




router.post( '/gallery', ( req, res ) => {
    Gallery.create( {
        author: req.body.author,
        link: req.body.link,
        description: req.body.description
    } )
    .then( ( data ) => {
      console.log( 'created new photo' );
      res.redirect( 200, `./${ data.id }` );
    } )
    .catch( ( err ) => {
      console.log( err );
      res.redirect( 400, './' );
    } );
  } );

router.get( '/login', ( req, res ) => {
    res.render( 'login' );
  } );


router.post( '/login', Passport.authenticate( 'local', {
  successRedirect: '/',
  failureRedirect: '/login'
} ) );


router.get( '/register', ( req, res ) => {
    res.render( 'register' );
  } );


router.post( '/register', ( req, res ) => {
  console.log( 'posting register' );
  console.log( req.body.username );
  console.log( req.body.password );

  bcrypt.genSalt( SaltRound )
    .then( ( salt ) => {
      console.log( 'salt', salt );
      bcrypt.hash( req.body.password, salt )
        .then( hash => {
          console.log( 'hash', hash );
          User.create( {
            username: req.body.username,
            password: hash
          } )
            .then( () => {
              console.log( 'created new user' );
              res.redirect( 200, './' );
            } )
            .catch( ( err ) => {
              console.log( err );
            } );


        } )
        .catch( ( err ) => {
          console.log( err );
        } );
    } )
    .catch( ( err ) => {
      console.log( err );
    } );


  /*User.findOne( {  //later check if username being registered already exists
    where: {
      username: req.body.username
    }
  } )
    .then( ( user ) => {
      console.log( 'user@@@@@', user );
  } )
    .catch( ( err ) => {
      console.log( 'user exists' );
      console.log( err );
  } );*/
  //if username in database, redirect to register.
  //else display some sort of received page, and send to gallery.
} );


router.get( '/', ( req, res ) => {
  Gallery.findAll({
    order: [
      ['createdAt', 'DESC']
    ]
  })
    .then( ( photos ) => {
      console.log( photos );
      let firstPhoto = photos.shift();
      let galleryObj = {
        frontPhoto: firstPhoto,
        photos: photos
      };
      res.render( 'galleryPage', galleryObj );
    } )
    .catch( ( err ) => {
      console.log( err );
    } );
  } );


module.exports = router;


/*
new
edit
login
register

logout - use req.logout() in passport docs
specific delete/edit auth.  match postedBy?  add this to image data on upload.
at register, check if username already exists
*/