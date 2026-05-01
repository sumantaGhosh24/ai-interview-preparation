import type { Config } from "jest";

const config: Config = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  moduleNameMapper: {
    "^superjson$": "<rootDir>/tests/__mocks__/superjson.ts",
    "^next/headers$": "<rootDir>/tests/__mocks__/next-headers.ts",
    "^next/cache$": "<rootDir>/tests/__mocks__/next-cache.ts",
    "^@uploadthing/react$": "<rootDir>/tests/__mocks__/uploadthing-react.ts",
    "^uploadthing$": "<rootDir>/tests/__mocks__/uploadthing.ts",
    "^better-auth$": "<rootDir>/tests/__mocks__/better-auth.ts",
    "^better-auth/adapters/prisma$": "<rootDir>/tests/__mocks__/better-auth-adapters-prisma.ts",
    "^better-auth/next-js$": "<rootDir>/tests/__mocks__/better-auth-next-js.ts",
    "^better-auth/plugins$": "<rootDir>/tests/__mocks__/better-auth-plugins.ts",
    "^better-auth/plugins/access$": "<rootDir>/tests/__mocks__/better-auth-plugins-access.ts",
    "^better-auth/plugins/admin/access$":
      "<rootDir>/tests/__mocks__/better-auth-plugins-admin-access.ts",
    "^better-auth/api$": "<rootDir>/tests/__mocks__/better-auth-api.ts",
    "^@better-auth/passkey$": "<rootDir>/tests/__mocks__/better-auth-passkey.ts",
    "^@/components/sign-in-tab$": "<rootDir>/src/features/auth/components/sign-in-tab.tsx",
    "^@/components/sign-up-tab$": "<rootDir>/src/features/auth/components/sign-up-tab.tsx",
    "^@/components/email-verification$":
      "<rootDir>/src/features/auth/components/email-verification.tsx",
    "^@/components/forgot-password$": "<rootDir>/src/features/auth/components/forgot-password.tsx",
    "^@/components/social-auth-buttons$":
      "<rootDir>/src/features/auth/components/social-auth-buttons.tsx",
    "^@/components/auth-action-button$":
      "<rootDir>/src/features/auth/components/auth-action-button.tsx",
    "^@/components/passkey-button$": "<rootDir>/src/features/auth/components/passkey-button.tsx",
    "^@/components/answers-header$": "<rootDir>/src/features/answers/components/answers-header.tsx",
    "^@/components/answers-pagination$":
      "<rootDir>/src/features/answers/components/answers-pagination.tsx",
    "^@/components/evaluation-card$":
      "<rootDir>/src/features/answers/components/evaluation-card.tsx",
    "^@/components/evaluation-status$":
      "<rootDir>/src/features/answers/components/evaluation-status.tsx",
    "^@/hooks/use-answers$": "<rootDir>/src/features/answers/hooks/use-answers.ts",
    "^@/hooks/use-analytics$": "<rootDir>/src/features/analytics/hooks/use-analytics.ts",
    "^@/hooks/use-learning-path$":
      "<rootDir>/src/features/learning-path/hooks/use-learning-path.ts",
    "^@/hooks/use-questions$": "<rootDir>/src/features/questions/hooks/use-questions.ts",
    "^@/hooks/use-topics$": "<rootDir>/src/features/topics/hooks/use-topics.ts",
    "^next/navigation$": "<rootDir>/tests/__mocks__/next-navigation.ts",
    "^react$": "<rootDir>/node_modules/react",
    "^react-dom$": "<rootDir>/node_modules/react-dom",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/tests/e2e/"],
  testMatch: ["**/tests/**/*.test.ts", "**/tests/**/*.test.tsx"],
  rootDir: ".",
  moduleDirectories: ["node_modules", "<rootDir>"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
        useESM: false,
      },
    ],
  },
  transformIgnorePatterns: ["/node_modules/"],
  modulePaths: ["<rootDir>"],
  resolver: undefined,
};

export default config;
