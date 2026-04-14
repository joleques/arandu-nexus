export function shouldPersistBoardTitle(title: string, lastPersistedTitle: string) {
  const normalizedTitle = title.trim();
  const normalizedPersistedTitle = lastPersistedTitle.trim();

  if (!normalizedTitle) {
    return false;
  }

  return normalizedTitle !== normalizedPersistedTitle;
}
