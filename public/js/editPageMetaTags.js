let deleteButtonArray = document.getElementsByClassName( 'deleteButton' );

console.log( deleteButtonArray );

/*deleteButtonArray.forEach( ( button ) => {
  button.addEventListener( 'click', ()=> {
    console.log( 'pressed' );
  });
} );
*/

for( var i = 0; i < deleteButtonArray.length; i++ ) {
  deleteButtonArray[ i ].addEventListener( 'click', ( event )=> {
    let childElement = event.target.parentElement;
    let parentElement = document.querySelector( '#meta_fields' );
    console.log( childElement );
    console.log( parentElement );
    parentElement.removeChild(childElement);
  });
}