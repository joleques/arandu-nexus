import { richTextValidator, type TLRichText } from 'tldraw';

export const BOARD_LABEL_COLOR_OPTIONS = [
  'black',
  'grey',
  'blue',
  'green',
  'yellow',
  'orange',
  'red',
  'white',
] as const;

export type BoardLabelColor = (typeof BOARD_LABEL_COLOR_OPTIONS)[number];
export type BoardTextColorMode = 'none' | 'shape-text' | 'label-text' | 'mixed-text';

type ShapeLike = {
  id?: string;
  type?: string;
  props?: unknown;
};

export function canApplyBoardLabelColor(editorReady: boolean) {
  return editorReady;
}

function isRichTextShapeProps(props: unknown): props is { richText: TLRichText } {
  if (!props || typeof props !== 'object' || !('richText' in props)) {
    return false;
  }

  return richTextValidator.isValid((props as { richText: unknown }).richText);
}

export function shapeHasEditableText(shape: ShapeLike | null | undefined) {
  if (!shape) {
    return false;
  }

  return isRichTextShapeProps(shape.props);
}

export function shapeUsesDirectTextColor(shape: ShapeLike | null | undefined) {
  return shapeHasEditableText(shape) && shape?.type === 'text';
}

export function getBoardTextColorMode(shapes: Array<ShapeLike | null | undefined>): BoardTextColorMode {
  if (shapes.length === 0 || !shapes.every((shape) => shapeHasEditableText(shape))) {
    return 'none';
  }

  const hasDirectTextShapes = shapes.some((shape) => shapeUsesDirectTextColor(shape));
  const hasLabelTextShapes = shapes.some((shape) => shapeHasEditableText(shape) && !shapeUsesDirectTextColor(shape));

  if (hasDirectTextShapes && hasLabelTextShapes) {
    return 'mixed-text';
  }

  if (hasDirectTextShapes) {
    return 'shape-text';
  }

  return 'label-text';
}

export function shouldShowBoardLabelPopover(shapes: Array<ShapeLike | null | undefined>) {
  return getBoardTextColorMode(shapes) !== 'none';
}
