export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function getSaveLabel(saveState: SaveState) {
  switch (saveState) {
    case 'saving':
      return 'Salvando...';
    case 'saved':
      return 'Tudo salvo';
    case 'error':
      return 'Falha ao salvar';
    default:
      return 'Pronto para editar';
  }
}
