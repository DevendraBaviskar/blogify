const JWT = require("jsonwebtoken");
const secret = "Devabaviskar123";

// 🟥
//First time create a token for user
function createTokenForUser(user) {
  const payload = {
    //create a payload which has all the data of user while creating a JWT token
    id: user._id,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };
  //*Create a newly token which has all data from payload & secret key.
  const token = JWT.sign(payload, secret); //create token which has userData and secret key which is secret , which this key we can't access the userData
  return token; //return token which has user in it which all the data like a payload object in above side id, email etc
}

// 🟥
//verify the token
function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload; //return that payload which is token and in token we have a userData like id, email, profileImage, role etc
}

//exports
module.exports = {
  createTokenForUser, //first time created token
  validateToken, //checked is token validate or expired
};
