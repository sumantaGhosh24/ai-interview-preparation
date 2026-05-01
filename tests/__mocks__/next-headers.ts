export const headers = jest.fn(function () {
  return {
    get: jest.fn(),
    has: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    entries: jest.fn(function () {
      return [];
    }),
  };
});

export const cookies = jest.fn(function () {
  return {
    get: jest.fn(),
    has: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(function () {
      return [];
    }),
  };
});
