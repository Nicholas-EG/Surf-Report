/**
 * Produces an array of daily wave conditions. Each entry corresponds to both 
 * a day, and the daytime/nighttime wave conditions.
 * 
 * @param {string} text The productText of the NWS Wave Report API response. 
 * @returns The Wave Detail portion of the NWS Wave Report as an array
 */
function messageParser(text) {
    if (typeof text !== 'string') {
        throw new TypeError("function expects arg to be a string.");
    }

    const WAVE_DETAIL = 'Wave';
    const END_OF_STATEMENT = '.';
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

async function getData() {
    const API_URL_ENDPOINT = "https://api.weather.gov/products/types/CWF/locations/SGX/latest";
    const response = await fetch(API_URL_ENDPOINT);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    const message = data["productText"];
    console.log(messageParser(message)[0]);
}

/** MAIN */
getData();