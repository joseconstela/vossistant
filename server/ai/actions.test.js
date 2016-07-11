require('./actions')

describe( 'actions tests', () => {
  it( 'dilbert', () => {
    let result = actions['dilbert']()
    assert.typeOf( result.d, 'object' )
    assert.typeOf( result.d.t, 'string' )
    assert.typeOf( result.d.l, 'string' )
    assert.typeOf( result.d.h, 'string' )
  })

})
