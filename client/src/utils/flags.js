/**
 * Helper to get high-resolution flag images from FlagCDN.
 * Maps World Cup team names to ISO 3166-1 alpha-2 country codes.
 */

const flagMapping = {
  'mexico': 'mx',
  'south africa': 'za',
  'south korea': 'kr',
  'czechia': 'cz',
  'canada': 'ca',
  'bosnia and herzegovina': 'ba',
  'usa': 'us',
  'united states': 'us',
  'paraguay': 'py',
  'qatar': 'qa',
  'switzerland': 'ch',
  'brazil': 'br',
  'morocco': 'ma',
  'haiti': 'ht',
  'scotland': 'gb-sct',
  'australia': 'au',
  'turkiye': 'tr',
  'turkey': 'tr',
  'germany': 'de',
  'curacao': 'cw',
  'netherlands': 'nl',
  'japan': 'jp',
  'ivory coast': 'ci',
  'ecuador': 'ec',
  'sweden': 'se',
  'tunisia': 'tn',
  'spain': 'es',
  'cape verde': 'cv',
  'belgium': 'be',
  'egypt': 'eg',
  'saudi arabia': 'sa',
  'uruguay': 'uy',
  'iran': 'ir',
  'new zealand': 'nz',
  'france': 'fr',
  'senegal': 'sn',
  'iraq': 'ir',
  'norway': 'no',
  'argentina': 'ar',
  'algeria': 'dz',
  'austria': 'at',
  'jordan': 'jo',
  'portugal': 'pt',
  'dr congo': 'cd',
  'england': 'gb-eng',
  'croatia': 'hr',
  'colombia': 'co',
  'wales': 'gb-wls',
  'chile': 'cl',
  'peru': 'pe',
  'denmark': 'dk',
  'poland': 'pl',
  'ukraine': 'ua'
};

export const getTeamFlagUrl = (teamName) => {
  if (!teamName) return null;
  const name = teamName.trim().toLowerCase();
  const code = flagMapping[name];
  if (code) {
    return `https://flagcdn.com/w160/${code}.png`;
  }
  return null;
};
