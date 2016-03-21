var grovePi = require('node-grovepi').GrovePi;
var Commands = grovePi.commands;
var Board = grovePi.board;

//var digitalSensor = grovePi.sensors.base.Digital;
var analogSensor = grovePi.sensors.base.Analog;

var verEx = require('verbal-expressions');

var board;
var potentiometer_pin = 2;
var led_pin = 5;

var led_level = 0;

function start() {
  console.log('starting');
  board = new Board({
    debug: true,
    onError: function(err) {
      console.log('TEST ERROR');
      console.log(err);
    },
    onInit: function(res) {
      if (res) {
        var ledSensor = new analogSensor(led_pin);
        var potentioMeter = new analogSensor(potentiometer_pin);

        console.log('GrovePi version::' + board.version());
        /*
        potentioMeter.stream(1000, function(res) {
          console.log('pm:' + res);
        });
        */
        potentioMeter.on('change', function(res) {
          //console.log('led level:' + res);
          led_level = res / 4;
          ledSensor.write(led_level);
        });
        potentioMeter.watch();

        
      } else {
        console.log('TEST CANNOT START');
      }
    }
  });
  board.init();
}

function onExit(err) {
  console.log('ending');
  board.close();
  process.removeAllListeners();
  process.exit();
  if (typeof err !== 'undefined') {
    console.log(err);
  }
}

//start();
// catch ctrl + c event
//process.on('SIGINT', onExit);


var pattern = verEx().then('led ').range('0', '9').endOfLine();
console.log('>>>>>>' + pattern);
///(led) ([1-9]*)$/i

module.exports = function(robot) {
  robot.respond(pattern, function(res) {
    var level = Max(res.match[2], 1023) / 4;
    console.log('got led level ' + level);
    res.send('set light level to' + level);
  });
}
