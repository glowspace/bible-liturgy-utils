'use strict';

const books_cs = require("./cs_books.js")
const bcv_parser = require("./cs_bcv_parser.js").bcv_parser

// --- helper functions ---
const cv_cmp = (cv1, cv2) => {
    if (cv1.c > cv2.c) return 1;
    if (cv1.c < cv2.c) return -1;
    // chapter == chapter case
    if (cv1.v > cv2.v) return 1;
    if (cv1.v < cv2.v) return -1;
    // verse == verse
    return 0;
}
const isBetween = (target, start, end) => cv_cmp(target, start) >= 0 && cv_cmp(target, end) <= 0;
const endsWithinSameBook = e => e.start.b === e.end.b;
const matchesBook = (e1, e2) => e1.start.b === e2.start.b;
const matchesRange = (e1, e2) => isBetween(e2.start, e1.start, e1.end) || isBetween(e2.end, e1.start, e1.end) || isBetween(e1.start, e2.start, e2.end);

// -- functions  for extending the bcv_parser.bcv_obj ---
function toCzechStrings() {
    const entities = this.parsed_entities()[0]?.entities || []

    const czechBookName = e => books_cs[e.start.b];
    const verseRange = e => {
        if (cv_cmp(e.start, e.end) === 0 ) {
            return e.start.c + ', ' + e.start.v; // Lk 2, 3
        }
        if (e.start.c == e.end.c) {
            return e.start.c + ', ' + e.start.v + '-' + e.end.v; // Lk 2, 3-5
        }
        return e.start.c + ',' + e.start.v + ' - ' + e.end.c + ',' + e.end.v; // Lk 2,3 - 3,10
    }

    return entities.map(e => czechBookName(e) + ' ' + verseRange(e));
}

function intersectsWith(other_bcv_obj) {
    const entities_1 = this.parsed_entities()[0]?.entities || []
    const entities_2 = other_bcv_obj.parsed_entities()[0]?.entities || []
    
    for (const ent_1 of entities_1) {
        if (!endsWithinSameBook(ent_1)) {
            throw new Exception('Start book and End book must match!')
        }

        // todo: check for endsWithinSameBook?
        return entities_2.some(ent_2 => matchesBook(ent_1, ent_2) && matchesRange(ent_1, ent_2))
    }

    return false
}

// -- extending -- 
bcv_parser.prototype.parse_extended = function (str) {
    let parsed = this.parse(str)
    parsed.toCzechStrings = toCzechStrings
    parsed.intersectsWith = intersectsWith
    parsed.toString = () => this.osis()
    return parsed
}

// -- factory --
function makeParser(european = true) {
    const bcv = new bcv_parser
    bcv.include_apocrypha(true)
    bcv.set_options({
        versification_system: 'nab'
    })
    if (european) {
        bcv.set_options({
            punctuation_strategy: 'eu',
            osis_compaction_strategy: 'bcv'
        })
    }

    return bcv
}

// ------------- public --------------

function parseOsis(str) {
    return makeParser(false).parse_extended(str)
}

function parseEuropean(str) {
    const fixed_str = str
        .replace(/\(\d+\)/g, '') // remove alternative psalm numberings, e.g. Ž 98(97)
        .replace(/\+/g, '.').replace(/(\d+)[abcde]+/g, '$1'); // remove sub-verse letters

    return makeParser(true).parse_extended(fixed_str)
}

module.exports = {
    bcv_parser,
    parseOsis,
    parseEuropean
}