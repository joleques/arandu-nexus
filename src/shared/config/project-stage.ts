const projectStageSummary = [
  'Boards persistidos com MongoDB e fluxo inicial de criacao ja estao implementados.',
  'Canvas integrado com tldraw e autosave do currentDocument ativo por board.',
  'Operacao local suportada por .env.local e Makefile com check automatizado.',
  'Base pronta para evoluir a V2 com comentarios ancorados e snapshots.',
] as const;

export function getProjectStageSummary() {
  return [...projectStageSummary];
}
