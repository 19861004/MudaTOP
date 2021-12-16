const fs = require('fs');
const git = require('simple-git');
const funcs = require('./funcs.js');

function names(input, output) {
    var nsource = fs.readFileSync(input).toString().trim();
    var nresult = nsource.split('\n').splice(1);

    var json = [];
    nresult.forEach(function (line) {
        var data = line.toString().split(' - ');
        var rank = parseInt(data[0].substr(1));
        var name = data[1];
        json.push({
            "name": name,
            "rank": rank
        });
    });

    fs.writeFile(output, JSON.stringify(json, null, 1), (err) => {
        if (err) throw err;
        console.log(funcs.getTime() + 'Successfully wrote top.json file.');

        git().add('./*')
            .commit(funcs.getTime() + 'updated.')
            .push(['-u', 'origin', 'master'], () => console.log(funcs.getTime() + 'Uploaded to GitLab.'));

        setTimeout(() => {
            fs.unlinkSync('./files/temp.txt');
            console.log(funcs.getTime() + 'Deleted input.txt.');
            console.log(funcs.getTime() + 'Finished task.');
            return;
        }, 10000);
    });
};

module.exports = {
    names: names
};
