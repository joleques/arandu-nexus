import React from 'react';

export default function RootLoading() {
  return (
    <main className="route-loading-shell" aria-busy="true" aria-live="polite">
      <div className="route-loading-card">
        <span className="route-loading-card__eyebrow">Carregando</span>
        <strong>Preparando a proxima tela...</strong>
        <p>Estamos movendo o workspace sem deixar o usuario no teatro silencioso do “sera que clicou?”.</p>
      </div>
    </main>
  );
}
