const express = require( 'express' );
const router = express.Router();

const db = require( '../models' );
const Gallery = db.gallery;

/*


GET /gallery/new to see a "new photo" form
the form fields are:
author : Text
link : Text (the image url)
description : TextArea

GET /gallery/:id/edit to see a form to edit a gallery photo identified by the :id param
the form fields are:
author : Text
link : Text (the image url)
description : TextArea


DELETE /gallery/:id to delete a single gallery photo identified by the :id param
*/


router.get( '/gallery/:id/edit', ( req, res ) => {
  console.log( 'get for gallery/id/edit' );
} );


router.route( '/gallery/:id' )
  .get( ( req, res ) => {
    console.log( 'get for gallery/id' );
    Gallery.findById( parseInt( req.params.id ) )
      .then( ( photo ) => {
        console.log( photo );
        res.end();
/*
each gallery photo should include a link to delete this gallery photo
each gallery photo should include a link to edit this gallery photo
*/
      } );
  } )
  .put( ( req, res ) => {
    console.log( 'put for gallery/id' );
    Gallery.findById( parseInt( req.params.id ) )
      .then( ( photo ) => {
        console.log( photo );
        res.end();
//PUT /gallery/:id updates a single gallery photo identified by the :id param
      } )
      .catch( ( err ) => {
        console.log( photo );
      } );

  } )
  .delete( ( req, res ) => {
    console.log( 'delete for gallery/id' );
  } );

router.get( '/gallery/new', ( req, res ) => {
  console.log( 'get for gallery/new' );
} );

router.post( '/gallery', ( req, res ) => {
  Gallery.create( {
    author: req.body.author,
    link: req.body.link,
    description: req.body.description
  } )
  .then( ( data ) => {
    console.log( data );
    console.log( 'created new photo' );
    res.end();
    //REDIRECT TO NEW PHOTO PAGE
  } )
  .catch( ( err ) => {
    console.log( err );
  } );
  console.log( 'post for gallery/' );
} );

router.get( '/', ( req, res ) => {
  Gallery.findAll()
    .then( ( photos ) => {
      photos.forEach( function( photo ) {
        console.log( photo.author );
      } );
      //THIS NEEDS TO RENDER AS LIST OF GALLERY PHOTOS
    } )
    .catch( ( err ) => {
      console.log( err );
    } );
  console.log( 'get for /' );
  res.end();
} );


module.exports = router;