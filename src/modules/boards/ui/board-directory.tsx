'use client';

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
  return (
    <main className="shell shell--boards">
      <section className="hero">
        <span className="eyebrow">Arandu Nexus</span>
        <h1>Boards persistidos com canvas pronto para a v1.</h1>
        <p>
          Crie um board, abra o canvas e continue o raciocinio depois sem depender de
          memoria heroica ou print de tela no grupo.
        </p>
      </section>

      <section className="panel panel--form">
        <h2>Novo board</h2>
        <form action={createBoardAction} className="board-form">
          <label className="field">
            <span>Titulo</span>
            <input name="title" type="text" maxLength={80} placeholder="Ex: arquitetura de onboarding" required />
          </label>
          <SubmitButton />
        </form>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Boards existentes</h2>
          <span>{boards.length} item(ns)</span>
        </div>
        <div className="board-grid">
          {boards.length === 0 ? (
            <p>Nenhum board criado ainda. O vazio inicial foi oficialmente domesticado.</p>
          ) : (
            boards.map((board) => (
              <a className="board-card" key={board.id} href={`/boards/${board.id}`}>
                <strong>{board.title}</strong>
                <span>Atualizado em {new Date(board.updatedAt).toLocaleString('pt-BR')}</span>
              </a>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
