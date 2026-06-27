const fs = require('fs');
const data = JSON.parse(fs.readFileSync('kurukshthra.matches.json', 'utf8'));
const matches = data.filter(m => new Date(m.kickoffTime['$date']) < new Date('2026-06-24T17:54:22+05:30')).map(m => m.homeTeam + ' vs ' + m.awayTeam);
fs.writeFileSync('matchups.txt', matches.join('\n'));
