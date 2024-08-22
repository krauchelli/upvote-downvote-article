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
        console.log(`New user: ${JSON.stringify(newUser)}`);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Email: ${email}, Password: ${password}`);
        
        const user = await findUserByEmail(email);
        console.log(`User: ${JSON.stringify(user)}`);
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password match: ${isMatch}`);
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const accessToken = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '15m' });
        // const refreshToken = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '7d' });
        // user.push(refreshToken);
        // user.save();
        res.status(200).json({ message: 'Logged in successfully', Token: accessToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};