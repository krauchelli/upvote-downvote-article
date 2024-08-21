const fs = require('fs');

exports.readData = (dataPath) => {
    const data = fs.readFileSync(dataPath, 'utf8');

    return JSON.parse(data);
};