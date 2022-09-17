/**
 * The X32 class was based on some code found in the osc read me
 * https://github.com/colinbdclark/osc.js#sample-code-2 
 * and this issue here
 * https://github.com/colinbdclark/osc.js/issues/145
 */
// Libs
let { UDPPort } = require('osc')

module.exports = class X32 {
  constructor(x32Ip) {
    // Connect
    this.udpPort = new UDPPort({
      localAddress: "0.0.0.0",
      localPort: 57121,
      metadata: true,
      remoteAddress: x32Ip, //'192.168.0.30',
      remotePort: 10023,
      broadcast: false
    })
    this.udpPort.open()

    // Listen for OSC messages and log them to the console
    this.udpPort.on("message", function (oscMsg, timeTag, info) {
      if (oscMsg.address === "/info") {
        console.log("An OSC message just arrived!", oscMsg);
      // } else if (oscMsg.address === "/meters/6") {
      //   console.log("/meters/6", castMeters6(oscMsg.args[0].value).params.gain);
      } else {
        console.log(oscMsg);
      }
    })

    // When we have an error we log it to the console
    this.udpPort.on("error", function (error) {
      console.log("An error occurred: ", error.message);
      console.trace(error)
    })

    // When Read we get the info on the X32 and print to the console
    this.udpPort.on("ready", () => {
      console.log("ready")
      this.request(`/info`)
    })
  }

  // Close the connection with the X32
  close () {
    this.udpPort.close()
  }

  // Send an OSC message with args
  request (address, args) {
    console.log(`@request->${address}`)
    /**
     * /mtx/02/mix/fader
     * /ch/01/mix/fader
     * /xremote - get's changes
     * /subscribe ,s /-stat/solosw/01
     * 
     * 
     * /subscribe
     * /meters
      [
        {"type": "s", "value": "/meters/1"},
        {"type": "i", "value": 16}
      ]
      /subscribe~~,si~/meters/6~~~[    16]
     * 
      /meters/ 
      [
        {"type": "s", "value": "/meters/10"},
        {"type": "i", "value": 16}
      ]
      * http://www.playdotsound.com/portfolio-item/decibel-db-to-float-value-calculator-making-sense-of-linear-values-in-audio-tools/
      * linear = Math.pow(10,(parseFloat(fullscale)/20))
      * fullscale = (Math.log(parseFloat(linear))/Math.LN10)*20
     */
    this.udpPort.send({
      address: address,
      args: args || []
    })
  }
}
