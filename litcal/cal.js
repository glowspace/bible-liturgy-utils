const Romcal = require('romcal')
const { CzechRepublic_Cs } = require('@romcal/calendar.czech-republic')
const ReadingIndex = require('./parse')

const csRomcal = new Romcal({
    localizedCalendar: CzechRepublic_Cs
})

const idx = new ReadingIndex()

function getReadingCycle(item) {
    const abc = item.cycles.sundayCycle // "YEAR_C"
    const weekday = item.cycles.weekdayCycle // "YEAR_2"

    // returns c2
    return abc.slice(-1).toLowerCase() + weekday.slice(-1)
}

function getReadings(item) {
    const cycle = getReadingCycle(item)
    let objs = idx.getReading(item.key)
    if (objs == null)
        return [{
            key: item.key
        }]

    return objs.map(obj => {
        obj.firstReading = obj.firstReading[cycle]
        obj.psalm = obj.psalm[cycle]
        obj.secondReading = obj.secondReading[cycle]
        return obj
    })
}

module.exports = {
    csRomcal,
    getReadings
}