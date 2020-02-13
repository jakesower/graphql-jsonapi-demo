const http = require('http');
const fortune = require('fortune');
const fortuneHTTP = require('fortune-http');
const jsonApiSerializer = require('fortune-json-api');

const store = fortune({
  countries: {
    name: String,
    flag: String,
    continent: String,

    squads: [Array('squads'), 'country'],
  },

  squads: {
    year: Number,
    finish: String,

    country: ['countries', 'squads'],
    players: [Array('players'), 'squads'],
  },

  players: {
    name: String,

    squads: [Array('squads'), 'players'],
  },
});

const countries = [
  { id: 'usa', name: 'United States', flag: '🇺🇸', continent: 'North America' },
  { id: 'jpn', name: 'Japan', flag: '🇯🇵', continent: 'Asia' },
  { id: 'arg', name: 'Argentina', flag: '🇦🇷', continent: 'South America' },
];

const squads = [
  { id: 'usa-2019', year: 2019, finish: 'winners', country: 'usa' },
  { id: 'usa-2015', year: 2015, finish: 'winners', country: 'usa' },
  { id: 'usa-2011', year: 2011, finish: 'runners-up', country: 'usa' },
  { id: 'jpn-2019', year: 2019, finish: 'round of 16', country: 'jpn' },
  { id: 'jpn-2015', year: 2015, finish: 'runners-up', country: 'jpn' },
  { id: 'jpn-2011', year: 2011, finish: 'winners', country: 'jpn' },
  { id: 'arg-2019', year: 2019, finish: 'group stage', country: 'arg' },
];

const players = [
  { name: 'Megan Rapinoe', squads: ['usa-2011', 'usa-2015', 'usa-2019'] },
  { name: 'Rose Lavelle', squads: ['usa-2015', 'usa-2019'] },
  { name: 'Abby Wambach', squads: ['usa-2011', 'usa-2015'] },
  { name: 'Homare Sawa', squads: ['jpn-2011', 'jpn-2015'] },
  { name: 'Yui Hasegawa', squads: ['jpn-2019'] },
  { name: 'Vanina Correa', squads: ['arg-2019'] },
];

Promise.all(countries.map(x => store.create('countries', x)))
  .then(() => Promise.all(squads.map(x => store.create('squads', x))))
  .then(() => Promise.all(players.map(x => store.create('players', x))));

const listener = fortuneHTTP(store, {
  serializers: [
    [jsonApiSerializer, { inflectType: false, inflectKeys: false, castNumericIds: false }],
  ],
});

const server = http.createServer(listener);
server.listen(20195);

console.log('listening on port 20195');
