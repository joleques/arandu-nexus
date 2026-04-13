export type Board = {
  id: string;
  title: string;
  currentDocument: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateBoardInput = {
  title: string;
};

export type UpdateBoardInput = {
  title?: string;
  currentDocument?: string;
};

export function createBoardRecord(input: CreateBoardInput): Board {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    currentDocument: '',
    createdAt: now,
    updatedAt: now,
  };
}

export function updateBoardRecord(board: Board, input: UpdateBoardInput): Board {
  return {
    ...board,
    title: input.title?.trim() || board.title,
    currentDocument: input.currentDocument ?? board.currentDocument,
    updatedAt: new Date().toISOString(),
  };
}
