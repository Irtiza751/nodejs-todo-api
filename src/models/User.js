const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate: function (input) {
            if (!validator.isEmail(input)) {
                throw new Error('email is not valid')
            }
        }
    },
    password: { type: String, required: true },
    token: {
        type: String,
    }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    const user = this;
    user.token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    const hashPassword = await bcrypt.hash(user.password, 8);
    user.password = hashPassword;
    next();
});

UserSchema.statics.findByCredentials = async function (email, password) {
    // find user by email
    const user = await this.findOne({ email });
    // check if user exists
    if (!user) {
        throw new Error('User not Found!')
    }
    // check if the password is valid
    const isValidPass = await bcrypt.compare(password, user.password);
    if (!isValidPass) {
        throw new Error('Invalid Crendentials')
    }
    return user;
}

module.exports = mongoose.model('User', UserSchema);
