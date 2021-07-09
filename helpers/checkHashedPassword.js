const bcrypt = require('bcrypt')

function checkPassword(plainPassword, encryptedPassword){
    return bcrypt.compareSync(plainPassword, encryptedPassword)
}

module.exports = checkPassword