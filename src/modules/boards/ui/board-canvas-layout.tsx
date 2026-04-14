import React, { ReactNode } from 'react';
import Link from 'next/link';
import { BOARD_LABEL_COLOR_OPTIONS, BoardLabelColor } from '@/modules/boards/application/board-label-style';

type ArchitectureDefinition = {
  kind: string;
  label: string;
  description: string;
};

type LabelPopoverProps = {
  visible: boolean;
  x: number;
  y: number;
  selectedColor: BoardLabelColor;
  onApplyColor: (color: BoardLabelColor) => void;
};

type BoardCanvasLayoutProps = {
  titleEditor: ReactNode;
  saveLabel: string;
  saveState: 'idle' | 'saving' | 'saved' | 'error';
  nodeDefinitions: readonly ArchitectureDefinition[];
  flowDefinitions: readonly ArchitectureDefinition[];
  controlsDisabled: boolean;
  onInsertNode: (kind: string) => void;
  onInsertFlow: (kind: string) => void;
  labelPopover: LabelPopoverProps;
  stage: ReactNode;
};

export function BoardCanvasLayout({
  titleEditor,
  saveLabel,
  saveState,
  nodeDefinitions,
  flowDefinitions,
  controlsDisabled,
  onInsertNode,
  onInsertFlow,
  labelPopover,
  stage,
}: BoardCanvasLayoutProps) {
  return (
    <main className="board-shell">
      <header className="board-toolbar">
        <div className="board-toolbar__main">
          <Link className="ghost-link ghost-link--toolbar" href="/">
            Voltar para boards
          </Link>
          {titleEditor}
        </div>

        <div className="board-toolbar__status">
          <span className={`save-pill save-pill--${saveState}`}>{saveLabel}</span>
        </div>
      </header>

      <section className="board-workspace">
        <aside className="board-architecture-panel" aria-label="Menu de arquitetura">
          <div className="board-architecture-panel__section board-architecture-panel__section--intro">
            <span className="board-architecture-panel__heading">Biblioteca visual</span>
            <strong>Monte o diagrama sem comecar do nada</strong>
            <p>Insira elementos de arquitetura e fluxos sem precisar negociar com um canvas vazio logo de cara.</p>
          </div>

          <div className="board-architecture-panel__section">
            <div className="board-architecture-panel__section-header">
              <span className="board-architecture-panel__heading">Elementos</span>
              <span>{nodeDefinitions.length} itens</span>
            </div>
            <div className="board-architecture-panel__grid">
              {nodeDefinitions.map((definition) => (
                <button
                  key={definition.kind}
                  type="button"
                  className="architecture-chip"
                  onClick={() => onInsertNode(definition.kind)}
                  disabled={controlsDisabled}
                  title={definition.description}
                >
                  <strong>{definition.label}</strong>
                  <span>{definition.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="board-architecture-panel__section">
            <div className="board-architecture-panel__section-header">
              <span className="board-architecture-panel__heading">Fluxos</span>
              <span>{flowDefinitions.length} itens</span>
            </div>
            <div className="board-architecture-panel__grid">
              {flowDefinitions.map((definition) => (
                <button
                  key={definition.kind}
                  type="button"
                  className="architecture-chip architecture-chip--flow"
                  onClick={() => onInsertFlow(definition.kind)}
                  disabled={controlsDisabled}
                  title={definition.description}
                >
                  <strong>{definition.label}</strong>
                  <span>{definition.description}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="board-stage">
          {labelPopover.visible && (
            <div
              className="label-color-popover"
              style={{
                left: labelPopover.x,
                top: labelPopover.y,
              }}
            >
              <span className="label-color-popover__label">Texto</span>
              <div className="label-color-popover__swatches">
                {BOARD_LABEL_COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`color-swatch color-swatch--${color}`}
                    data-active={labelPopover.selectedColor === color}
                    onClick={() => labelPopover.onApplyColor(color)}
                    disabled={controlsDisabled}
                    aria-label={`Aplicar cor ${color} ao texto do elemento selecionado`}
                    title={`Aplicar cor ${color}`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="board-stage__frame">{stage}</div>
        </section>
      </section>
    </main>
  );
}
