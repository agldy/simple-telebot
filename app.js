process.env.NTBA_FIX_319 = 1;

require('dotenv').config();
const axios = require('axios').default;
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hey, can i help you?')
})

bot.onText(/\/calc/, (msg) => {
    const chatId = msg.chat.id;

    let txt = msg.text.split('/calc ');
    let txtInt = eval(txt[1])

    function calculator(hasil) {
        if (hasil != undefined) {
            bot.sendMessage(chatId, `Result ${hasil}`)
        } else {
            bot.sendMessage(chatId, 'Please send valid input')
        }
    }
    calculator(txtInt)
    console.log(`${txt[1]} = ${txtInt}`)
})

bot.onText(/\/weather/, (msg) => {

    const apiKey = process.env.weatherTOKEN;
    let city = msg.text.split('/weather ');
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city[1]}&appid=${apiKey}&units=metric&lang=id`

    axios.get(url)
        .then(function (response) {
            // handle success
            let result = response.data;
            let liveCuaca;

            if (result.weather[0].main == "Clouds") {
                liveCuaca = 'Berawan';
            } else (
                liveCuaca = result.weather[0].main
            );
            bot.sendMessage(msg.chat.id, `cuaca di <b>${result.name}</b> adalah ${liveCuaca} \ntemperature saat ini ${result.main.temp}° C\ntemprature minimal ${result.main.temp_min}° C\ntemprature maksimal ${result.main.temp_max}° C`, { parse_mode: 'HTML' })

        })
        .catch(function (error) {
            // handle error
            bot.sendMessage(msg.chat.id, `wah ada yang salah ${error}`);
        })
        .then(function () {
            // always executed
        });
})

bot.onText(/\/anime/, (msg) => {
    const chatId = msg.chat.id;
    const judulAnime = msg.text.split('/anime ');

    const api = `https://api.jikan.moe/v3/search/anime?q=${judulAnime[1]}`;
    axios.get(api)
        .then(response => {
            const result = response.data.results;
            bot.sendMessage(chatId, `Menampilkan hasil teratas`)

            bot.sendPhoto(chatId, result[0].image_url, { caption: `${result[0].title}\n\n${result[0].synopsis}\nType : ${result[0].type}\nScore : ${result[0].score}\nRated : ${result[0].rated}` });
        })
        .catch(error => {
            throw error;
        })
        .then(() => {
        })
});

//log any chat
bot.on('message', (msg) => {
    const dateReceived = (date) => {
        const finalDate = new Date(date * 1000);
        return humanDate = finalDate.toLocaleString();
    };
    bot.sendMessage(msg.chat.id, `User @${msg.from.username} mengirim ${msg.text} diterima pada ${dateReceived(msg.date)}`)
});