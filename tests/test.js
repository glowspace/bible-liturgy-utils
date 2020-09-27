const BibleReference = require('../bible_reference');

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

// console.log(
//     BibleReference.fromEuropean('1 Kor 12,13').toCzechStrings()
// );
console.log(
    BibleReference.fromOsis('1Cor.12.31-1Cor.13.13').toCzechStrings()
);