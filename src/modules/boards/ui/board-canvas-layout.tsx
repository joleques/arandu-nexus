import React, { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BOARD_LABEL_COLOR_OPTIONS, BoardLabelColor } from '@/modules/boards/application/board-label-style';

type ArchitectureDefinition = {
  kind: string;
  label: string;
  description: string;
};

type ImageLibraryDefinition = {
  kind: string;
  label: string;
  src: string;
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
  imageDefinitions: readonly ImageLibraryDefinition[];
  controlsDisabled: boolean;
  onInsertNode: (kind: string) => void;
  onInsertFlow: (kind: string) => void;
  onInsertImage: (kind: string) => void;
  labelPopover: LabelPopoverProps;
  stage: ReactNode;
};

export function BoardCanvasLayout({
  titleEditor,
  saveLabel,
  saveState,
  nodeDefinitions,
  flowDefinitions,
  imageDefinitions,
  controlsDisabled,
  onInsertNode,
  onInsertFlow,
  onInsertImage,
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
            <p>Use elementos prontos, fluxos e imagens livres sem transformar a sidebar num romance visual.</p>
          </div>

          <div className="board-architecture-panel__section">
            <div className="board-architecture-panel__section-header">
              <span className="board-architecture-panel__heading">Elementos</span>
              <span>{nodeDefinitions.length} itens</span>
            </div>
            <div className="board-architecture-panel__grid board-architecture-panel__grid--compact">
              {nodeDefinitions.map((definition) => (
                <button
                  key={definition.kind}
                  type="button"
                  className="architecture-chip architecture-chip--compact"
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
            <div className="board-architecture-panel__grid board-architecture-panel__grid--compact">
              {flowDefinitions.map((definition) => (
                <button
                  key={definition.kind}
                  type="button"
                  className="architecture-chip architecture-chip--flow architecture-chip--compact"
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

          <div className="board-architecture-panel__section">
            <div className="board-architecture-panel__section-header">
              <span className="board-architecture-panel__heading">Imagens</span>
              <span>{imageDefinitions.length} assets</span>
            </div>
            <div className="image-library-grid">
              {imageDefinitions.map((definition) => (
                <button
                  key={definition.kind}
                  type="button"
                  className="image-library-chip"
                  onClick={() => onInsertImage(definition.kind)}
                  disabled={controlsDisabled}
                  title={`Inserir ${definition.label}`}
                >
                  <Image src={definition.src} alt="" aria-hidden="true" width={48} height={48} unoptimized />
                  <span>{definition.label}</span>
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
