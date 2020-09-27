var bcv_parser = require("bible-passage-reference-parser/js/cs_bcv_parser").bcv_parser;
BooksCs = require('./books_cs.js');

// helper functions
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
const matchesRange = (e1, e2) => isBetween(e2.start, e1.start, e1.end) || isBetween(e2.end, e1.start, e1.end);

class BibleReference
{
    constructor (bcv_obj) {
        this.bcv_obj = bcv_obj;
    }

    getEntities() {
        return this.bcv_obj.parsed_entities()[0].entities;
    }

    static fromOsis(osis_str) {
        let bcv = new bcv_parser;
        bcv.include_apocrypha(true);
        return new BibleReference(bcv.parse(osis_str));
    }

    static fromEuropean(reference_str) {
        let bcv = new bcv_parser;
        bcv.include_apocrypha(true);

        bcv.set_options({
            punctuation_strategy: 'eu',
            osis_compaction_strategy: 'bcv'
        });

        return new BibleReference(bcv.parse(reference_str));
    }

    instersectsWith(bible_reference) {
        const entities_1 = this.getEntities();
        const entities_2 = bible_reference.getEntities();
        
        for (const ent_1 of entities_1) {
            if (!endsWithinSameBook(ent_1)) {
                throw new Exception('Start book and End book must match!');
            }

            // todo: check for endsWithinSameBook?
            return entities_2.some(ent_2 => matchesBook(ent_1, ent_2) && matchesRange(ent_1, ent_2));
        }

        return false;
    }

    toString() {
        return this.bcv_obj.osis();
    }

    toCzechStrings() {
        const entities = this.getEntities();

        const czechBookName = e => BooksCs.getCzechBookName(e.start.b);
        const verseRange = e => {
            if (cv_cmp(e.start, e.end) === 0 ) {
                return e.start.c + ', ' + e.start.v;
            }
            if (e.start.c == e.end.c) {
                return e.start.c + ', ' + e.start.v + '-' + e.end.v;
            }
            return e.start.c + ',' + e.start.v + ' - ' + e.end.c + ',' + e.end.v;
        }

        return entities.map(e => czechBookName(e) + ' ' + verseRange(e));
    }
}

const ref = BibleReference.fromEuropean(`Jan 3, 12-30`);

let references = [
    BibleReference.fromEuropean('Jan 3, 8-13'),
    BibleReference.fromEuropean('Jan 3, 12'),
    BibleReference.fromEuropean('Jan 3, 13'),
    BibleReference.fromEuropean('Jan 3, 30'),
    BibleReference.fromEuropean('Jan 3, 31'),
    BibleReference.fromEuropean('Jan 3, 20-31'),
    BibleReference.fromEuropean('matous10, 2 - skutky 2, 1')
];

for (reference of references) {
    console.log(ref.instersectsWith(reference));
}

console.log();

console.log(
    // example songs references
    BibleReference.fromEuropean(`
        1 tim 4
        z 103, 2-5
        zalm 34
        1 kor 4, 3.9-10
    `)
    // example day readings
    .instersectsWith(BibleReference.fromEuropean(`
        z 103, 4-10
        zalm 33, 1-20.22
        1 tim 2-4
    `))
); // --> true

console.log(
    BibleReference.fromEuropean('1 Kor 12,13').toCzechStrings()
);