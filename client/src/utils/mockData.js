







const today = new Date();
const todayIso = today.toISOString();
const tomorrowIso = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString();
const yesterdayIso = new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString();

export const mockMatches = [
{
  id: "ger-aut-live",
  homeTeam: {
    id: "ger",
    name: "Germany",
    shortName: "GER",
    logo: "https://flagcdn.com/w160/de.png",
    group: "A"
  },
  awayTeam: {
    id: "aut",
    name: "Austria",
    shortName: "AUT",
    logo: "https://flagcdn.com/w160/at.png",
    group: "A"
  },
  homeScore: 0,
  awayScore: 0,
  minute: 65,
  status: "LIVE",
  kickoffTime: todayIso,
  date: todayIso,
  competition: "World Cup",
  group: "Group A",
  venue: "Olympiastadion"
},
{
  id: "bra-esp-today",
  homeTeam: {
    id: "bra",
    name: "Brazil",
    shortName: "BRA",
    logo: "https://flagcdn.com/w160/br.png",
    group: "B"
  },
  awayTeam: {
    id: "esp",
    name: "Spain",
    shortName: "ESP",
    logo: "https://flagcdn.com/w160/es.png",
    group: "B"
  },
  homeScore: 0,
  awayScore: 0,
  status: "TODAY",
  kickoffTime: todayIso,
  date: todayIso,
  competition: "World Cup",
  group: "Group B",
  venue: "National Arena"
},
{
  id: "arg-fra-upcoming",
  homeTeam: {
    id: "arg",
    name: "Argentina",
    shortName: "ARG",
    logo: "https://flagcdn.com/w160/ar.png",
    group: "C"
  },
  awayTeam: {
    id: "fra",
    name: "France",
    shortName: "FRA",
    logo: "https://flagcdn.com/w160/fr.png",
    group: "C"
  },
  status: "UPCOMING",
  kickoffTime: tomorrowIso,
  date: tomorrowIso,
  competition: "World Cup",
  group: "Group C",
  venue: "Lusail Stadium"
},
{
  id: "eng-por-finished",
  homeTeam: {
    id: "eng",
    name: "England",
    shortName: "ENG",
    logo: "https://flagcdn.com/w160/gb-eng.png",
    group: "D"
  },
  awayTeam: {
    id: "por",
    name: "Portugal",
    shortName: "POR",
    logo: "https://flagcdn.com/w160/pt.png",
    group: "D"
  },
  homeScore: 2,
  awayScore: 1,
  status: "FINISHED",
  kickoffTime: yesterdayIso,
  date: yesterdayIso,
  competition: "World Cup",
  group: "Group D",
  venue: "Arena Central"
},
{
  id: "jpn-usa-finished",
  homeTeam: {
    id: "jpn",
    name: "Japan",
    shortName: "JPN",
    logo: "https://flagcdn.com/w160/jp.png",
    group: "E"
  },
  awayTeam: {
    id: "usa",
    name: "United States",
    shortName: "USA",
    logo: "https://flagcdn.com/w160/us.png",
    group: "E"
  },
  homeScore: 1,
  awayScore: 1,
  status: "FINISHED",
  kickoffTime: yesterdayIso,
  date: yesterdayIso,
  competition: "World Cup",
  group: "Group E",
  venue: "Bay Stadium"
}];


export const mockNews = [
{
  id: "news-1",
  title: "Germany press high as Austria absorb second-half pressure",
  imageUrl:
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=900&q=80",
  publishedAt: todayIso,
  source: "World Cup Daily"
},
{
  id: "news-2",
  title: "Brazil prepare a fluid front four for tonight's group clash",
  imageUrl:
  "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=900&q=80",
  publishedAt: todayIso,
  source: "Touchline"
},
{
  id: "news-3",
  title: "Underdogs keep knockout hopes alive with late equaliser",
  imageUrl:
  "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=80",
  publishedAt: yesterdayIso,
  source: "Match Centre"
}];


export const mockMatchDetails = {
  ...mockMatches[0],
  statistics: {
    possession: { home: 58, away: 42 },
    shots: { home: 12, away: 8 },
    corners: { home: 6, away: 3 },
    fouls: { home: 9, away: 11 }
  },
  timeline: [
  {
    id: "event-1",
    type: "yellow-card",
    minute: 18,
    teamId: "aut",
    teamName: "Austria",
    playerName: "M. Sabitzer"
  },
  {
    id: "event-2",
    type: "substitution",
    minute: 46,
    teamId: "ger",
    teamName: "Germany",
    playerName: "T. Muller",
    replacementName: "F. Wirtz"
  },
  {
    id: "event-3",
    type: "goal",
    minute: 72,
    teamId: "ger",
    teamName: "Germany",
    playerName: "J. Musiala",
    assistName: "I. Gundogan"
  }],

  lineups: {
    home: {
      formation: "4-2-3-1",
      players: [
      { id: "ger-1", name: "Neuer", number: 1, position: "GK" },
      { id: "ger-2", name: "Kimmich", number: 6, position: "DEF" },
      { id: "ger-3", name: "Rudiger", number: 2, position: "DEF" },
      { id: "ger-4", name: "Tah", number: 4, position: "DEF" },
      { id: "ger-5", name: "Raum", number: 22, position: "DEF" },
      { id: "ger-6", name: "Kroos", number: 8, position: "MID" },
      { id: "ger-7", name: "Andrich", number: 23, position: "MID" },
      { id: "ger-8", name: "Sane", number: 19, position: "MID" },
      { id: "ger-9", name: "Musiala", number: 10, position: "MID" },
      { id: "ger-10", name: "Wirtz", number: 17, position: "MID" },
      { id: "ger-11", name: "Havertz", number: 7, position: "FWD" }]

    },
    away: {
      formation: "4-4-2",
      players: [
      { id: "aut-1", name: "Pentz", number: 13, position: "GK" },
      { id: "aut-2", name: "Posch", number: 5, position: "DEF" },
      { id: "aut-3", name: "Danso", number: 4, position: "DEF" },
      { id: "aut-4", name: "Lienhart", number: 15, position: "DEF" },
      { id: "aut-5", name: "Mwene", number: 16, position: "DEF" },
      { id: "aut-6", name: "Laimer", number: 20, position: "MID" },
      { id: "aut-7", name: "Seiwald", number: 6, position: "MID" },
      { id: "aut-8", name: "Sabitzer", number: 9, position: "MID" },
      { id: "aut-9", name: "Baumgartner", number: 19, position: "MID" },
      { id: "aut-10", name: "Arnautovic", number: 7, position: "FWD" },
      { id: "aut-11", name: "Gregoritsch", number: 11, position: "FWD" }]

    }
  }
};

export const mockResults = [
{
  label: "Yesterday",
  matches: mockMatches.filter((match) => match.status === "FINISHED")
},
{
  label: "Earlier",
  matches: [
  {
    ...mockMatches[1],
    id: "bra-esp-earlier",
    homeScore: 3,
    awayScore: 2,
    status: "FINISHED",
    date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }]

}];


export const mockStandings = [
{
  group: "Group A",
  rows: [
  {
    pos: 1,
    team: mockMatches[0].homeTeam,
    played: 2,
    wins: 1,
    draws: 1,
    losses: 0,
    points: 4
  },
  {
    pos: 2,
    team: mockMatches[0].awayTeam,
    played: 2,
    wins: 1,
    draws: 0,
    losses: 1,
    points: 3
  },
  {
    pos: 3,
    team: {
      id: "sui",
      name: "Switzerland",
      shortName: "SUI",
      logo: "https://flagcdn.com/w160/ch.png"
    },
    played: 2,
    wins: 0,
    draws: 2,
    losses: 0,
    points: 2
  },
  {
    pos: 4,
    team: {
      id: "sco",
      name: "Scotland",
      shortName: "SCO",
      logo: "https://flagcdn.com/w160/gb-sct.png"
    },
    played: 2,
    wins: 0,
    draws: 1,
    losses: 1,
    points: 1
  }]

},
{
  group: "Group B",
  rows: [
  {
    pos: 1,
    team: mockMatches[1].homeTeam,
    played: 2,
    wins: 2,
    draws: 0,
    losses: 0,
    points: 6
  },
  {
    pos: 2,
    team: mockMatches[1].awayTeam,
    played: 2,
    wins: 1,
    draws: 0,
    losses: 1,
    points: 3
  }]

}];