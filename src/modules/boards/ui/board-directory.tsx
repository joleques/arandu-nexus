'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';

type BoardSummary = {
  id: string;
  title: string;
  updatedAt: string;
};

type BoardDirectoryProps = {
  boards: BoardSummary[];
  createBoardAction: (formData: FormData) => Promise<void>;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="primary-button" type="submit" disabled={pending}>
      {pending ? 'Criando...' : 'Criar board'}
    </button>
  );
}

export function BoardDirectory({ boards, createBoardAction }: BoardDirectoryProps) {
  const boardCountLabel = `${boards.length} ${boards.length === 1 ? 'board ativo' : 'boards ativos'}`;

  return (
    <main className="shell shell--boards">
      <section className="hero hero--boards">
        <div className="hero__content">
          <span className="eyebrow">Arandu Nexus</span>
          <h1>Arquitetura visual com cara de workspace, nao de planilha fantasiada.</h1>
          <p>
            Estruture sistemas, explore fluxos e retome o raciocinio tecnico sem depender de memoria heroica,
            screenshot perdido ou boa vontade do caos.
          </p>

          <div className="hero__stats" aria-label="Resumo do workspace">
            <div className="hero-stat">
              <strong>{boards.length}</strong>
              <span>boards persistidos</span>
            </div>
            <div className="hero-stat">
              <strong>Canvas</strong>
              <span>zoom, pan e autosave ativos</span>
            </div>
            <div className="hero-stat">
              <strong>MVP</strong>
              <span>foco em raciocinio arquitetural</span>
            </div>
          </div>
        </div>

        <div className="hero__spotlight panel panel--spotlight">
          <span className="hero__spotlight-label">Workspace pronto</span>
          <strong>Crie um board e entre direto no canvas com biblioteca de elementos de arquitetura.</strong>
          <p>
            A ideia aqui e sair do layout que so funciona e acha que isso ja encerra a arte, dando uma cara mais
            contemporanea para a experiencia inteira.
          </p>
          <ul className="hero__feature-list">
            <li>Entrada rapida para novos boards</li>
            <li>Cards com leitura visual mais clara</li>
            <li>Base preparada para comentarios e snapshots</li>
          </ul>
        </div>
      </section>

      <section className="board-directory-grid">
        <section className="panel panel--form">
          <div className="panel__intro">
            <span className="eyebrow">Novo board</span>
            <h2>Abra um novo espaco de trabalho</h2>
            <p>Defina um titulo objetivo e siga para o canvas sem precisar atravessar uma burocracia cenografica.</p>
          </div>

          <form action={createBoardAction} className="board-form">
            <label className="field">
              <span>Titulo</span>
              <input name="title" type="text" maxLength={80} placeholder="Ex: arquitetura de onboarding" required />
            </label>
            <SubmitButton />
          </form>
        </section>

        <section className="panel board-directory-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Biblioteca</span>
              <h2>Boards existentes</h2>
            </div>
            <span>{boardCountLabel}</span>
          </div>

          <div className="board-grid">
            {boards.length === 0 ? (
              <article className="board-card board-card--empty">
                <strong>Nenhum board criado ainda.</strong>
                <span>O lado bom do vazio inicial e que ele ainda nao conseguiu baguncar a arquitetura.</span>
              </article>
            ) : (
              boards.map((board) => (
                <a className="board-card" key={board.id} href={`/boards/${board.id}`}>
                  <span className="board-card__eyebrow">Board</span>
                  <strong>{board.title}</strong>
                  <span>Atualizado em {new Date(board.updatedAt).toLocaleString('pt-BR')}</span>
                  <span className="board-card__cta">Abrir workspace</span>
                </a>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
