require('../../common/helpers/strings');

describe( 'url helper tests', () => {

  var tests = [
    {
      t: '',
      length: 0
    },
    {
      t: 'hola',
      length: 0
    },
    {
      t: 'terra.es',
      length: 0
    },
    {
      t: 'http://terra.es',
      length: 1
    },
    {
      t: 'https://freear.org.uk/content/oembed-isnt-dead-heres-ou-embed',
      length: 1
    },
    {
      t: 'hola https://freear.org.uk/content/oembed-isnt-dead-heres-ou-embed',
      length: 1
    },
    {
      t: 'T%Y&JEYTFGBDS> http://terra.es <>DASVTWESGRDvs https://freear.org.uk/content/oembed-isnt-dead-heres-ou-embed',
      length: 2
    },
    {
      t: 'http://terra.es erra. tp:// http://terra.e erra.e erra.eerra.e  http:// s',
      length: 2
    }
  ];

  var i = 1;
  tests.forEach( function(t) {

    it( 'Url number ' + i, () => {
      var result = getUrls(t.t);
      assert.typeOf( result, 'array' );
      assert.lengthOf( result, t.length );
    });
    i++;

  } );


});
