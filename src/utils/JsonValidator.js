var Validator = require('jsonschema').Validator;
var v = new Validator();

var subjectSchema = {
    "id": "/Subject",
    "type": "object",
    "properties": {
        "subject": {
            "code": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "maxProperties": 2,
            "required": ["code", "name"]
        }
    },
    "additionalProperties": false,
    "required": ["subject"]
};

var courseSchema = {
    "id": "/Course",
    "type": "object",
    "properties": {
        "course": {
            "code": {
                "type": "string",
                "pattern": "^[1-9][0-9]*$",
                "not" : {
                    "enum" : ["null", '']
                }
            },
            "subjectID": {
                "type": "integer",
                "pattern": "^[1-9][0-9]*$",
                "not" : {
                    "enum" : ["null", '']
                }

            },
            "capacity": {
                "type": "integer",
                "pattern": "^[1-9][0-9]*$",
                "not" : {
                    "enum" : ["null", '']
                }
            },
            "year": {
                "type": "integer",
                "pattern": "^[1-9][0-9]*$",
                "not" : {
                    "enum" : ["null", '']
                }
            },
            "quarter": {
                "type": "integer",
                "pattern": "^[1-9][0-9]*$",
                "not" : {
                    "enum" : ["null", '']
                }
            },
            "maxProperties": 6,
            "required": ["code", "subjectID", "capacity", "year", "quarter"]
        }
    },
    "additionalProperties": false,
    "required": ["course"]
};

var inscriptionSchema = {
    "id": "/Inscription",
    "type": "object",
    "properties": {
        "inscription": {
            "courseID": {
                "type": "integer",
                "pattern": "^[1-9][0-9]*$",
                "not" : {
                    "enum" : ["null", '']
                }

            },
            "studentCode": {
                "type": "string",
                "pattern": "^[1-9][0-9]*$",
                "not" : {
                    "enum" : ["null", '']
                }
            },
            "maxProperties": 2,
            "required": ["courseID", "studentCode"]
        }
    },
    "additionalProperties": false,
    "required": ["inscription"]
};

v.addSchema(subjectSchema, '/Subject');
v.addSchema(courseSchema, '/Course');
v.addSchema(courseSchema, '/Inscription');

exports.isCourseValid = function (req) {
  var valid = v.validate(req, courseSchema);
  return valid.errors.length == 0;
}

exports.isSubjectValid = function (req) {
    var valid = v.validate(req, subjectSchema);
    return valid.errors.length == 0;
}

exports.isInscriptionValid = function (req) {
    var valid = v.validate(req, inscriptionSchema);
    return valid.errors.length == 0;
}

