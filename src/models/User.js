const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate: function (input) {
            if(!validator.isEmail(input)) {
                throw new Error('email is not valid')
            }
        }
    },
    password: { type: String, required: true },
}, { timestamps: true });

UserSchema.pre('save', async function() {
    const user = this;
    const hashPassword = await bcrypt.hash(user.password, 8);
    user.password = hashPassword;
    console.log(user);
});

module.exports = mongoose.model('User', UserSchema);