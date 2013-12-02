var Clock = require('./index')
  , test = require('tape')

test('test setter method', function(assert) {
  var d = new Clock('B')

  d.bump('A')
  d.bump('A')

  assert.strictEqual(
      d.get('B')
    , 2
    , 'Local id gets bumped every time (0 indexed)'
  )

  d.bump('B')
  d.bump('A')

  assert.strictEqual(2, d.get('A'))
  assert.strictEqual(4, d.get('B'))
  assert.end()
})

test('creates digest correctly', function(assert) {
  var d = new Clock('C')

  d.clock = {
      'A': 0
    , 'B': 2
    , 'C': 3
    , 'D': 1
  }

  var resultStream = d.createReadStream()

  resultStream.on('readable', onreadable)
  resultStream.on('end', onend)

  var dont_stop = setInterval(Function(), 10)

  var expected = {
      'A': 0
    , 'B': 2
    , 'C': 3
    , 'D': 1
  }

  var len = 4

  function onreadable() {
    while(true) {
      var res = resultStream.read()

      if(res === null) {
        return
      }

      assert.strictEqual(expected[res.key], res.value)
      len--
    }
  }

  function onend() {
    clearInterval(dont_stop)
    assert.strictEqual(len, 0)
    assert.end()
  }

})

function sort_by_id(A, B) {
  return A.source_id < B.source_id ? -1 : 1
}
