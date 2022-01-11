const fs = require('fs');
const { parseEuropean } = require('../bible/wrapper.js');

class DayReading {
    constructor(data) {
        this.czechName = data[0]
        this.id = data[1]

        const getReadingData = offset => ({
            a1: data[offset],
            a2: data[offset + 1],
            b1: data[offset + 2],
            b2: data[offset + 3],
            c1: data[offset + 4],
            c2: data[offset + 5]
        })

        this.firstReading = getReadingData(2)
        this.psalm = getReadingData(8)
        this.secondReading = getReadingData(14)
    }

    references() {
        return [
            ...Object.values(this.#references_map('firstReading')), 
            ...Object.values(this.#references_map('psalm')),
            ...Object.values(this.#references_map('secondReading'))
        ]
    }

    #references_map(reading_id) {
        const reading_obj = this[reading_id]
        const map = {}
        for (const reference of Object.values(reading_obj)) {
            map[reference] = {
                reading: reading_id, // 'psalm'
                cycles: [],
                reference_obj: parseEuropean(reference),
                reference: reference
            }
        }

        for (const key of Object.keys(reading_obj)) {
            const reference = reading_obj[key]
            map[reference].cycles.push(key)
        }

        return map
    }
}

class ReadingIndex {
    constructor(filename = 'readings.tsv') {
        const readings = fs
            .readFileSync(filename, 'utf8')
            .split('\n')
            .map(line => new DayReading(line.split('\t')))

        this.index = {}
        for (const reading of readings) {
            this.index[reading.id] = reading
        }
    }

    getReading(id) {
        return this.index[id]
    }
}

let index = new ReadingIndex('readings.tsv')

console.log(index.getReading('ordinary_time_12_sunday').references())