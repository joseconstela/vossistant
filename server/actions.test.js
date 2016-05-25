require('./actions');

describe( 'actions tests', () => {
  it( 'dilbert', () => {
    var actionResult = actions['dilbert']();
    assert.typeOf( actionResult, 'object' );
    assert.typeOf( actionResult.display, 'object' );
    assert.typeOf( actionResult.display.title, 'string' );
    assert.typeOf( actionResult.display.link, 'string' );
    assert.typeOf( actionResult.display.html, 'string' );
  });
});
