import fs from 'fs';
import path from 'path';

const submissionsFile = path.join(process.cwd(), 'data', 'submissions.json');

interface Submission {
  timestamp: string;
  name: string;
  email: string;
  role: string;
  relationship: string;
  correction: string;
  solarParkName: string;
  solarParkLocation: string;
  currentStatus: string;
}

export function generateWeeklySummary() {
  if (!fs.existsSync(submissionsFile)) {
    return {
      totalSubmissions: 0,
      numberThisWeek: 0,
      roles: { 'Solar operator': 0, 'Grazier': 0, 'Consultant': 0, 'Other': 0 },
      mostChallenged: '',
      topThemes: [],
      excerpts: []
    };
  }

  const data = fs.readFileSync(submissionsFile, 'utf8');
  const submissions: Submission[] = JSON.parse(data);

  const totalSubmissions = submissions.length;

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisWeek = submissions.filter(s => new Date(s.timestamp) > oneWeekAgo);
  const numberThisWeek = thisWeek.length;

  const roles = { 'Solar operator': 0, 'Grazier': 0, 'Consultant': 0, 'Other': 0 };
  submissions.forEach(s => {
    if (roles.hasOwnProperty(s.role)) {
      roles[s.role as keyof typeof roles]++;
    } else {
      roles.Other++;
    }
  });

  // Grazing status most often challenged
  const statusCounts: { [key: string]: number } = {};
  submissions.forEach(s => {
    statusCounts[s.currentStatus] = (statusCounts[s.currentStatus] || 0) + 1;
  });
  let mostChallenged = '';
  let maxCount = 0;
  for (const [status, count] of Object.entries(statusCounts)) {
    if (count > maxCount) {
      maxCount = count;
      mostChallenged = status;
    }
  }

  // Top recurring themes
  const themes = ['Water access', 'Panel height', 'Wire safety', 'Active grazing claim'];
  const themeCounts: { [key: string]: number } = {};
  themes.forEach(theme => {
    themeCounts[theme] = submissions.filter(s => s.correction.toLowerCase().includes(theme.toLowerCase())).length;
  });
  const topThemes = Object.entries(themeCounts).filter(([, count]) => count > 0).sort((a, b) => b[1] - a[1]).map(([theme, count]) => `${theme} (${count} mentions)`);

  // Selected user excerpts
  const excerpts = submissions.slice(0, 5).map(s => s.correction.split('.')[0] + '.'); // first sentence

  return {
    totalSubmissions,
    numberThisWeek,
    roles,
    mostChallenged: mostChallenged ? `${mostChallenged} (${maxCount} mentions)` : '',
    topThemes,
    excerpts
  };
}