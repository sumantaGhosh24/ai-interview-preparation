import { ComponentProps, ElementType } from "react";

import { GoogleIcon, DiscordIcon, GitHubIcon } from "@/features/auth/components/o-auth-icons";

export const SUPPORTED_OAUTH_PROVIDERS = ["google", "github", "discord"] as const;
export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

export const SUPPORTED_OAUTH_PROVIDER_DETAILS: Record<
  SupportedOAuthProvider,
  { name: string; Icon: ElementType<ComponentProps<"svg">> }
> = {
  google: { name: "Google", Icon: GoogleIcon },
  discord: { name: "Discord", Icon: DiscordIcon },
  github: { name: "GitHub", Icon: GitHubIcon },
};
