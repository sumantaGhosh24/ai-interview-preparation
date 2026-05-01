export const createUploadthing = () => ({
  image: () => ({
    middleware: jest.fn(),
    onUploadComplete: jest.fn(),
  }),
});

export const UTApi = class {
  deleteFiles = jest.fn();
};
