const bcrypt = require('bcrypt');

function hashPassword(password) {
    let salt = bcrypt.genSaltSync(10);
    console.log('mostar ' + salt)
    return bcrypt.hashSync(password, salt);
  }
function comparePassword(inputPass, hashedPass) {
    return bcrypt.compareSync(inputPass, hashedPass);
  }
  
  
module.exports = {
    hashPassword,
    comparePassword
  }
  