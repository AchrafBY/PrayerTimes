const text = document.querySelector('h2');
const nameP = document.querySelector('.nom');
const infonom = document.querySelector('.infonom');
const infotemps = document.querySelector('.infotemps');

const infotempsfajr = document.querySelector('.timeprayerfajr');
const infotempsdhuhr = document.querySelector('.timeprayerdhohr');
const infotempsasr = document.querySelector('.timeprayerasr');
const infotempsmaghrib = document.querySelector('.timeprayermaghrib');
const infotempsisha = document.querySelector('.timeprayerisha');

const actualTime = document.querySelector(".time");
const actualDateC = document.querySelector(".dateC");
const actualDateH = document.querySelector(".dateH");

TempsProchainePreière = ""

function getDateFromHours(time) {
    time = time.split(':');
    let now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...time).getTime();
}

function getFirstPositivePos(array) {
    var i =-1
    for (let i = 0; i < array.length; i++) {
        if(array[i] > 0){
            return i;
            break;
        }
    }
    return i;
}

function getDiffTimes(dictTimes) {
    const d = new Date()
    var hours = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    const diffs = []
    for(const time in dictTimes) {
        diffs.push(getDateFromHours(dictTimes[time]+":00") - getDateFromHours(hours))
    }
    return getFirstPositivePos(diffs)
} 

function getNext(dictTimes) {
    var indexNext = getDiffTimes(dictTimes)
    if (indexNext == -1){
        indexNext = 0
        FlagInvere = true;
    }
    return Object.keys(dictTimes)[indexNext]
}

function changeBgColor(id) {
    document.getElementById(id).style.backgroundColor = "#099b04";
}

async function load() {
    let url = 'https://api.pray.zone/v2/times/today.json?city=Joinville-Le-Pont';
    let obj = await (await fetch(url)).json();
    var infodate = obj.results.datetime[0];
    var infoloc = obj.results.location
    const times = infodate.times
    console.log(infodate.date)
    const sunrise = infodate.times["Sunrise"]

    delete times["Midnight"];
    delete times["Sunset"];
    delete times["Imsak"];
    delete times["Sunrise"];

    var nameNextPrayer = getNext(times)
    var timeNextPrayer = times[nameNextPrayer]
    TempsProchainePreière = timeNextPrayer + ":00"
    // TempsProchainePreière = "17:00:00"

    nameP.innerText = nameNextPrayer
    infonom.innerText = nameNextPrayer
    infotemps.innerText = timeNextPrayer

    infotempsfajr.innerText = times["Fajr"]
    infotempsdhuhr.innerText = times["Dhuhr"]
    infotempsasr.innerText = times["Asr"]
    infotempsmaghrib.innerText = times["Maghrib"]
    infotempsisha.innerText = times["Isha"]

    // actualTime.innerText = `${}`
    actualDateC.innerText = infodate.date.hijri
    actualDateH.innerText = infodate.date.gregorian
    changeBgColor(nameNextPrayer);

    // console.log(TempsProchainePreière)
}

// const infos = load()[0];
// const infos1 = load()[1];

function getChrono(){
    load()
    const now = new Date().getTime();
    const countdownDate = getDateFromHours(TempsProchainePreière);

    const distanceBase = countdownDate - now;

    const hours = Math.floor((distanceBase % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distanceBase % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distanceBase % (1000 * 60)) / 1000);

    text.innerText = `${hours}h ${minutes}m ${seconds}s`;

}

getChrono()

const countDownInterval = setInterval(() => {

    getChrono()

}, 1000);
