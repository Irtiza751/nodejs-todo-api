const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
  registerUser: async (req, res) => {
    try {
      const image = btoa(String.fromCharCode.apply(null, new Uint8Array(req.file.buffer)));
      console.log(req.file.toString());
      const user = new User({...req.body, avatar: image});

      await user.save();
      res.status(201).json(user);
    } catch (error) {
      // console.log(error.message);
      res.status(400).json({ msg: error.message });
    }
  },

  loginUser: async (req, res) => {
    try {
      const user = await User.findByCredentials(req.body.email, req.body.password);
      const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "7d" });
      user.token = token;

      res.status(201).json(user);
    } catch (error) {
      res.status(401).json({ msg: error.message });
    }
  },

  logoutUser: async (req, res) => {
    try {
      const dbRes = await User.updateOne(
        { _id: req.userId }, { $unset: { token: 1 } }
      );

      if (!dbRes.acknowledged) {
        res.json({ msg: 'You are unauthorize!' });
      }

      res.json({ msg: 'You are loged out' });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },

  updateProfile: async (req, res) => {
    const validFields = ['username', 'email', 'profile'];
    const updates = Object.keys(req.body)
    const fieldsAreValid = updates.every(field => validFields.includes(field));

    try {
      if (!fieldsAreValid) {
        throw new Error('You entered invalid field');
      }

      const user = await User.findById(req.userId);
      updates.forEach(update => user[update] = req.body[update]);

      await user.save();
      res.json({ msg: 'Profile successfully updated!' });
    } catch (error) {
      res.status(401).json({ msg: error.message });
    }
  },

  getProfile: async (req, res) => {
    try {
      const user = await User.findById({ _id: req.userId })
      const { username, email, avatar } = user;
      res.json({ username, email, avatar });
    } catch (error) {
      res.status(400).json({ msg: 'Something went wrong.' })
    }
  },

  deleteUser: async (req, res) => {
    try {
      await User.deleteOne({ _id: req.userId });

      res.json({ msg: 'Your account is deleted successfully!' });
    } catch (error) {
      res.status(400).json({ msg: 'something went wrong!' });
    }
  }
}