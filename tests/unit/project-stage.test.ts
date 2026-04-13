import { describe, expect, it } from 'vitest';
import { getProjectStageSummary } from '@/shared/config/project-stage';

describe('getProjectStageSummary', () => {
  it('returns a cloned list of stage items', () => {
    const items = getProjectStageSummary();

    items.push('Mutacao externa');

    expect(getProjectStageSummary()).not.toContain('Mutacao externa');
    expect(getProjectStageSummary()).toHaveLength(4);
  });
});
