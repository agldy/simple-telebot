process.env.NTBA_FIX_319 = 1;


const fs = require('fs');
require('dotenv').config();
const axios = require('axios').default;
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Hey, can i help you?', {
        "reply_markup": {
            "keyboard": [['Weather Check', 'Simple calculator'], ['Get anime info']]
        }
    })

})

bot.onText(/\/calc/, (msg) => {
    const chatId = msg.chat.id;

    let txt = msg.text.split('/calc ');
    let txtInt = eval(txt[1])

    function calculator(hasil) {
        if (hasil != undefined) {
            bot.sendMessage(chatId, `result <b>${hasil}</b>`, { parse_mode: 'HTML' })
        } else {
            bot.sendMessage(chatId, 'Please send valid input')
        }
    }
    calculator(txtInt)
})

bot.onText(/\/weather/, (msg) => {

    const apiKey = process.env.weatherTOKEN;
    let city = msg.text.split('/weather ');
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city[1]}&appid=${apiKey}&units=metric&lang=id`


    axios.get(url)
        .then(function (response) {
            // handle success
            let result = response.data;

            bot.sendMessage(msg.chat.id,
                `cuaca di <b>${result.name}, ${result.sys.country}</b>   adalah ${result.weather[0].main} \ntemperature saat ini ${result.main.temp}° C\ntemprature minimal ${result.main.temp_min}° C\ntemprature maksimal ${result.main.temp_max}° C`,
                { parse_mode: 'HTML' })
        })
        .catch(function (error) {
            // handle error
            bot.sendMessage(msg.chat.id, `wah ada yang salah ${error}`);
        })
        .then(function () {
            // always executed
        });
})

//anime check
bot.onText(/\/anime/, (msg) => {
    const chatId = msg.chat.id;
    const judulAnime = msg.text.split('/anime ');

    const api = `https://api.jikan.moe/v3/search/anime?q=${judulAnime[1]}`;
    axios.get(api)
        .then(response => {
            const result = response.data.results[0];
            bot.sendMessage(chatId, `Menampilkan hasil teratas`)

            bot.sendPhoto(chatId, result.image_url, {
                caption: `<b>${result.title}</b>\n\n${result.synopsis}    \n\nType : ${result.type}\nScore : ${result.score}\nRated : ${result.rated}\n\n<a href="${result.url}">Detail</a>`
                , parse_mode: 'HTML'
            });
            console.log(result);
        })
        .catch(error => {
            throw error;
        })
        .then(() => {
        })
});

//log any chat
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const dateReceived = (date) => {
        const finalDate = new Date(date * 1000);
        return humanDate = finalDate.toLocaleString();
    };
    // fs
    // bot.sendMessage(578554465, `User @${msg.from.username} mengirim ${msg.text} diterima pada ${dateReceived(msg.date)}`)

    fs.writeFile('./chat.log', `\n[${dateReceived(msg.date)}] User @${msg.from.username} mengirim "${msg.text}"`, { flag: 'a+' }, err => { })

    if (msg.text.toString().toLowerCase().includes('weather check')) {
        bot.sendMessage(chatId, 'USAGE :\n/weather [city  name]. ex: /weather jakarta')
    } else if (msg.text.toString().toLowerCase().includes('simple calculator')) {
        bot.sendMessage(chatId, 'USAGE :\n/calc [number]. ex: /calc 29 * 29')
    } else if (msg.text.toString().toLowerCase().includes('get anime info')) {
        bot.sendMessage(chatId, 'USAGE :\n/anime [title]. ex: /anime naruto')
    }
});