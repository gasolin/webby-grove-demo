var grovePi = require('node-grovepi').GrovePi;
var Commands = grovePi.commands;
var Board = grovePi.board;

//var digitalSensor = grovePi.sensors.base.Digital;
var analogSensor = grovePi.sensors.base.Analog;

var verEx = require('verbal-expressions');

var board;
var potentiometer_pin = 2;
var led_pin = 5;

var led_prev_level = 0;
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
          led_level = res / 4;
          if (led_prev_level > led_level + 5 || led_prev_level < led_level - 5) {
            console.log('change led level:' + res);
            led_prev_level = led_level;
            ledSensor.write(led_level);
          }
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

start();
// catch ctrl + c event
//process.on('SIGINT', onExit);


var pattern = verEx().then('led ').find(verEx().range('0', '9')).endOfLine();
console.log('>>>>>>' + pattern);
///(led) (\\d+)/i

module.exports = function(robot) {
  robot.respond(/led\s(\d+)/i, function(res) {
    var level = Math.min(res.match[1], 1020) / 4;
    console.log('got led level ' + level);
    res.send('set light level to ' + level);
  });

  robot.respond(/led\son/i, function(res) {
    res.send('light is on');
  });

  robot.respond(/led\soff/i, function(res) {
    console.log('got led level ' + 0);
    res.send('light is off');
  });
}
