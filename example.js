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
    const today = data[todayString()].flatMap(liturgy.getReadings)
    console.log(today)
    console.log(getOsisForDay(today))
})

liturgy.csRomcal.getOneLiturgicalDay('pentecost_sunday').then( data => {
    const readings = liturgy.getReadings(data) 
    console.log(readings)
    console.log(getOsisForDay(readings))
})