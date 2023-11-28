const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: {type: String},
    lastName: {type: String},
    cel: {type: String},
    birthdate: {type: String},
    email: {type: String},
    password: {type: String},
    numId: {type: String},
    address: {type: String},
}, {
    timestamps: true
});

UserSchema.methods.encrypPassword = async password => {
    const salt = await bcrypt.genSalt(10);
     return await bcrypt.hash(password, salt);
};

UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = model('User', UserSchema);