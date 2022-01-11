const Romcal = require('romcal')
const { CzechRepublic_Cs } = require('@romcal/calendar.czech-republic')

cal = new Romcal({
    localizedCalendar: CzechRepublic_Cs
})

// cal.generateCalendar(2019).then(data => {
//     for (const date in data) {
//         if (true) {
//             console.log(data[date].map(ld => `${ld.date} : ${ld.key}`))
//         }
//     }
// })