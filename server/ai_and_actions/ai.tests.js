require('./ai');

describe( 'ai tests', () => {
  it( 'm', () => {
    var textResult = textRequest('m');
    assert.typeOf( textResult, 'null' );
  });
  it( 'Qué hora es', () => {
    var textResult = textRequest('Qué hora es');
    assert.typeOf( textResult, 'object' );
    assert.equal( textResult.intention, 'know-date-time' );
    assert.typeOf( textResult.data, 'object' );
  });
  it( 'A qué día estamos', () => {
    var textResult = textRequest('Qué hora es');
    assert.typeOf( textResult, 'object' );
    assert.equal( textResult.intention, 'know-date-time' );
    assert.typeOf( textResult.data, 'object' );
  });
  it( 'Buscar fotos de coches en Google', () => {
    var textResult = textRequest('Buscar fotos de coches en Google');
    assert.typeOf( textResult, 'object' );
    assert.equal( textResult.intention, 'internet-search' );
    assert.typeOf( textResult.data, 'object' );
    assert.equal( textResult.data['internet-search-sources'], 'google' );
    assert.equal( textResult.match, 'fotos de coches' );
  });
  it( 'Quiero ver una pelicula', () => {
    var textResult = textRequest('Quiero ver una pelicula');
    assert.typeOf( textResult, 'object' );
    assert.typeOf( textResult.data, 'object' );
    assert.equal( textResult.intention, 'mmedia-netflix' );
    assert.equal( textResult.data['mmedia-video-type'], 'film' );
  });
  it( 'Quiero ver Nombre Aleatorio', () => {
    var textResult = textRequest('Quiero ver Nombre Aleatorio');
    assert.typeOf( textResult, 'object' );
    assert.isUndefined( textResult.data );
    assert.equal( textResult.intention, 'mmedia-netflix' );
    assert.equal( textResult.match, 'Nombre Aleatorio' );
  });
});
