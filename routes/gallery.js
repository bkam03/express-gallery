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
  photoMetas().insert( {c:'c'} );
  res.render( './newPhoto' );
} );

router.get( '/gallery/:id/edit', userAuthenticated, ( req, res ) => {
  let photoId = req.params.id;
  Gallery.findById( parseInt( photoId ) )
  .then( ( photo ) => {
    let values = photo.dataValues;

    let metaTagArray = null;
    photoMetas().findOne({"photoId": photoId})
      .then( meta => {
        if( meta !== null ) {
          metaTagArray = objectToArray( meta.metaTags );
        }
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
        let values = photo.dataValues;

        let metaTagArray = null;
        photoMetas().findOne({"photoId": photoId})
          .then( meta => {
            console.log( 'META', meta);
            if( meta !== null ){
              metaTagArray = objectToArray( meta.metaTags );
            }

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
        console.log( err );
        res.redirect( 404, '/' );
        //maybe do something if id not found.
      });
  } )
  .put( userAuthenticated, ( req, res ) => {
    let request = req.body;
    console.log( "EDITED META TAGS", request );
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
        console.log( "###########",req.body.meta, "#############" );

        photoMetas().deleteMany( { photoId: req.params.id } )
          .then( () => {
            console.log( "deleted" );
            let photoMetaTags = {
            photoId: req.params.id,
            metaTags: req.body.meta
            };
            photoMetas().insert( photoMetaTags );
          } )
          .catch( (err) => {
            console.log( 'did not delete', err );
          } );

/*
        photoMetas().updateOne( { photoId: parseInt(req.params.id) }, { $set : req.body.meta } )*/
         /* .then( () => {
            console.log( 'UPDATE(L) SUCCESS' );
          } )
          .catch( ( err ) => {
            console.log( "error from update", err );
          } );*/


/*        photoMetas.updateOne(
          { photoId: req.params.id },
          {
            $set: req.body.meta
          }
        );*/



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
        console.log( photoId );

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
        description: req.body.description,
        postedBy: req.user.id
    } )
    .then( ( data ) => {
      let photoMetaTags = {
        photoId: data.id.toString(),
        metaTags: req.body.meta
      };
      photoMetas().insert( photoMetaTags );
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
              res.redirect( 200, './' ); //does this go to the right place?
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

add example config file
handle badly rendered photos. ( off center, funny shaped ).
links connecting each function, no url typing
logout - use req.logout() in passport docs
specific delete/edit auth.  match postedBy?  add this to image data on upload.
at register, check if username already exists
if photo id doesnt exist, redirect, maybe display something.
*/