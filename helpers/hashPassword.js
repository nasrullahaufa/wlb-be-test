const bcrypt = require('bcrypt')

function hashPassword(plainPassword){
    return bcrypt.hashSync(plainPassword, 8)
}

module.exports = hashPassword