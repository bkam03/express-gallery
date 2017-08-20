const express = require( 'express' );
const Passport = require( 'passport' );
const bcrypt = require( 'bcrypt' );
const { photoMetas } = require( '../collections/mongoDatabase.js');

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

function objectToArray( object ){
  let array = [];
  for( var key in object ){
    let keyValuePair = {
      key: key,
       value: object[key]
    };
    array.push( keyValuePair );
  }
  return array;
}

router.get( '/gallery/new', ( req, res ) => {
  res.render( './newPhoto' );
} );

router.get( '/gallery/:id/edit', userAuthenticated, ( req, res ) => {
  let photoId = req.params.id;
  Gallery.findById( parseInt( photoId ) )
  .then( ( photo ) => {

    let metaTagArray = null;
    photoMetas().findOne({"photoId": photoId})
      .then( meta => {
        if( meta !== null ) {
          metaTagArray = objectToArray( meta.metaTags );
        }
        let values = photo.dataValues;
        let resObject = {
          id: values.id,
          link: values.link,
          author: values.author,
          description: values.description,
          metaTags: metaTagArray
        };
        res.render( '../views/edit', resObject );
      })
    .catch( err => {
      console.log( 'metaTag get error', err );
    } );
  } )
  .catch( ( err ) => {
    console.log( err );
  } );
} );

router.route( '/gallery/:id' )
  .get( ( req, res ) => {
    let photoId = req.params.id;
    Gallery.findById( parseInt( photoId ) )
      .then( ( photo ) => {
        let metaTagArray = null;
        photoMetas().findOne({"photoId": photoId})
          .then( meta => {
            if( meta !== null ){
              metaTagArray = objectToArray( meta.metaTags );
            }
            let values = photo.dataValues;
            let resObject = {
              id: values.id,
              link: values.link,
              author: values.author,
              description: values.description,
              metaTags: metaTagArray
            };
            res.render( 'photoView', resObject );
          })
        .catch( err => {
          console.log( 'metaTag get error', err );
        } );
      } )
      .catch( (err) => {
        res.redirect( 404, '/' );
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
        photoMetas().deleteMany( { photoId: req.params.id } )
          .then( () => {
            let photoMetaTags = {
            photoId: req.params.id,
            metaTags: req.body.meta
            };
            photoMetas().insert( photoMetaTags );
          } )
          .catch( (err) => {
            console.log( 'did not delete', err );
          } );


        res.redirect( 200, `./${ req.params.id }` );
      } )
      .catch( ( err ) => {
        console.log( "@@error", err );
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
        photoMetas().deleteMany( { photoId: req.params.id } )
          .then( () => {
            console.log( "deleted" );

            res.redirect( 200, '/' );

        } )
        .catch( (err) => {
          console.log( 'did not delete', err );
        } );
      } )
      .catch( ( err ) => {
        console.log( err );
      } );
  } );


router.post( '/gallery', ( req, res ) => {
    Gallery.create( {
        author: req.body.author,
        link: req.body.link,
        description: req.body.description,
        postedBy: req.user.id
    } )
    .then( ( data ) => {
      let photoMetaTags = {
        photoId: data.id.toString(),
        metaTags: req.body.meta
      };
      photoMetas().insert( photoMetaTags );
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

  bcrypt.genSalt( SaltRound )
    .then( ( salt ) => {
      bcrypt.hash( req.body.password, salt )
        .then( hash => {
          User.create( {
            username: req.body.username,
            password: hash
          } )
            .then( () => {
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

} );

router.get( '/logout', ( req, res ) => {
  req.logout();
  res.redirect( 200, '/' );
} );


router.get( '/', ( req, res ) => {
  Gallery.findAll({
    order: [
      ['createdAt', 'DESC']
    ]
  })
    .then( ( photos ) => {
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
scss
take off borders later



specific delete/edit auth.  match postedBy?  add this to image data on upload.
at register, check if username already exists
*/