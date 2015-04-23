# Amazon Echo IFTTT Example

A sample application to allow an Amazon Echo to trigger IFTTT recipes.  It uses email to trigger recipes based on requests from the Echo servers.  It is setup to be run in [Parse](http://parse.com) and uses [Sendgrid](https://sendgrid.com) to send emails.

I used this to control my WeMo lights prior to Amazon releasing WeMo support but it could be used for many things.  With a bit of modification, it could be used for setting your Nest Thermostat, sending a message to Slack, storing a todo in Todoist, or many of the other channels that IFTTT supports.

## Configuration

There are a number of external services used in this example so configuration is non-trivial.  You will need to rename `config\config_template.js` to `config\config.js`.

### Parse

Create a new [Parse](http://parse.com) application.  At the root folder of this application run  `parse new .`.  This will create a config file and ask you for your Parse username and password to setup the config file.

Configure a domain for your new application.
![](https://cldup.com/ZjORdA95tu.png)

Once you've made the appropriate changes to the application, run `parse deploy` to deploy your application to Parse.

### Sendgrid

Parse uses Cloud Modules for sending emails and this sample uses the Sendgrid library.  You can signup for a free account and then configure that account in `cloud\config.js`.  You need to set `sendgridUser` and `sendgridPassword` as the username and password for your account (I know it sucks but this is how the Sendgrid cloud module works).

### Echo

Setup a new application with whatever name and launch word you want.  Point this at the URL you created above.
![](https://cldup.com/xkxdRc11KB.png)

Now create the schema and utterances for the app.

![](https://cldup.com/Kvgr5msBlw.png)

```javascript
{
	"intents": [
	  {
	    "intent": "PerformAction",
	    "slots": [
				{
				    "name": "Action",
				    "type": "LITERAL"
				}
			]
		}
	]
}
```

The utterances use a trick to support variable length utterances.  Hopefully this is something Amazon will address in the future.

```
PerformAction  {one| Action}
PerformAction  {one two| Action}
PerformAction  {one two three| Action}
PerformAction  {one two three four| Action}
```
You can use the default Parse ssl cert.

![](https://cldup.com/Y412vLyUrq.png)

### IFTTT

You need to configure the application to send emails from you in `cloud\config.js`.  Set the `emailFrom` option to match the address you use for IFTTT.  Then, you can setup an email trigger to use tags from your application.  

![](https://cldup.com/1AqCmVFL8l.png)

The tags that are passed through to IFTTT by the application are configured in `cloud\config.js` with the `supportedActions` options.  If you set `supportedActions` to `null` it will pass through all actions.  This example will take any phrase, lowercase it and remove spaces to use as a tag for IFTTT.  So something like "turn off" will pass through as "#turnoff".  With a bit of modification, you could support a tag and body for more complex IFTTT actions.

## TODO

This application does not validate the signature for the request to validate that it is actually from the Echo Cloud Service.  This is security by obscurity right now and signature validate needs to be added to any real application.

