// Comps
const X32 = require("./X32")
const {range, toFloat32, castMeters6, argToFullScale, fullScaleToArg} = require("./X32Helpers")

let X32Connection = null

// Send Message
document.getElementById("send").addEventListener("click", () => {
  if (X32Connection) {
    const value = document.getElementById("address").value
    const stringArgs = document.getElementById("args").value
    let args = []
    try {
      args = JSON.parse(stringArgs)
    } catch (e) {
      console.trace(e)
    }
    X32Connection.request(value, args)
  } else {
    console.error("Not connected to an X32")
  }
})

// Connect to the X32 
document.getElementById("connect").addEventListener("click", () => {
  X32Connection?.close()
  X32Connection = new X32(document.getElementById("ip").value)
})

// Disconnect from the X32
document.getElementById("disconnect").addEventListener("click", () => {
  X32Connection?.close()
})
