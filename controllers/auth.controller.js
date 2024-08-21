const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { findUserByEmail, createUser } = require('../models/user.model');
const dotenv = require('dotenv');
const secret = process.env.JWT_SECRET;

exports.register = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = findUserByEmail(email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = await createUser(email, name, password);
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, secret, { expiresIn: '1h' });
    res.status(201).json({ token });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = findUserByEmail(email);
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '1h' });
    res.status(200).json({ token });
};