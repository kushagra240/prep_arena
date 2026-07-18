export function isStreakActive(lastActivityDate: string | null): boolean {
  if (!lastActivityDate) return false;
  
  try {
    const today = new Date().toISOString().split('T')[0];
    if (lastActivityDate === today) return true;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    return lastActivityDate === yesterdayStr;
  } catch {
    return false;
  }
}
