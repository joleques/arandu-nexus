import { describe, expect, it } from 'vitest';
import { toRichText } from 'tldraw';
import {
  BOARD_LABEL_COLOR_OPTIONS,
  canApplyBoardLabelColor,
  getBoardTextColorMode,
  shapeHasEditableText,
  shapeUsesDirectTextColor,
  shouldShowBoardLabelPopover,
} from '@/modules/boards/application/board-label-style';

describe('board label style helpers', () => {
  it('exposes a stable set of label colors for the board toolbar', () => {
    expect(BOARD_LABEL_COLOR_OPTIONS).toEqual([
      'black',
      'grey',
      'blue',
      'green',
      'yellow',
      'orange',
      'red',
      'white',
    ]);
  });

  it('only allows applying label color when the editor is ready', () => {
    expect(canApplyBoardLabelColor(false)).toBe(false);
    expect(canApplyBoardLabelColor(true)).toBe(true);
  });

  it('recognizes shapes with editable rich text', () => {
    expect(shapeHasEditableText({ type: 'text', props: { richText: toRichText('Teste') } })).toBe(true);
    expect(shapeHasEditableText({ props: {} })).toBe(false);
    expect(shapeHasEditableText(null)).toBe(false);
  });

  it('distinguishes direct text shapes from label-based text', () => {
    expect(shapeUsesDirectTextColor({ type: 'text', props: { richText: toRichText('Texto') } })).toBe(true);
    expect(shapeUsesDirectTextColor({ type: 'geo', props: { richText: toRichText('Texto') } })).toBe(false);
  });

  it('reports the correct text color mode for the current selection', () => {
    const textShape = { type: 'text', props: { richText: toRichText('Texto') } };
    const geoShape = { type: 'geo', props: { richText: toRichText('Label') } };
    const nonTextShape = { type: 'geo', props: { color: 'blue' } };

    expect(getBoardTextColorMode([])).toBe('none');
    expect(getBoardTextColorMode([textShape])).toBe('shape-text');
    expect(getBoardTextColorMode([geoShape])).toBe('label-text');
    expect(getBoardTextColorMode([textShape, geoShape])).toBe('mixed-text');
    expect(getBoardTextColorMode([textShape, nonTextShape])).toBe('none');
  });

  it('only shows the popover when the whole selection supports text color editing', () => {
    const textShape = { type: 'text', props: { richText: toRichText('Texto') } };
    const geoShape = { type: 'geo', props: { richText: toRichText('Label') } };
    const nonTextShape = { type: 'geo', props: { color: 'blue' } };

    expect(shouldShowBoardLabelPopover([textShape])).toBe(true);
    expect(shouldShowBoardLabelPopover([geoShape])).toBe(true);
    expect(shouldShowBoardLabelPopover([textShape, geoShape])).toBe(true);
    expect(shouldShowBoardLabelPopover([textShape, nonTextShape])).toBe(false);
  });
});
