var Validator = require('jsonschema').Validator;
var v = new Validator();

var userProfileSchema = {
    "id": "/UserProfile",
    "type": "object",
    "properties": {
        "userProfile": {
            "fbId": {
                "type": "string"
            },
            "Name": {
                "type": "string"
            },
	   "Occupation": {
                "type": "string"
            },
	    "Education": {
                "type": "string"
            },
	    "Comments": {
                "type": "string"
            },
	    "Birthdate": {
                "type": "string"
            },
	    "Sex": {
                "type": "string"
            },
	    "Notifications":{
		"type": "number"
	     },
	      "Invisible":{
		"type": "number"
	     },
	     "accountType":{
		"type": "string"
	     },
	     "Images" : [{"Image":{
            "maxProperties": 3,
            "required": ["Id", "Order","Data"]}}],
            "Interests":[{"Interest":{"maxProperties":1,"required":["name"]}}],
	    "Settings":{"maxRange":{"type":"number"},"minAge":{"type":"number"},"onlyFriends":{"type":"number"},
			"searchMales":{"type":"number"},"searchFemales":{"type":"number"},"searchSheMales":{"type":"number"},
                        "location": [{"lon" : {"type":"number"},"lat" : {"type":"number"}}]}

        }
    },
    "additionalProperties": false,
    "required": ["subject"]
};

v.addSchema(userProfileSchema, '/UserProfile');

exports.isUserProfileValid = function (req) {
  var valid = v.validate(req, userProfileSchema);
  return valid.errors.length == 0;
}
