require('./db');

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;



/**
 * UserProfile Schema
 

UserProfile{

fbId: string,
Name: string,
Occupation: 
Education:
Comments:
Birthdate: ‘YYYY-MM-DD’,
Sex: ‘M’ or ‘F’,
Notifications : ‘true’ or ‘false’,
Invisible: ‘true’ or ‘false’,
accountType : ‘Premium’ or ‘Basic’,
Images : [
	Image: {
Id: string,
Order: int,
Data: base64
	},...
],
Interests:[
	Interest:{
		//Ver que devuelve facebook
	},...
],
Settings: {
	maxRange : int,
	minAge: int,
	maxAge: int,
	onlyFriends: ‘true’ or ‘false’,
	searchMales: ‘true’ or ‘false’,
	searchFemales: ‘true’ or ‘false’,
	searchSheMales : ‘true’ or ‘false’,	
	location:[lat: double, long: double]
}

}

{"birthday":"01/04/1983","comments":"","education":"Universidad de Buenos Aires","fbid":"10214664566027711","firstName":"Agustín","gender":"male","images":[{"image":"/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQOe\nEZtRvtB0j4kfE2Fp7bx58QU1iTw0/iHRdBsV+zReHoQ6vJyGKHNcNet7dPB2enKnJu1kpJpK26fN\nd9b8tpaNv5PHVnXxUvq+kkktXa65pa2tb+XRuz6rc//Z\n","order":0}],"interests":[],"lastName":"Linari","occupation":"","settings":{"invisible":false,"maxAge":85,"maxDistance":97,"minAge":58,"notifications":true,"onlyFriends":false,"searchFemales":false,"searchMales":true}}

*/
const UserProfileSchema = new Schema({
  birthday: String,
  comments: String,
  education: String,
  fbid: String,
  firstName: String,
  gender: String, //Male: M, Female: F, SheMale: FM
  images: [{"image": String, 
	    "order": Number }],
  interests : [{ "interest" : String}],// Falta ver como es la estructura de los intereses que devuelve la api de facebook
  lastName: String,
  occupation: String,
  settings: {
	     fbid: String,
             invisible: {type: Boolean}, //True: 1, False: 0
	     maxRange : Number,
	     maxAge: Number,
             maxDistance : Number,
	     minAge: Number,
	     accountType: {type: String, default: "Basic"},
	     notifications: {type: Boolean}, //True: 1, False: 0
             onlyFriends: {type: Boolean}, //True: 1, False: 0
	     searchMales: {type: Boolean}, //True: 1, False: 0
	     searchFemales: {type: Boolean} //True: 1, False: 0
	     }
},{ collection: 'usersProfile' });

// make this available to our users in our Node applications
module.exports = mongoose.model("userProfile", UserProfileSchema);
