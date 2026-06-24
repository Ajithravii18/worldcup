import { 
  GiSoccerBall, GiTrophyCup, GiSoccerKick, GiRadarSweep, GiEarthAmerica
} from 'react-icons/gi';
import { 
  MdOutlineLeaderboard, MdStadium, MdHomeFilled, MdSensors, MdGroups
} from 'react-icons/md';
import { 
  IoClose, IoPerson, IoSettings, IoLogOut, IoChevronDown, 
  IoArrowDown, IoArrowUp, IoChevronBack, IoChevronForward, 
  IoStatsChart, IoListOutline, IoCheckmarkCircle, IoLockClosed, 
  IoLockOpen, IoEyeOff, IoMail, IoRemove, IoAdd, IoStar, IoAnalytics,
  IoMenu
} from 'react-icons/io5';

const iconMap = {
  'menu': IoMenu,
  'sports_soccer': GiSoccerBall,
  'trophy': GiTrophyCup,
  'emoji_events': GiTrophyCup,
  'social_leaderboard': MdOutlineLeaderboard,
  'leaderboard': MdOutlineLeaderboard,
  'sports_score': GiSoccerKick,
  'stadium': MdStadium,
  'home': MdHomeFilled,
  'person': IoPerson,
  'close': IoClose,
  'settings': IoSettings,
  'logout': IoLogOut,
  'sensors': MdSensors,
  'expand_more': IoChevronDown,
  'arrow_downward': IoArrowDown,
  'arrow_upward': IoArrowUp,
  'chevron_left': IoChevronBack,
  'chevron_right': IoChevronForward,
  'bar_chart': IoStatsChart,
  'list_alt': IoListOutline,
  'check_circle': IoCheckmarkCircle,
  'lock': IoLockClosed,
  'lock_open': IoLockOpen,
  'visibility_off': IoEyeOff,
  'mail': IoMail,
  'remove': IoRemove,
  'add': IoAdd,
  'stars': IoStar,
  'public': GiEarthAmerica,
  'analytics': IoAnalytics,
  'groups': MdGroups
};

export default function Icon({ name, className, style }) {
  const IconComponent = iconMap[name] || GiSoccerBall;
  
  // Clean up the material-symbols-outlined from className if it's there
  let finalClass = className || '';
  finalClass = finalClass.replace(/material-symbols-outlined/g, '').trim();
  
  return <IconComponent className={finalClass} style={style} />;
}
