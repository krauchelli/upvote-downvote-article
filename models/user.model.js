const bcrypt = require('bcrypt');
const path = require('path');
const { readData } = require('../utils/readData');
const { writeData } = require('../utils/writeData');
const userDataPath = path.join(__dirname, '../data/users.json');

const getAllUsers = () => readData(userDataPath);

const saveAllUsers = (users) => writeData(userDataPath, users);

exports.findUserByEmail = (email) => {
    const users = getAllUsers();
    return users.find(user => user.email === email);
};

exports.createUser = async (email, username, password) => {
    const users  = getAllUsers();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: `${users.length + 1}UU${Date.now()}`,
        email,
        username,
        password: hashedPassword
    };
    users.push(newUser);
    saveAllUsers(users);
    return newUser;
}