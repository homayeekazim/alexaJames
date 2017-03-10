'use strict';
module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('askjames');
var FAADataHelper = require('./data_helper');

app.launch(function(req, res) {
  var prompt = 'Hi, I am James. Please tell me if there is anything I can help you with.';
  var reprompt = 'How can I help you, Sir.';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

app.intent('orders', {
  'slots': {
    'ORDER': 'ITEM'
  }
},
  function(req, res) {
    //get the slot
    var orderResponse = req.slot('ORDER');
    var reprompt = 'How can I help you, Sir.';
    if (_.isEmpty(orderResponse)) {
      var prompt = 'I didn\'t hear anything. Tell me if you would like to order anything.';
      res.say(prompt).reprompt(reprompt).shouldEndSession(false);
      return true;
    } else {
      var faaHelper = new FAADataHelper();
      faaHelper.requestAirportStatus(orderResponse).then(function(orderStatus) {
        console.log(orderStatus);
        res.say(faaHelper.formatAirportStatus(orderStatus)).send();
      }).catch(function(err) {
        console.log(err.statusCode);
        var prompt = 'Sorry, I didn\'t get what you meant by ' + orderResponse;
         //https://github.com/matt-kruse/alexa-app/blob/master/index.js#L171
        res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
      });
      return false;
    }
  }
);

///////////////////////////////////////////// MOVIES //////////////////////////////////////////
app.intent('movies', function(req, res) {
  var faaHelper = new FAADataHelper();
  faaHelper.chromeCastAction().then(function(result) {
    console.log(result);
    res.say(result).send();
  }).catch(function(err) {
    console.log(err.statusCode);
    res.say(prompt).reprompt(prompt).shouldEndSession(false);
  });
  return false;
  }
);

///////////////////////////////// MUSIC /////////////////////////////////////////////
app.intent('music',function(req, res) {
    var faaHelper = new FAADataHelper();
    faaHelper.sonosToggle().then(function(requestStatus) {
      console.log(requestStatus);
      var prompt = "Done, Sir!";
      res.say(requestStatus).send();
    }).catch(function(err) {
      console.log(err.statusCode);
      var prompt = 'Sorry, I didn\'t get what you meant';
        //https://github.com/matt-kruse/alexa-app/blob/master/index.js#L171
      res.say(prompt).shouldEndSession(false).send();
    });
    return false;
  }
);

app.intent('musicvolumecontrol', {
  'slots': {
    'VOLUME': 'NUMBER'
  }
},
  function(req, res) {
    //get the slot
    var faaHelper = new FAADataHelper();
    var volume = req.slot('VOLUME');
    var reprompt = 'Please tell me volume between 1 and 100.';
    if (_.isEmpty(volume)) {
      var prompt = 'Please tell me volume between 1 and 100.';
      res.say(prompt).shouldEndSession(false).send();
      return true;
    } else {
      faaHelper.musicVolumeControl(volume).then(function(requestStatus) {
        console.log(requestStatus);
        if(requestStatus.status == "success"){
          var prompt = 'Volume set to '+volume;
          res.say(prompt).send();
        }else{
          res.say("Unable to set volume. Please try again.").send();
        }
        // res.say(faaHelper.formatResponseStatus(requestStatus)).send();
      }).catch(function(err) {
        console.log(err.statusCode);
        var prompt = 'Sorry, I didn\'t get what you meant by ' + volume;
         //https://github.com/matt-kruse/alexa-app/blob/master/index.js#L171
        res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
      });
      return false;
    }
  }
);

app.intent('increasemusicvolume',
  function(req, res) {
    //get the slot
    var faaHelper = new FAADataHelper();
    faaHelper.increaseMusicVolume().then(function(requestStatus) {
        console.log(requestStatus);
        if(requestStatus.status == "success"){
          var prompt = 'Volume increased by 10 percent.';
          res.say(prompt).send();
        }else{
          res.say("Unable to set volume. Please try again.").send();
        }
        // res.say(faaHelper.formatResponseStatus(requestStatus)).send();
      }).catch(function(err) {
        console.log(err.statusCode);
        var prompt = 'Sorry, I didn\'t get what you meant by ' + volume;
         //https://github.com/matt-kruse/alexa-app/blob/master/index.js#L171
        res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
      });
      return false;
    }
);

app.intent('decreasemusicvolume',
  function(req, res) {
    //get the slot
    var faaHelper = new FAADataHelper();
      faaHelper.decreaseMusicVolume().then(function(requestStatus) {
        console.log(requestStatus);
        if(requestStatus.status == "success"){
          var prompt = 'Volume decreased by 10 percent.';
          res.say(prompt).send();
        }else{
          res.say("Unable to set volume. Please try again.").send();
        }
        // res.say(faaHelper.formatResponseStatus(requestStatus)).send();
      }).catch(function(err) {
        console.log(err.statusCode);
        var prompt = 'Sorry, I didn\'t get what you meant by ' + volume;
         //https://github.com/matt-kruse/alexa-app/blob/master/index.js#L171
        res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
      });
      return false;
    }
);

app.intent('mutemusic',
  function(req, res) {
    //get the slot
    var faaHelper = new FAADataHelper();
    faaHelper.muteMusic().then(function(requestStatus) {
        console.log(requestStatus);
        if(requestStatus.status == "success"){
          var prompt = 'Music mute.';
          res.say(prompt).send();
        }else{
          res.say("Unable to set mute. Please try again.").send();
        }
        // res.say(faaHelper.formatResponseStatus(requestStatus)).send();
      }).catch(function(err) {
        console.log(err.statusCode);
        var prompt = 'Sorry, I didn\'t get what you meant by ' + volume;
         //https://github.com/matt-kruse/alexa-app/blob/master/index.js#L171
        res.say(prompt).reprompt(prompt).shouldEndSession(false).send();
      });
      return false;
    }
);

app.intent('unmutemusic',
  function(req, res) {
    //get the slot
    var faaHelper = new FAADataHelper();
    faaHelper.unmuteMusic().then(function(requestStatus) {
        console.log(requestStatus);
        if(requestStatus.status == "success"){
          var prompt = 'Music unmute.';
          res.say(prompt).send();
        }else{
          res.say("Unable to set umute. Please try again.").send();
        }
        // res.say(faaHelper.formatResponseStatus(requestStatus)).send();
      }).catch(function(err) {
        console.log(err.statusCode);
        var prompt = 'Sorry, I didn\'t get what you meant by ' + volume;
         //https://github.com/matt-kruse/alexa-app/blob/master/index.js#L171
        res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
      });
      return false;
    }
);

app.intent('nexttrackmusic',
  function(req, res) {
    //get the slot
    var faaHelper = new FAADataHelper();
      faaHelper.nextMusicTrack().then(function(requestStatus) {
        console.log(requestStatus);
        if(requestStatus.status == "success"){
          var prompt = 'Done.';
          res.say(prompt).send();
        }else{
          res.say("Unable to change track. Please try again.").send();
        }
        // res.say(faaHelper.formatResponseStatus(requestStatus)).send();
      }).catch(function(err) {
        console.log(err.statusCode);
        var prompt = 'Sorry, I didn\'t get what you meant by ' + volume;
         //https://github.com/matt-kruse/alexa-app/blob/master/index.js#L171
        res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
      });
      return false;
    }
);

app.intent('previoustrackmusic',
  function(req, res) {
    //get the slot
    var faaHelper = new FAADataHelper();
      faaHelper.previousMusicTrack().then(function(requestStatus) {
        console.log(requestStatus);
        if(requestStatus.status == "success"){
          var prompt = 'Done.';
          res.say(prompt).send();
        }else{
          res.say("Unable to change track. Please try again.").send();
        }
        // res.say(faaHelper.formatResponseStatus(requestStatus)).send();
      }).catch(function(err) {
        console.log(err.statusCode);
        var prompt = 'Sorry, I didn\'t get what you meant by ' + volume;
         //https://github.com/matt-kruse/alexa-app/blob/master/index.js#L171
        res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
      });
      return false;
    }
);

///////////////////////////////////////////// LOXONE CONTROL //////////////////////////////////////////
app.intent('loxonecontrol', function(req, res) {
  var faaHelper = new FAADataHelper();
  faaHelper.chromeCastAction().then(function(result) {
    console.log(result);
    res.say(result).send();
  }).catch(function(err) {
    console.log(err.statusCode);
    res.say(prompt).reprompt(prompt).shouldEndSession(false);
  });
  return false;
  }
);

///////////////////////////////////////////// LOXONE CONTROL //////////////////////////////////////////
app.intent('orderhelicopter', function(req, res) {
  var result = "Sir, yes Sir. Your helicopter is on the way. Please be ready on the terrace."
  res.say(result).send();
  return false;
  }
);

//hack to support custom utterances in utterance expansion string
console.log(app.utterances().replace(/\{\-\|/g, '{'));
module.exports = app;
