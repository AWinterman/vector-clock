#`vector-clock-class`#

## Overview ##

A [vector clock][vclock-paper] is a data structure for keeping
track of logical time for a set of events, allowing them to be partially
ordered.

Install it with

```
npm install --save vector-clock-class
```

## API ##

```javascript
var Clock = require('vector-clock-class')

Clock(
    String | Number id,
    (Integer start) | null
) -> vector_clock
```

- `id` should distinguish this clock from all the others. It is
saved to the class instance as `id`
- `start` is an optional parameter which sets the version number from which the
clock should start counting.

## Methods and Attributes ##

In the methods below, `id` is a hashable object. Semantically, it should be the
unique identifier of another clock.

###`vector_clock.clock`###

The vector clock-- a map from `source_ids` to version numbers. Like the `C`
function from [Lamport's paper][vclock-paper]. It's worth noting that this
means this module plays well with [npm.im/vectorclock][vectorclock], although this
breaks the contract somewhat, since [mixu](https://github.com/mixu)'s library
expects object literals.

###`vector_clock.get(id)` -> `Integer version`###

Returns the version number for the specified `id`, or `-Infinity` if it cannot be
found.

###`vector_clock.update(id, version)` -> `Integer|false`###

Bump the entry for a given id. `version` is required to ensure updates from
*this* `vector_clock` which occur after the bump have a later version number.
Note that the `version` is optional **only** if `id === vector_clock.id`. The
return value is `false` if `version` is not specified when it should be.
Otherwise it is the new version number for `id`.

###`vector_clock.createReadStream()` -> `stream`###

This method creates a stream; randomly orders the keys of the clock; pushes
onto a newly-created readableStream one object of form  `{id: key, version: n}`
per key; and then closes the stream. It also
`vector_clock.update(vector_clock.id)`. This facilitates easily creating
digests of all the updates the clock has seen, useful for the [scuttlebutt][]

# The competition #

There's already another [venerable vector clock](vectorclock) library out
there. This one more or less grew out of my [scuttlebutt][] implementation. It
differs from [vectorclock][] in it's scope (slightly smaller), that it presents
a way to stream clock data out of it, and it's API.

[vclock-paper]: http://research.microsoft.com/en-us/um/people/lamport/pubs/time-clocks.pdf
[vectorclock]: https://npmjs.org/package/vectorclock
[scuttlebutt]: https://github.com/AWinterman/simple-scuttle
