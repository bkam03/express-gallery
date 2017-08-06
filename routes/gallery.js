const express = require( 'express' );
const router = express.Router();

const db = require( '../models' );
const Gallery = db.gallery;


router.get( '/gallery/new', ( req, res ) => {
  console.log( 'get for gallery/new' );
  res.render( './newPhoto' );
} );

router.get( '/gallery/:id/edit', ( req, res ) => {
  console.log( 'get for gallery/id/edit' );
  Gallery.findById( parseInt( req.params.id ) )
    .then( ( photo ) => {
      let values = photo.dataValues;
      let resObject = {
        id: values.id,
        link: values.link,
        author: values.author,      };
      console.log( values );
      res.render( '../views/edit', resObject );

    } )
    .catch( ( err ) => {
      console.log( err );
    } );
} );


router.route( '/gallery/:id' )
  .get( ( req, res ) => {
    console.log( 'get for gallery/id' );
    Gallery.findById( parseInt( req.params.id ) )
      .then( ( photo ) => {
        console.log( photo );
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
    console.log( 'put for gallery/id' );
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
        console.log( photo );
        res.redirect( 200, `./${ req.params.id }` );
      } )
      .catch( ( err ) => {
        console.log( photo );
        res.redirect( 400, `./${ req.params.id }` );
      } );

  } )
  .delete( ( req, res ) => {
    console.log( 'delete for gallery/id' );
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




router.route( '/gallery' )
  .post( ( req, res ) => {
    Gallery.create( {
        author: req.body.author,
        link: req.body.link,
        description: req.body.description
    } )
    .then( ( data ) => {
      console.log( data );
      console.log( 'created new photo' );
      res.redirect( 200, `./${ data.id }` );
    } )
    .catch( ( err ) => {
      console.log( err );
      res.redirect( 400, './' );
    } );
  } )
  .get( ( req, res ) => {
    Gallery.findAll()
      .then( ( photos ) => {
        res.render( 'galleryPage', {photos} );
//This hangs for some reason
      } )
      .catch( ( err ) => {
        console.log( err );
      } );
    } );


module.exports = router;