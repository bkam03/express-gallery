const express = require( 'express' );
const router = express.Router();

const db = require( '../models' );
const Gallery = db.gallery;


function userAuthenticated( req, res, next ){
  if( req.isAuthenticated() ){
    console.log( 'user is authenticated' );
  } else {
    console.log( 'user fails authentication' );
    res.redirect( '/' );
  }
}

router.get( '/gallery/new', ( req, res ) => {
  res.render( './newPhoto' );
} );

router.get( '/gallery/:id/edit', ( req, res ) => {
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
      } );
  } )
  .put( ( req, res ) => {
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
  .delete( ( req, res ) => {
    Gallery.destroy( {
      where: {
        id: req.params.id
      }
    } )
      .then( ( photoId ) => {
        console.log( `photo ${ photoId } deleted` );
        res.redirect( 200, './' );
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

  router.get( '/', ( req, res ) => {
    Gallery.findAll()
      .then( ( photos ) => {
        console.log( photos );
        res.render( 'galleryPage', {photos} );
//This hangs for some reason
      } )
      .catch( ( err ) => {
        console.log( err );
      } );
    } );


module.exports = router;