require('./ai');
buildIntelligence(true);

describe( 'ai tests', () => {
  it( 'm', () => {
    let result = textRequest('m', 'es');
    assert.typeOf( result, 'Object' );
    assert.typeOf( result.c, 'date' );
  });
  it( 'Qué hora es', () => {
    let result = textRequest('Qué hora es', 'es');
    assert.equal( result.i, 'know-date-time' );
    assert.typeOf( result.d, 'object' );
  });
  it( 'A qué día estamos', () => {
    let result = textRequest('Qué hora es', 'es');
    assert.equal(  result.i, 'know-date-time' );
    assert.typeOf( result.d, 'object' );
  });
  it( 'Buscar fotos de coches en Google', () => {
    let result = textRequest('Buscar fotos de coches en Google', 'es');
    assert.equal( result.i, 'internet-search' );
    assert.typeOf( result.d, 'object' );
    assert.equal( result.d['internet-search-sources'], 'google' );
    assert.equal( result.m, 'fotos de coches' );
  });
  it( 'Buscar hola en Google', () => {
    let result = textRequest('Buscar hola en Google', 'es');
    assert.equal( result.i, 'internet-search' );
    assert.typeOf( result.d, 'object' );
    assert.equal( result.d['internet-search-sources'], 'google' );
    assert.equal( result.m, 'hola' );
  });
  it( 'Buscar Terra Mítica en las imágenes de Google', () => {
    let result = textRequest('Buscar Terra Mítica en las imágenes de Google', 'es');
    assert.equal( result.i, 'internet-search' );
    assert.typeOf( result.d, 'object' );
    assert.equal( result.d['internet-search-sources'], 'google images' );
    assert.equal( result.m, 'Terra Mitica' );
  });
  it( 'Quiero ver una pelicula', () => {
    let result = textRequest('Quiero ver una pelicula', 'es');
    assert.typeOf( result.d, 'object' );
    assert.equal( result.i, 'mmedia-netflix' );
    assert.equal( result.d['mmedia-video-type'], 'film' );
  });
  it( 'Quiero ver Nombre Aleatorio', () => {
    let result = textRequest('Quiero ver Nombre Aleatorio', 'es');
    assert.isUndefined( result.d );
    assert.equal( result.i, 'mmedia-netflix' );
    assert.equal( result.m, 'Nombre Aleatorio' );
  });
  it( 'Quién era la más bella', () => {
    let result = textRequest('Quién era la más bella', 'es');
    assert.isUndefined( result.d );
    assert.equal( result.i, 'wiki' );
    assert.equal( result.m, 'mas bella' );
  });

  it( 'Despiértame dentro de 3 horas', () => {
    let result = textRequest('Despiértame dentro de 3 horas', 'es');
    assert.equal( result.i, 'reminder-wake-up' );
    assert.equal( result.m, '3' );
    assert.typeOf( result.d, 'object' );
    assert.equal( result.d['moment-period'], 'h' );
  });
  it( 'Despiértame a la 1 de la mañana', () => {
    let result = textRequest('Despiértame a la 1 de la mañana', 'es');
    assert.equal( result.i, 'reminder-wake-up' );
    assert.equal( result.m, '1' );
    assert.typeOf( result.d, 'object' );
    assert.equal( result.d['day-period'], 'morning' );
  });
  it( 'Despiértame a las 7 de la mañana', () => {
    let result = textRequest('Despiértame a las 7 de la mañana', 'es');
    assert.equal( result.i, 'reminder-wake-up' );
    assert.equal( result.m, '7' );
    assert.typeOf( result.d, 'object' );
    assert.equal( result.d['day-period'], 'morning' );
  });
  it( 'Despiértame a las 8:30 de la mañana', () => {
    let result = textRequest('Despiértame a las 8:30 de la mañana', 'es');
    assert.equal( result.i, 'reminder-wake-up' );
    assert.equal( result.m, '8:30' );
    assert.typeOf( result.d, 'object' );
    assert.equal( result.d['day-period'], 'morning' );
  });
  it( 'Despiértame a las 12:30', () => {
    let result = textRequest('Despiértame a las 12:30', 'es');
    assert.equal( result.i, 'reminder-wake-up' );
    assert.equal( result.m, '12:30' );
  });
  it( 'Despiértame a las 7 pm', () => {
    let result = textRequest('Despiértame a las 7 pm', 'es');
    assert.equal( result.i, 'reminder-wake-up' );
    assert.equal( result.m, '7' );
    assert.typeOf( result.d, 'object' );
    assert.equal( result.d['time-period'], 'pm' );
  });
});
