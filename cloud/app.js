// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var app = express();

var config = require('cloud/config.js');
var sendEmail = require('cloud/email.js');

// Middleware for reading request body
app.use(express.bodyParser());

app.post('/sendIftttEmail', function(request, response) {

  // Log the request from the Echo.  This allows you to debug the request
  // from 'parse log'
  console.log("Request body: " + JSON.stringify(request.body));

  // Basis for the response
  var echoResponse = {
    "version": "1.0",
    "response": {
      "outputSpeech": {
        "type": "PlainText",
        "text": "Okay"
      },
      "shouldEndSession": true
    }
  };

  // Handle any errors within the request.
  if (request.body.request.reason === "ERROR") {
    echoResponse.response.outputSpeech.text = "Sorry, there was an error.";
    response.send(JSON.stringify(echoResponse));
    return;
  }

  // Pull out the "Action" intent from the request and validate.  Remove
  // spaces and lowercase to form a IFTTT tag for the email.
  var action = request.body.request.intent.slots.Action.value;
  if (action) {
    action = action.toLowerCase();
    action = action.replace(/\s+/g, '');
  }

  // Validate it is a supported action.
  if (!action || (config.supportedActions && !(action in config.supportedActions))) {
    echoResponse.response.outputSpeech.text = "Sorry, I heard: " + action;
    response.send(JSON.stringify(echoResponse));
    return;
  }

  // Now send the email.
  sendEmail("#" + action, function(success) {
    if (success) {
      response.send(JSON.stringify(echoResponse));
    } else {
      echoResponse.response.outputSpeech.text = "Error sending email";
      response.send(JSON.stringify(echoResponse));
    }
  });

});

// Attach the Express app to Cloud Code.
app.listen();
