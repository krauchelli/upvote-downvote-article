const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { findUserByEmail, createUser } = require('../models/user.model');
const dotenv = require('dotenv');
dotenv.config();
const secret = process.env.JWT_SECRET;

exports.register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const newUser = await createUser(email, name, password);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await findUserByEmail(email);
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const accessToken = jwt.sign({ id: user.id, email: user.email, username: user.username }, secret, { expiresIn: '15m' });
        // const refreshToken = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '7d' });
        // user.push(refreshToken);
        // user.save();
        res.status(200).json({ message: 'Logged in successfully', Token: accessToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        // const { id } = req.params;
        // const user = await findUserById(id);
        // user.refreshToken = null;
        // user.save();
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};