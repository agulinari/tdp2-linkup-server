var config = require('../../package.json');

//Retrieves Metadata
exports.getMetadata = function (size) {
	var data = {
		version: config.version,
		count: size
	};
	return data;
};

exports.isNormalInteger = function (number) {
  return /^(0|[1-9]\d*)$/.test(number);
}

//used for finding the correct element in an array of elements in the result of xml2js
exports.search = function (searchfor, array) {
    //console.log('Search called with array: '+array.length+' looking for: '+searchfor);
    for (key in array) {
        //console.log('Key: ' + key + ' Value: ' + JSON.stringify(array[key]));
        //console.dir(array[key]);
        if (array[key][searchfor] != undefined) {
            //console.log('Returning: '+JSON.stringify(array[key][searchfor]));
            return array[key][searchfor];
        }
    }
    return null;
}

