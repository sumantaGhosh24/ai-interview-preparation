export const createAccessControl = jest.fn(() => ({
  newRole: jest.fn(() => ({ statements: {} })),
}));

export const role = jest.fn();
