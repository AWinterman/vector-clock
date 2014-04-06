var stream = require('stream')

module.exports = Clock

function Clock(id, start) {
  if(!(this instanceof Clock)) {
    return Clock.apply(Object.create(Clock.prototype), arguments)
  }

  this.id = id
  this.start = (start === undefined) ? 0 : start

  this.clock = {}
  this.clock[this.id] = this.start

  return this
}

Clock.prototype.createReadStream = function() {
  var self = this

  var keys = Object.keys(self.clock).sort(randomize)
    , out_stream
    , opts
    , i

  i = 0

  opts = {}
  opts.highWaterMark = keys.length * 2
  opts.objectMode = true

  out_stream = new stream.Readable(opts)

  out_stream._read = function() {
    if(i >= keys.length) {
      return out_stream.push(null)
    }

    var data

    data = {}
    data.id = keys[i]
    data.version = self.get(keys[i])

    out_stream.push(data)
    ++i
  }

  self.update(self.id)

  return out_stream
}

function randomize(A, B) {
  return Math.random() > 0.5 ? -1 : 1
}

Clock.prototype.get = function(source_id) {
  if(this.clock.hasOwnProperty(source_id)) {
    return this.clock[source_id]
  }

  return -Infinity
}

Clock.prototype.update = function(id, version) {
  if(!this.clock.hasOwnProperty(id) && (id in this.clock)) {
    throw new Error('Cannot override prototypal properties')
  }

  var current = id in this.clock ? this.clock[id] : this.start

  if(id !== this.id && (undefined === version || null === version)) {
    return false
  }

  if(id === this.id) {
    this.clock[this.id]++
  } else {
    this.clock[id] = Math.max(current, version)
    this.clock[this.id] = Math.max(version + 1, this.clock[this.id])
  }

  return this.clock[id]
}
