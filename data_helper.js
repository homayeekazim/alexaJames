'use strict';
////////////////////////// PREREQ /////////////////////////////////////
var _ = require('lodash');
var rp = require('request-promise');
var admin = require('firebase-admin');

////////////////////////////// DEFAULT URL/URI //////////////////////////
var movieToggleUrl = "http://7c76a432.ngrok.io"; // localhost:3077
var movieCastUrl = "http://d6199b0e.ngrok.io"; // localhost:3088
var musicSonosUrl = "http://58371a84.ngrok.io"+"/livingRoom"; // localhost:5005

/////////////////////////////// EMAIL SETTINGS /////////////////////////
var from_name = encodeURI("Alexa - New Food Order Alert");
var subject_line = encodeURI("New Food Order via Amazon Alexa from James");
var email_address_to = encodeURI("homayeekazim@gmail.com"); //renato.steiner+foodorder@gmail.com
console.log("email_address_to "+ email_address_to);

///////////////////////////////// FIREBASE SETTINGS //////////////////////
admin.initializeApp({
  credential: admin.credential.cert("./includes/jbackend-mh6-dev-firebase-adminsdk-5fbhj-69bc4136c5.json"),
  databaseURL: "https://jbackend-mh6-dev.firebaseio.com",
  databaseAuthVariableOverride: {
    uid: "james_user"
  }
});
var db = admin.database();
var ref = db.ref("location/lbmh6/services/orders");

//////////////////////////////////// INITIALIZE ////////////////////////////
function FAADataHelper() {
}
///////////////////////////////// FOOD ORDERS ///////////////////////////////////////
FAADataHelper.prototype.requestAirportStatus = function(item) {
  // return this.getAirportStatus(item).then(
  //   function(response) {
  //     return response.body; 
  //   }
  // );
  var timeNow = new Date();
  return this.getAirportStatus(item).then(
    function(response) {
      
      ref.push({
        orderReceivedtime: timeNow.toISOString(),
        status: 'ORDER_RECEIVED',
        notes: item
      })
      return response.body; 
    }
  );
  // return this.getAirportStatus(item).then(
  //   function(response) {
  //     ref.push({
  //       orderReceivedtime: timeNew,
  //       status: 'ORDER_RECEIVED',
  //       notes: item
  //     },function(){
  //       return response.body;
  //     })
  //   })
};

FAADataHelper.prototype.getAirportStatus = function(item) {
  var message_body = encodeURI("A new food order request for "+item+" from apartment MH6 has been received");
  var url = "http://lebijou.io/_jamesapp/mail/dynamic_email.php?from_name="+from_name+"&subject_line="+subject_line+"&email_address_to="+email_address_to+"&message_body="+message_body;

  var options = {
    method: 'GET',
    uri: url,
    resolveWithFullResponse: true,
    json: true
  };
  // Get a database reference to our blog
  // var db = admin.database();
  // var ref = db.ref("location/lbmh6/services/orders");
  // ref.push({
  //       orderReceivedtime: timeNew,
  //       status: 'ORDER_RECEIVED',
  //       notes: item
  // },function(){
  //   return rp(options);
  // })
  return rp(options);
  
};

FAADataHelper.prototype.formatAirportStatus = function(res) {
  if(res.status == 'Sent'){
    return "I have placed your order. Our staff will confirm it shortly. Thank you.";
  }else{
    return "Sorry I was not able to process your order. Please retry. Thank you.";
  }
  // return _.template('Email ${status}.')({
  //   status: res.status
  // });
};

//////////////////////////// MOVIES //////////////////////////////////////
FAADataHelper.prototype.chromeCastAction = function() {
  var path = "/togglePlay";
    var options = {
      method: 'GET',
      uri: encodeURI(movieToggleUrl + path),
      resolveWithFullResponse: false,
      json: true
    };
    return rp(options).then(function(repos) {
      return "Done, Sir!";
    },function(e){
      var path = "/moviePlay?mediaType=movies";
      var options = {
        method: 'GET',
        uri: encodeURI(movieCastUrl + path),
        resolveWithFullResponse: false,
        json: true
      };
      return rp(options).then(function(resp) {
        console.log("Done");
        return "Done, The movie will be played shortly.";
      },function(err){
        console.log("Error",err);
        return "I'm sorry, I was not able to process your request. Please try again.";
      })
      
    });
};
////////////////////////// MUSIC ///////////////////////////////////////////////////
FAADataHelper.prototype.sonosToggle = function() {
  var path = "/playpause"
    var options = {
      method: 'GET',
      uri: encodeURI(musicSonosUrl + path),
      resolveWithFullResponse: false,
      json: true
    };
    return rp(options).then(function(repos) {
        console.log("Done");
        return "Done, Sir!";
    },function(err){
        console.log('Error',err);
        return "I'm sorry, I was not able to process your request. Please try again.";
    });
};

FAADataHelper.prototype.musicVolumeControl = function(item) {
  
  var path = "/volume/"+item
  var options = {
    method: 'GET',
    uri: encodeURI(musicSonosUrl + path),
    resolveWithFullResponse: true,
    json: true
  };
  return rp(options).then(function(repos) {
      return repos.body;
  });
  
};

FAADataHelper.prototype.increaseMusicVolume = function(item) {
  
  var path = "/volume/+10"
  var options = {
    method: 'GET',
    uri: encodeURI(musicSonosUrl + path),
    resolveWithFullResponse: true,
    json: true
  };
  return rp(options).then(function(repos) {
      return repos.body;
  });
  
};

FAADataHelper.prototype.decreaseMusicVolume = function(item) {
  
  var path = "/volume/-10"
  var options = {
    method: 'GET',
    uri: encodeURI(musicSonosUrl + path),
    resolveWithFullResponse: true,
    json: true
  };
  return rp(options).then(function(repos) {
      return repos.body;
  });
  
};

FAADataHelper.prototype.muteMusic = function(item) {
  
  var path = "/mute"
  var options = {
    method: 'GET',
    uri: encodeURI(musicSonosUrl + path),
    resolveWithFullResponse: true,
    json: true
  };
  return rp(options).then(function(repos) {
      return repos.body;
  });
  
};

FAADataHelper.prototype.unmuteMusic = function(item) {
  
  var path = "/unmute"
  var options = {
    method: 'GET',
    uri: encodeURI(musicSonosUrl + path),
    resolveWithFullResponse: true,
    json: true
  };
  return rp(options).then(function(repos) {
      return repos.body;
  });
  
};

FAADataHelper.prototype.nextMusicTrack = function(item) {
  
  var path = "/next"
  var options = {
    method: 'GET',
    uri: encodeURI(musicSonosUrl + path),
    resolveWithFullResponse: true,
    json: true
  };
  return rp(options).then(function(repos) {
      return repos.body;
  });
  
};

FAADataHelper.prototype.previousMusicTrack = function(item) {
  
  var path = "/previous"
  var options = {
    method: 'GET',
    uri: encodeURI(musicSonosUrl + path),
    resolveWithFullResponse: true,
    json: true
  };
  return rp(options).then(function(repos) {
      return repos.body;
  });
  
};

FAADataHelper.prototype.orderHelicopter = function(item) {
  return "Sir, yes Sir. Your helicopter is on the way. Please be ready on the terrace.";  
};

//////////////////// EXPORT MODULE ///////////////////////////////////
module.exports = FAADataHelper;

/////////////////////// TEST CODE ///////////////////////////////////
// ref.push({
//   orderReceivedtime: timeNew,
//   status: 'ORDER_RECEIVED',
//   notes: 'TEMP'
// })
// console.log("timenow",timeNow)

// ref.push({
//     orderReceivedtime: timeNew,
//     status: 'ORDER_RECEIVED',
//     notes: 'asd'
// },function(){
//   console.log("Done");
// })
// FAADataHelper.prototype.requestAirportStatus('ice')