const API_URL_ENDPOINT = "https://api.weather.gov/products/types/CWF/locations/SGX/latest";
const HEADERS = [
    '.TODAY...',
    '.TONIGHT...',
    '.SUN...',
    '.SUN NIGHT...',
    '.MON...',
    '.MON NIGHT...',
    '.TUE...',
    '.TUE NIGHT...',
    '.WED...',
    '.WED NIGHT...',
    '.THU...',
    '.THU NIGHT...',
    '.FRI...',
    '.FRI NIGHT...',
    '.SAT...',
    '.SAT NIGHT...',
];

function messageParser(text) {
    const WAVE_DETAIL = 'Wave';
    const END_OF_STATEMENT = '.';

    const report = [];
    text = text.replaceAll('\n', ' ');

    for (let i = 0; i < HEADERS.length; i++) {
        const dailyReport = [];
        const headerIndex = text.indexOf(HEADERS[i]) //+ HEADERS[i].length;
        dailyReport.push(
            text.slice(headerIndex, text.indexOf(WAVE_DETAIL, headerIndex) - 1));
        dailyReport.push(
            text.slice(text.indexOf(WAVE_DETAIL), 
                text.indexOf(END_OF_STATEMENT, text.indexOf(WAVE_DETAIL)) + 1));
        report.push(dailyReport);
    }

    return report.filter(value => value[0].length < 100 && value[0].length != 0);
}

let message;
fetch(API_URL_ENDPOINT)
    .then(response => response.json())
    .then(data => {
        message = data["productText"];
        console.log(messageParser(message));
        // console.log(message);
    })