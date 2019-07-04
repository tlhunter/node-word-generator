#!/usr/bin/env node

const random = require('roguelike/utility/random');

const repetitions = process.argv[2] || 100;

const chunks = {
  consonant: {
    start: 40,
    candidates: {
      pool: [
        'b', 'p',
        'd', 't',
        'g', 'k',
        'f', 'v',
        's', 'z',
        'j', 'ch',
        'm',
        'n',
        'c', // worst letter ever
        'h',
        'l',
        'r',
        'th',
        'sh',
      ],
      weights: [
        8, 8,
        8, 8,
        8, 8,
        8, 8,
        8, 6,
        6, 7,
        7,
        6,
        4,
        3,
        5,
        8,
        6,
        5
      ],
    },
    followers: {
      pool: [
        'vowels',
        'vc',
      ],
      weights: [
        9,
        1,
      ],
    }
  },

  // TODO: many of these shouldn't be terminals
  deep: {
    start: 0,
    candidates: {
      pool: [
        'ck', 'ct',
        'gg', 'ss', 'gr',
        'bl',
        'nd', 'nt', 'ng', 'nn', 'ny',
        'mm',
        'st',
        'ld', 'll',
        'ry', 'rd',
        'tt',
      ],
      weights: [
        5, 3, 2,
        4, 4,
        4,
        3, 3, 3, 2, 1,
        1,
        2,
        1, 2,
        3, 3,
        1,
      ]
    },
    followers: {
      pool: [
        'vowels',
        'vc',
      ],
      weights: [
        9,
        1,
      ],
    }
  },

  vowels: {
    start: 20,
    candidates: {
      pool: [
        'a', 'ae',
        'e', 'ee',
        'i', 'ie',
        'o', 'oo', 'ou',
        'u',
        'oy',
        'ay',
      ],
      weights: [
        4, 1,
        5, 1,
        4, 1,
        4, 1, 1,
        4,
        1,
        1,
      ],
    },
    followers: {
      pool: [
        'consonant',
        'deep',
        'floaters',
        'cv',
      ],
      weights: [
        20,
        10,
        4,
        10,
      ],
    }
  },

  floaters: {
    start: 5,
    candidates: {
      pool: [
        'r',
        'n'
      ],
      weights: [
        1,
        1,
      ],
    },
    followers: {
      pool: [
        'vowels',
        'vc',
      ],
      weights: [
        8,
        1,
      ],
    }
  },

  vc: {
    start: 0,
    candidates: {
      pool: [
        'an',
        'in',
        'on',
        'er',
        'or',
        'ain',
      ],
      weights: [
        1,
        1,
        1,
        1,
        1,
        1,
      ],
    },
    followers: {
      pool: [
        'vowels',
      ],
      weights: [
        1
      ],
    }
  },

  // A lot of these can be generated naturally but are here to increase frequency
  cv: {
    start: 10,
    candidates: {
      pool: [
        'rhe', 're',
        'he', 'ha', 'hi',
        'to', 'ti', 'te',
        'de',
        'se',
        'qu',
      ],
      weights: [
        1, 5,
        4, 4, 2,
        4, 4, 4,
        4,
        4,
        4,
      ],
    },
    followers: {
      pool: [
        'consonant',
        'deep',
        'floaters'
      ],
      weights: [
        20,
        10,
        4,
      ],
    }
  }
}

function how_many_chunks() {
  return random.dice('2d3 + 1');
}

function pick_from_group(name) {
  const group = chunks[name];

  return random.elementWeighted(group.candidates.pool, group.candidates.weights);
}

function pick_next_group(name) {
  const group = chunks[name];

  return random.elementWeighted(group.followers.pool, group.followers.weights);
}

function generate() {
  let entries = how_many_chunks();

  let chunk_names = Object.keys(chunks);
  let chunk_weights = [];
  for (let c of chunk_names) {
    chunk_weights.push(chunks[c].start);
  }

  let current = random.elementWeighted(chunk_names, chunk_weights);

  let output = '';

  for (let i = 0; i < entries; i++) {
    output += pick_from_group(current);
    current = pick_next_group(current);
  }

  console.log(output);
}

for (let i = 0; i < repetitions; i++) {
  generate();
}
