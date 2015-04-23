var sendgrid = require("sendgrid");

var config = require('cloud/config.js');

sendgrid.initialize(config.sendgridUser, config.sendgridPassword);

module.exports = function(subject, callback) {
	sendgrid.sendEmail({
		to: config.emailTo,
		from: config.emailFrom,
		subject: subject,
		text: "Nothing"
	}, {
		success: function() {
			callback(true);
		},
		error: function() {
			callback(false);
		}
	});
};
