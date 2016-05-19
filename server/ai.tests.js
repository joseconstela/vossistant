require('./ai');

describe( 'ai tests', () => {
   it( 'Qué hora es', () => {
     var textResult = textRequest('Qué hora es');
     assert.typeOf( textResult, 'object' );
   });
});
