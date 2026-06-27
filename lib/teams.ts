import type { Team } from '@/lib/data'

// Team flag color mapping for all Club World Cup 2025 teams
const TEAM_FLAGS: Record<string, { colors: string[]; orientation?: 'horizontal' | 'vertical' }> = {
  // Group A
  'Al Ahly': { colors: ['#C8102E', '#FFFFFF', '#000000'] },
  'Inter Miami': { colors: ['#F7B5CD', '#231F20'] },
  'Porto': { colors: ['#003893', '#FFFFFF'], orientation: 'vertical' },
  'Palmeiras': { colors: ['#006437', '#FFFFFF'] },
  'RB Salzburg': { colors: ['#E2001A', '#FFFFFF'] },
  'Auckland City': { colors: ['#00247D', '#FFFFFF', '#CC142B'] },
  // Group B
  'PSG': { colors: ['#004170', '#C8102E', '#FFFFFF'], orientation: 'vertical' },
  'Atletico Madrid': { colors: ['#CB3524', '#FFFFFF', '#CB3524', '#FFFFFF', '#CB3524'] },
  'Botafogo': { colors: ['#000000', '#FFFFFF', '#000000'] },
  'Seattle Sounders': { colors: ['#658D1B', '#236192'] },
  'Ulsan HD': { colors: ['#004C97', '#FFFFFF', '#E4002B'] },
  'Mamelodi Sundowns': { colors: ['#FFD100', '#009B3A', '#FFD100'] },
  // Group C
  'Bayern Munich': { colors: ['#DC052D', '#FFFFFF', '#DC052D'] },
  'Boca Juniors': { colors: ['#003DA5', '#FFD100', '#003DA5'] },
  'Benfica': { colors: ['#FF0000', '#FFFFFF'] },
  'Al Hilal': { colors: ['#1C3F94', '#FFFFFF'] },
  'Pachuca': { colors: ['#004B87', '#FFFFFF', '#004B87'] },
  'Esperance': { colors: ['#C8102E', '#FFD100'] },
  // Group D
  'Flamengo': { colors: ['#C8102E', '#000000', '#C8102E'] },
  'Chelsea': { colors: ['#034694', '#FFFFFF', '#034694'] },
  'Leon': { colors: ['#006847', '#FFFFFF'] },
  'Urawa Red Diamonds': { colors: ['#C8102E', '#FFFFFF', '#C8102E'] },
  'ES Tunis': { colors: ['#C8102E', '#FFFFFF'] },
  'Monterey Bay': { colors: ['#0C2340', '#FFC72C'] },
  // Group E
  'River Plate': { colors: ['#FFFFFF', '#C8102E', '#FFFFFF'] },
  'Inter Milan': { colors: ['#0068A8', '#000000'], orientation: 'vertical' },
  'Monterrey': { colors: ['#003DA5', '#FFFFFF', '#003DA5'] },
  'Al Ain': { colors: ['#663399', '#FFFFFF'] },
  'CF America': { colors: ['#FFCD00', '#003DA5'] },
  'Wydad Casablanca': { colors: ['#C8102E', '#FFFFFF', '#C8102E'] },
  // Group F
  'Fluminense': { colors: ['#8B0000', '#006400', '#FFFFFF'] },
  'Borussia Dortmund': { colors: ['#FDE100', '#000000'] },
  'Ulsan Hyundai': { colors: ['#004C97', '#FFFFFF', '#E4002B'] },
  // Group G
  'Man City': { colors: ['#6CABDD', '#FFFFFF', '#6CABDD'] },
  'Juventus': { colors: ['#000000', '#FFFFFF'], orientation: 'vertical' },
  // Group H
  'Real Madrid': { colors: ['#FFFFFF', '#FEBE10', '#FFFFFF'] },
}

/**
 * Get team visual data from a team name string.
 * Returns flag colors for the CSS flag component.
 */
export function getTeamData(name: string): Team {
  const flag = TEAM_FLAGS[name]
  if (flag) {
    return {
      name,
      code: name.substring(0, 3).toUpperCase(),
      colors: flag.colors,
      orientation: flag.orientation,
    }
  }
  // Fallback: generate colors from the team name hash
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const hue1 = hash % 360
  const hue2 = (hash * 7) % 360
  return {
    name,
    code: name.substring(0, 3).toUpperCase(),
    colors: [`hsl(${hue1}, 60%, 45%)`, `hsl(${hue2}, 50%, 65%)`],
  }
}
