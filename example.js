const bible = require('./bible/bible')
const liturgy = require('./litcal/litcal')

function todayString() {
    const today = new Date()
    return today.toISOString().slice(0, 10)
}

function getOsisForDay(readings) {
    return readings
        .flatMap(r => [r.firstReading, r.psalm, r.secondReading])
        .map(bible.parseEuropean)
        .map(x => x.toString())
        .filter(x => x.length > 0)
        .join(',')
}


liturgy.csRomcal.generateCalendar().then(data => {
    let lit_events = data['2022-11-10']
    for (const event of lit_events) {
        if (event.weekday && !lit_events.map(e => e.key).includes(event.weekday.key)) {
            lit_events.push(event.weekday)
        }
    }

    console.log(lit_events.map(e => e.key))

    const today = lit_events.flatMap(liturgy.getReadings)
    console.log(today)
    console.log(getOsisForDay(today))
})

// liturgy.csRomcal.getOneLiturgicalDay('ordinary_time_3_wednesday').then( data => {
//     const readings = liturgy.getReadings(data) 
//     console.log(readings)
//     console.log(getOsisForDay(readings))
// })