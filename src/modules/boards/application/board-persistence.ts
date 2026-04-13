export function shouldPersistBoardSnapshot(editorReady: boolean, snapshot: string, lastPersistedSnapshot: string) {
  if (!editorReady) {
    return false;
  }

  return snapshot !== lastPersistedSnapshot;
}
