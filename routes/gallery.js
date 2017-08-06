const express = require( 'express' );
const router = express.Router();


/*
GET / to view a list of gallery photos

GET /gallery/:id to see a single gallery photo
each gallery photo should include a link to delete this gallery photo
each gallery photo should include a link to edit this gallery photo

GET /gallery/new to see a "new photo" form
the form fields are:
author : Text
link : Text (the image url)
description : TextArea

POST /gallery to create a new gallery photo i

GET /gallery/:id/edit to see a form to edit a gallery photo identified by the :id param
the form fields are:
author : Text
link : Text (the image url)
description : TextArea

PUT /gallery/:id updates a single gallery photo identified by the :id param

DELETE /gallery/:id to delete a single gallery photo identified by the :id param
*/

/*
/gallery/:id/edit   get

/gallery/:id        get
                    put
                    delete

/gallery/new        get

/gallery            post

/                   get

*/

router.get( '/gallery/:id/edit', ( req, res ) => {
  console.log( 'get for gallery/id/edit' );
} );


router.route( '/gallery/:id' )
  .get( ( req, res ) => {
    console.log( 'get for gallery/id' );
  } )
  .put( ( req, res ) => {
    console.log( 'put for gallery/id' );
  } )
  .delete( ( req, res ) => {
    console.log( 'delete for gallery/id' );
  } );

router.get( '/gallery/new', ( req, res ) => {
  console.log( 'get for gallery/new' );
} );

router.get( '/', ( req, res ) => {
  console.log( 'get for /' );
} );


module.exports = router;