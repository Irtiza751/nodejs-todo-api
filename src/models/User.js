const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const Task = require('./Task');
const { AES, enc } = require('crypto-js');

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
    avatar: { type: String, required: false },
    token: { type: String },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    const user = this;
    user.token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    // only change the hash after the user update his/her password.
    if (user.isModified('password')) {
        //const hashPassword = await bcrypt.hash(user.password, 8);
        const hashPassword = AES.encrypt(user.password, process.env.JWT_SECRET).toString();
        user.password = hashPassword;
    }
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
    // const isValidPass = await bcrypt.compare(password, user.password);
    const decryptPass =
        AES.decrypt(user.password, process.env.JWT_SECRET)
        .toString(enc.Utf8);

    const isValidPass = decryptPass === password;

    console.log(isValidPass);
    if (!isValidPass) {
        throw new Error('Invalid Crendentials')
    }
    return user;
}

UserSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
})

module.exports = mongoose.model('User', UserSchema);
