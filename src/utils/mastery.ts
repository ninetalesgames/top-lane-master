export type ChampionMastery = {
  champion: string;
  count: number;
  total: number;
  percentage: number;
  rank: string;
};

const getRank = (percentage: number) => {
  if (percentage === 100) return 'Challenger';
  if (percentage >= 95) return 'Master';
  if (percentage >= 80) return 'Diamond';
  if (percentage >= 65) return 'Emerald';
  if (percentage >= 50) return 'Platinum';
  if (percentage >= 35) return 'Gold';
  if (percentage >= 20) return 'Silver';
  if (percentage >= 10) return 'Bronze';
  return 'Iron';
};

export const calculateMastery = (championNames: string[]): ChampionMastery[] => {
  const keys = Object.keys(localStorage);

  const counts: Record<string, number> = {};

  keys.forEach((key) => {
    if (!key.startsWith('matchup_notes_')) return;

    const parts = key.replace('matchup_notes_', '').split('_');

    if (parts.length < 2) return;

    const champion = parts[0];

    counts[champion] = (counts[champion] || 0) + 1;
  });

  const total = championNames.length;

  return championNames
    .map((champion) => {
      const count = counts[champion] || 0;
      const percentage = Math.round((count / total) * 100);

      return {
        champion,
        count,
        total,
        percentage,
        rank: getRank(percentage)
      };
    })
    .sort((a, b) => b.percentage - a.percentage);
};