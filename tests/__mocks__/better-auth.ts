export const betterAuth = jest.fn(function () {
  return {
    api: {
      getSession: jest.fn().mockResolvedValue({
        user: { id: "user-1", email: "test@example.com" },
        session: { id: "test_session_id" },
      }),
    },
    handlers: {},
  };
});

export const prismaAdapter = jest.fn();

export const nextCookies = jest.fn();

export const twoFactor = jest.fn();

export const admin = jest.fn();
