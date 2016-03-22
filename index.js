'use strict';

var EventEmitter = require('events').EventEmitter;
var grovePi = require('node-grovepi').GrovePi;
var Board = grovePi.board;
var analogSensor = grovePi.sensors.base.Analog;
var boardEvent = new EventEmitter();

// device pins
var roteryPin = 2;
var ledPin = 5;
// declare devices
var ledSensor = new analogSensor(ledPin);
var roterySensor = new analogSensor(roteryPin);
// cache current led state
var ledPrevLevel = 0;
var ledLevel = 0;

roterySensor.on('change', function(res) {
  ledLevel = Math.min(res, 1020) / 4;

  if (ledPrevLevel > ledLevel + 5 || ledPrevLevel < ledLevel - 5) {
    ledPrevLevel = ledLevel;

    ledSensor.write(ledLevel);
  }
});

var board = new Board({
  debug: true,
  onError: function(err) {
    boardEvent.emit('error', err); 
  },
  onInit: function(res) {
    if (!res) {
      boardEvent.emit('error', 'Can not init Board');
    } 

    boardEvent.emit('init');
  }
});


boardEvent.on('init', function() {
  roterySensor.watch();
});

board.init();

function setLEDLevel(val) {
  ledSensor.write(val);
  ledLevel = val;  
}

// bot responses
module.exports = function(robot) {
  robot.respond(/led$/i, function(res) {
    if (!board.checkStatus()) {
      return res.send('Board is unaviliable'); 
    }
    console.log('got led level ' + ledLevel);
    var status = ledLevel > 5 ? 'on(' + ledLevel + ')' : 'off';

    res.send('LED is ' + status);
  });

  robot.respond(/led\s(\d+)/i, function(res) {
    if (!board.checkStatus()) {
      return res.send('Board is unaviliable'); 
    }
    var level = Math.min(res.match[1], 1020) / 4;
    console.log('set led level ' + level);

    setLEDLevel(level);
    res.send('set LED level to ' + level);
  });

  robot.respond(/led\son/i, function(res) {
    if (!board.checkStatus()) {
      return res.send('Board is unaviliable'); 
    }


    setLEDLevel(255);
    res.send('LED is on');
  });

  robot.respond(/led\soff/i, function(res) {
    if (!board.checkStatus()) {
      return res.send('Board is unaviliable'); 
    }
    console.log('set led level ' + 0);
    setLEDLevel(0);
    res.send('LED is off');
  });
};
