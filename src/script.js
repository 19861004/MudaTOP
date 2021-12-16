const Discord = require('discord.js');
const fs = require('fs');
const schedule = require('node-schedule');

const config = require('./config.json');
const parser = require('./utils/parser.js');
const funcs = require('./utils/funcs.js');
const client = new Discord.Client();

var tm;

client.on('ready', () => {
    clearTimeout(tm);
    console.log(`Logged in as ${client.user.tag}!`);
    task();
    tm = setTimeout(() => {
        resetTask();
        return;
    }, 1000 * 60 * 10);
});

client.on('message', msg => {
    if (msg.channel.id === config.channel_id && msg.author.id === config.bot_id && msg.content.startsWith('Give me the permission')) {
        msg.delete();
        return;
    };
});

function afterTask() {
    console.log(funcs.getTime() + 'Started parsing.');
    parser.names('./files/temp.txt', './files/top.json');

    setTimeout(() => client.destroy(), 10000)
    clearTimeout(tm);
    return;
};

async function resetTask() {
    if (client.uptime === null) {
        return;
    };

    var channel = client.channels.get(config.channel_id);
    channel.send('.prune 10');

    await client.destroy();;
    client.login(config.token);
    return;
};

async function task() {
    funcs.checkDel('./files/temp.txt');

    var channel = client.channels.get(config.channel_id);
    const collector = new Discord.MessageCollector(channel, m => m.author.id === config.bot_id && m.embeds[0] !== undefined, { max: 135, time: 1000 * 60 * 10 });

    collector.on('collect', message => {
        var embed = message.embeds[0];
        if (embed.footer === undefined || !embed.footer.text.includes(' / 67')) {
            collector.stop();
            return;
        };
        setTimeout(() => {
            fs.appendFile('./files/temp.txt', embed.description.replaceAll('**', '') + '\n', (err) => {
                if (err) throw err;
                console.log(funcs.getTime() + 'Appended data to temp file.');
                setTimeout(() => message.delete(), 6000);
            });
        }, 1000);
    });

    for (let i = 1; i < 68; i++) {
        await channel.send('$top ' + i).then(tmsg => {
            console.log(funcs.getTime() + 'Sent $top ' + i + '.');
            setTimeout(() => tmsg.delete(), 7000);
        });
        await funcs.delay(5000);
    };

    collector.stop();
    afterTask();
};

switch (config.mode) {
    case 'start':
        console.log(funcs.getTime() + 'Non-task mode.');
        client.login(config.token);
        break;
    case 'task':
        console.log(funcs.getTime() + 'Task mode.');
        var sch = schedule.scheduleJob('00 */4 * * *', function () {
            console.log(funcs.getTime() + 'Starting task...');
            client.login(config.token);
        });
        break;
    default:
        console.log('Wrong mode.');
        return;
};
