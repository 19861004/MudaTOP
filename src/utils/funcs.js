const fs = require('fs');

const delay = ms => new Promise(res => setTimeout(res, ms));

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
};

function getTime() {
    var d = new Date();
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());

    return h + ':' + m + ':' + s + ' | ';
};

function countLine(file) {
    lineN = 0;
    var lines = fs.readFileSync(file, 'UTF8').split('\n');
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].length > 0) lineN++;
    };
    return lineN;
};

function checkDel(file) {
    if (fs.existsSync(file)) {
        fs.unlink(file, (err) => {
            if (err) throw err;
            console.log(getTime() + 'Deleted existing ' + file);
        });
    };
};

module.exports = {
    delay: delay,
    countLine: countLine,
    checkDel: checkDel,
    getTime: getTime,
};