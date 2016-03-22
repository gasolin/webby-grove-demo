# webby-grove-demo
This project's goal is to demostrate control devices via messengers via [Webby](https://github.com/gasolin/webbybot).

## Usage

* Rotate rotery angle sensor to control LED's light level

* Check status
```
led
> LED is off
```

* Change state
```
led on
> LED is on(255)
led off
> LED is off
```
* Set value
```
> led 800
> set LED level to 200
> led
> LED is on(200)
```

## Prerequisite

* Mainboard: [Respberry Pi 2 or 3](http://www.seeedstudio.com/depot/Raspberry-Pi-3-Model-B-p-2625.html)

![respberrypi](http://www.seeedstudio.com/depot/bmz_cache/a/a69d5b1d5e88c20818330a90b0513893.image.530x397.jpg)

* [GrovePi+](http://www.seeedstudio.com/depot/GrovePi-p-2241.html) extension board to connect Grove modules

![grovepi](http://www.seeedstudio.com/depot/includes/templates/bootstrap/images/grove/grovepi2.jpg)

* Grove sensors:
[Green LED](http://www.seeedstudio.com/depot/Grove-LED-p-767.html)

![LED](http://www.seeedstudio.com/depot/bmz_cache/7/7cd71e5269f93b835845def2df26b7f0.image.530x397.jpg)

[Rotery angle sensor](http://www.seeedstudio.com/depot/grove-rotary-angle-sensor-p-770.html)

![rotery](http://www.seeedstudio.com/depot/bmz_cache/1/100eefa0c7159e81dd6382b7ebee5c59.image.530x397.jpg)

(They are also avaialble via [Grove starter kit](http://www.seeedstudio.com/depot/Grove-Starter-Kit-for-Arduino-p-1855.html))

## Setup Hardware

Connect GrovePi+ and Respberry Pi together.
Plug Rotery angle sensor in pin A2, Plug Green LED in pin D5 on GrovePi+ board.

## Setup Software

You need to make GrovePi works first by following this [instructions](http://www.dexterindustries.com/GrovePi/get-started-with-the-grovepi/setting-software/).

Then you need clone [webby_template](https://github.com/gasolin/webby_template) which provide the basic setup of chatbot framework.

```bash
$ git clone https://github.com/gasolin/webby_template.git demo
$ cd demo
```
Then you have to get this project and install a messenger adapter from npm

```bash
$ npm install --save hubot-telegram webby-grove-demo
$ npm install
```

Edit `external-scripts.json` and add `"webby-grove-demo"` string in it
Edit node_modules/hubot-telegram/src/telegram.coffee and replace `hubot` to `webbybot` at the first line.

Then you need create a telegram bot and put the token in `.bashrc` file

```
export TELEGRAM_TOKEN=222333444:AAbbccDdeeffgghijklm
```

Refresh the bash environment with

```
. ~/.bashrc
```

Then you can host your bot on telegram and control the sensors.

```
$ ./bin/webby -a telegram
```
