/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import { authClient } from "@/lib/auth-client";
import AppSidebar from "@/components/app-sidebar";

jest.mock("next/image", () => {
  // eslint-disable-next-line @next/next/no-img-element
  const MockImage = (props: any) => <img {...props} alt={props.alt} />;
  MockImage.displayName = "MockImage";
  return MockImage;
});

jest.mock("next/link", () => {
  const MockLink = ({ children, href }: any) => <a href={href}>{children}</a>;
  MockLink.displayName = "MockLink";
  return MockLink;
});

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: jest.fn(),
  },
}));

jest.mock("@/components/ui/sidebar", () => {
  const Mock = ({ children }: any) => <div>{children}</div>;
  Mock.displayName = "MockSidebar";

  const Label = ({ children }: any) => <div>{children}</div>;
  Label.displayName = "MockSidebarLabel";

  const Button = ({ children }: any) => <div>{children}</div>;
  Button.displayName = "MockSidebarButton";

  return {
    Sidebar: Mock,
    SidebarHeader: Mock,
    SidebarContent: Mock,
    SidebarGroup: Mock,
    SidebarGroupContent: Mock,
    SidebarGroupLabel: Label,
    SidebarMenu: Mock,
    SidebarMenuItem: Mock,
    SidebarMenuButton: Button,
    SidebarRail: () => <div data-testid="sidebar-rail" />,
  };
});

jest.mock("@/components/ui/skeleton", () => ({
  Skeleton: () => <div data-testid="skeleton" />,
}));

describe("AppSidebar", () => {
  const useSessionMock = authClient.useSession as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading skeleton when session is loading", () => {
    useSessionMock.mockReturnValue({
      data: null,
      isPending: true,
    });

    render(<AppSidebar />);

    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  it("renders sidebar without nav when not authenticated", () => {
    useSessionMock.mockReturnValue({
      data: null,
      isPending: false,
    });

    render(<AppSidebar />);

    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    expect(screen.queryByText("Topics")).not.toBeInTheDocument();
  });

  it("renders navigation items when authenticated", () => {
    useSessionMock.mockReturnValue({
      data: { user: { id: "1" } },
      isPending: false,
    });

    render(<AppSidebar />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Topics")).toBeInTheDocument();
    expect(screen.getByText("Learning Path")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });

  it("renders correct navigation links", () => {
    useSessionMock.mockReturnValue({
      data: { user: { id: "1" } },
      isPending: false,
    });

    render(<AppSidebar />);

    expect(screen.getByText("Dashboard").closest("a")).toHaveAttribute("href", "/dashboard");

    expect(screen.getByText("Topics").closest("a")).toHaveAttribute("href", "/topics");

    expect(screen.getByText("Learning Path").closest("a")).toHaveAttribute(
      "href",
      "/learning-path",
    );

    expect(screen.getByText("Analytics").closest("a")).toHaveAttribute("href", "/analytics");
  });

  it("renders app title and logo", () => {
    useSessionMock.mockReturnValue({
      data: { user: { id: "1" } },
      isPending: false,
    });

    render(<AppSidebar />);

    expect(screen.getByText("AI Interview Preparation")).toBeInTheDocument();

    expect(screen.getByAltText("logo")).toBeInTheDocument();
  });
});
