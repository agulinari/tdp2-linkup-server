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

*/
const UserProfileSchema = new Schema({
  fbId: String,
  Name: String,
  Occupation: String,
  Education: String,
  Comments: String,
  Birthdate: String,
  Sex: String, //Male: M, Female: F, SheMale: FM
  Notifications: Number, //True: 1, False: 0
  Invisible: Number, //True: 1, False: 0
  accountType: String, //Value: Premium or Basic
  Images: [{ Image: { Id: String, 
		      Order: Number, 
		      Data: String //Data persist an String and this convert to base 64
		    }}],
  Interests : [{ "Interest" : {name: String}}],// Falta ver como es la estructura de los intereses que devuelve la api de facebook
  Settings: {maxRange : Number,
	     minAge: Number,
	     maxAge: Number,
             onlyFriends: Number, //True: 1, False: 0
	     searchMales: Number, //True: 1, False: 0
	     searchFemales: Number, //True: 1, False: 0
	     searchSheMales: Number, //True: 1, False: 0
             location: [{lon : {type:Number},
			 lat : {type:Number}}]}
},{ collection: 'usersProfile' });

// make this available to our users in our Node applications
module.exports = mongoose.model("UserProfile", UserProfileSchema);
