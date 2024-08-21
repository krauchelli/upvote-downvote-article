const fs = require('fs');

exports.writeData = (dataPath, data) => {
    const stringifyData = JSON.stringify(data);
    fs.writeFileSync(dataPath, stringifyData);
}