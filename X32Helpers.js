// Convert 
function fullScaleToArg (fullScale) {
  return Math.pow(10,(parseFloat(fullScale)/20))
}

function argToFullScale (linear) {
  return (Math.log(parseFloat(linear))/Math.LN10)*20
}

// An array full with steps
// This could be better
function range (start, stop, step = 1) {
  return  Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)
}
  
// Cast an array of 8 bytes into 32 bytes
function _toFloat32(uint8array) {
  // uint8 array with 2 floats inside, 1.0 and -1.0
  // uint8array = new Uint8Array([63, 128, 0, 0, 128 + 63, 128, 0, 0]);
  numberOfFloats = (uint8array.byteLength / 4)
  dataView = new DataView(uint8array.buffer)
  arrayOfNumbers = range(0, numberOfFloats).map(idx => dataView.getFloat32(idx * 4, true))
  return arrayOfNumbers
}

// Pull the number of returned values off the front so we get correct values
function toFloat32 (uint8array) {
  // Remove the length number from the front
  return _toFloat32(uint8array.slice(4))
}

// Cast /meters/6 into human JSON
function castMeters6(uint8array) {
  const cast = toFloat32(uint8array)
  return {
    count: cast.length,
    args: cast,
    params: {
      gain: cast[0],
      trim: cast[0],
      gate: cast[1],
      dyn: cast[2],
      post: cast[3],
    }
  }
}

module.exports = {
  range,
  toFloat32,
  castMeters6,
  fullScaleToArg,
  argToFullScale
}
