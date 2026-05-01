/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import UserRow from "@/features/users/components/user-row";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    admin: {
      banUser: jest.fn(),
      unbanUser: jest.fn(),
      revokeUserSessions: jest.fn(),
      removeUser: jest.fn(),
    },
  },
}));

const mockUser = {
  id: "user_1",
  name: "John Doe",
  email: "john@example.com",
  role: "user",
  banned: false,
  emailVerified: true,
  createdAt: new Date(),
};

describe("UserRow Component", () => {
  it("should render user information", () => {
    render(
      <table>
        <tbody>
          <UserRow user={mockUser as any} selfId="admin_1" />
        </tbody>
      </table>,
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();

    expect(screen.getByText("john@example.com")).toBeInTheDocument();

    expect(screen.getByText("user")).toBeInTheDocument();
  });

  it("should show You badge for self user", () => {
    render(
      <table>
        <tbody>
          <UserRow user={mockUser as any} selfId="user_1" />
        </tbody>
      </table>,
    );

    expect(screen.getByText("You")).toBeInTheDocument();
  });

  it("should show banned badge", () => {
    render(
      <table>
        <tbody>
          <UserRow
            user={
              {
                ...mockUser,
                banned: true,
              } as any
            }
            selfId="admin_1"
          />
        </tbody>
      </table>,
    );

    expect(screen.getByText("Banned")).toBeInTheDocument();
  });

  it("should show unverified badge", () => {
    render(
      <table>
        <tbody>
          <UserRow
            user={
              {
                ...mockUser,
                emailVerified: false,
              } as any
            }
            selfId="admin_1"
          />
        </tbody>
      </table>,
    );

    expect(screen.getByText("Unverified")).toBeInTheDocument();
  });

  it("should hide action menu for self user", () => {
    render(
      <table>
        <tbody>
          <UserRow user={mockUser as any} selfId="user_1" />
        </tbody>
      </table>,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
