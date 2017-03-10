var rp = require('request-promise');

var options = {
    uri: 'http://admin:admin12345@192.168.14.247:8888/dev/sps/io/LightingController-LivingRoom-1/chillout',
    json: true, // Automatically parses the JSON string in the response
    resolveWithFullResponse: true
};

rp(options)
    .then(function (repos) {
        console.log(repos.statusCode);
    })
    .catch(function (err) {
        // API call failed...
        console.log('Error', err);
    });