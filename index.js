const bible = require('./bible/wrapper')
const liturgy = require('./litcal/cal')

// cal.generateCalendar().then(data => {
//     // const items = data['2022-01-20']
//     // console.log(items.flatMap(getReadings))
// });

liturgy.csRomcal.getOneLiturgicalDay('pentecost_sunday').then( data => {
    const readings = liturgy.getReadings(data) 
    console.log(readings)
    // console.log(readings[0].references())
})

// console.log(bible.parseEuropean('Žl 104,1-2a.24+35c.27-28.29bc-30 (příp. Žl 33,10-11.12-13.14-15, Žl 19,8.9.10.11, Žl 107,2-3.4-5.6-7.8-9)').toString())