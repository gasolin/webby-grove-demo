'use strict';

var EventEmitter = require('events').EventEmitter;
var grovePi = require('node-grovepi').GrovePi;
var Commands = grovePi.commands;
var Board = grovePi.board;

//var digitalSensor = grovePi.sensors.base.Digital;
var analogSensor = grovePi.sensors.base.Analog;

var verEx = require('verbal-expressions');

var boardEvent = new EventEmitter();

var potentiometerPin = 2;
var ledPin = 5;

var ledSensor = new analogSensor(ledPin);
var potentioMeter = new analogSensor(potentiometerPin);

var ledPrevLevel = 0;
var ledLevel = 0;

potentioMeter.on('change', function(res) {
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
  potentioMeter.watch();
});

board.init();

var pattern = verEx().then('led ').find(verEx().range('0', '9')).endOfLine();
console.log('>>>>>>' + pattern);
///(led) (\\d+)/i

module.exports = function(robot) {
  robot.respond(/led$/i, function(res) {
    if (!board.checkStatus()) {
      return res.send('Board is unaviliable'); 
    }
    console.log('got led level ' + ledLevel);
    var status = ledLevel > 5 ? 'on(' + ledLevel + ')' : 'off';

    res.send('light is ' + status);
  });

  robot.respond(/led\s(\d+)/i, function(res) {
    if (!board.checkStatus()) {
      return res.send('Board is unaviliable'); 
    }
    var level = Math.min(res.match[1], 1020) / 4;
    console.log('set led level ' + level);

    ledSensor.write(level);
    ledLevel = level;
    res.send('set LED level to ' + level);
  });

  robot.respond(/led\son/i, function(res) {
    if (!board.checkStatus()) {
      return res.send('Board is unaviliable'); 
    }


    ledSensor.write(255);
    ledLevel = 255;
    res.send('LED is on');
  });

  robot.respond(/led\soff/i, function(res) {
    if (!board.checkStatus()) {
      return res.send('Board is unaviliable'); 
    }
    console.log('got led level ' + 0);
    ledSensor.write(0);
    ledLevel = 0;
    res.send('LED is off');
  });
};
