const Discord = require('discord.js');
const axios = require('axios');
const client = new Discord.Client();
require('dotenv').config();


const time  = Math.floor(new Date() / 1000) - 259200

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong')
    }
});


client.on('message', msg => {
    axios.get('https://api-v3.igdb.com/pulses', 
    {
        data: 'fields *; where published_at >' + time + "; sort published_at asc;'",
        headers: {
            'user-key': process.env.API_KEY,
            Accept: 'application/json'
        }
    }).then(res => {
        if (msg.content === '!news'){
            const info = res.data
            let summaries = ""
            for (var i = 0; i < 4; i++){
                summaries += '\nArticle ' + i + ' Title: ' + info[i].title + '\n'
                summaries += 'Summary: ' + info[i].summary + '\n ------------------------------ \n'
                axios.get('https://api-v3.igdb.com/pulse_urls',
                {
                    data: 'fields *; where id = ' + info[i].website + ";'",
                    headers: {
                        'user-key': process.env.API_KEY,
                         Accept: 'application/json'
                    }
                }).then(result => {
                    console.log(result.data[0].url)
                    summaries += 'URL for these articles: ' +  result.data[0].url + '\n'
                    msg.reply(summaries)
                    summaries = ""
                })
                
            }

        }
        
    })
})


client.login(process.env.BOT_TOKEN)