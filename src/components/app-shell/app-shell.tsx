import Link from "next/link";
import {
  BotIcon,
  BoxesIcon,
  CalculatorIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  ShoppingCartIcon,
  TagIcon,
  UsersIcon,
} from "lucide-react";

import type { CurrentUser } from "@/engines/identity";
import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";

import { UserMenu } from "./user-menu";

interface AppShellProps {
  user: CurrentUser;
  onSignOut: () => Promise<void>;
  children: React.ReactNode;
}

/** Modules shown in the sidebar. Items without a path ship in later sprints. */
const navItems = [
  { name: "Dashboard", icon: LayoutDashboardIcon, href: "/dashboard" },
  { name: "Smart Costing", icon: CalculatorIcon },
  { name: "Smart Pricing", icon: TagIcon },
  { name: "CPQ", icon: FileTextIcon },
  { name: "CRM", icon: UsersIcon },
  { name: "Purchasing", icon: ShoppingCartIcon },
  { name: "Inventory", icon: BoxesIcon },
  { name: "AI Copilot", icon: BotIcon },
] as const;

/** The application frame every signed-in screen lives inside. */
export function AppShell({ user, onSignOut, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <aside className="bg-sidebar text-sidebar-foreground hidden w-60 shrink-0 flex-col border-r md:flex">
        <div className="flex h-16 items-center border-b px-5">
          <Link href="/dashboard" className="text-lg font-bold tracking-tight">
            FLOW360
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-3" aria-label="Modules">
          {navItems.map((item) =>
            "href" in item ? (
              <Link
                key={item.name}
                href={item.href}
                className="bg-sidebar-accent text-sidebar-accent-foreground flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium"
              >
                <item.icon className="size-4" aria-hidden="true" />
                {item.name}
              </Link>
            ) : (
              <span
                key={item.name}
                className="text-muted-foreground flex cursor-default items-center gap-3 rounded-md px-3 py-2 text-sm"
                aria-disabled="true"
              >
                <item.icon className="size-4" aria-hidden="true" />
                {item.name}
                <Badge variant="outline" className="ml-auto text-[10px]">
                  Soon
                </Badge>
              </span>
            ),
          )}
        </nav>
        <div className="text-muted-foreground border-t p-4 text-xs">
          {user.company.name}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-4 border-b px-4 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {user.company.name}
            </p>
            <p className="text-muted-foreground truncate text-xs capitalize">
              {user.role} workspace
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <UserMenu
              fullName={user.fullName}
              email={user.email}
              role={user.role}
              onSignOut={onSignOut}
            />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
