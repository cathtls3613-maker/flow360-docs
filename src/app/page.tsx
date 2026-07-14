import {
  BotIcon,
  BoxesIcon,
  CalculatorIcon,
  FileTextIcon,
  GaugeIcon,
  HandshakeIcon,
  LayoutDashboardIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  TagIcon,
  UsersIcon,
  WarehouseIcon,
  WrenchIcon,
} from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const modules = [
  {
    name: "Smart Costing",
    description: "Layered cost build-up from supplier cost to company cost.",
    icon: CalculatorIcon,
  },
  {
    name: "Smart Pricing",
    description: "Configurable pricing methods with full margin visibility.",
    icon: TagIcon,
  },
  {
    name: "CPQ",
    description: "Configure, price, and quote complex equipment fast.",
    icon: FileTextIcon,
  },
  {
    name: "CRM",
    description: "Customers, contacts, opportunities, and follow-ups.",
    icon: UsersIcon,
  },
  {
    name: "Purchasing",
    description: "Supplier orders, confirmations, and landed costs.",
    icon: ShoppingCartIcon,
  },
  {
    name: "Inventory",
    description: "Stock levels, valuation, and replenishment.",
    icon: BoxesIcon,
  },
  {
    name: "Warehouse",
    description: "Receiving, put-away, picking, and dispatch.",
    icon: WarehouseIcon,
  },
  {
    name: "Service",
    description: "Work orders, field service, and repairs.",
    icon: WrenchIcon,
  },
  {
    name: "Installed Base",
    description: "Every asset at every customer site, tracked for life.",
    icon: MapPinIcon,
  },
  {
    name: "Warranty",
    description: "Claims, coverage, and supplier recovery.",
    icon: ShieldCheckIcon,
  },
  {
    name: "Customer Portal",
    description: "Self-service quotes, orders, and documents.",
    icon: GaugeIcon,
  },
  {
    name: "Supplier Portal",
    description: "Quotation requests and order collaboration.",
    icon: HandshakeIcon,
  },
  {
    name: "AI Copilot",
    description: "Reads documents, suggests prices, predicts wins.",
    icon: BotIcon,
  },
  {
    name: "Executive Dashboard",
    description: "The whole business on one screen.",
    icon: LayoutDashboardIcon,
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight">FLOW360</span>
            <Badge variant="secondary">Foundation</Badge>
          </div>
          <ModeToggle />
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4">
              Sprint 1 — Platform Foundation
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              The AI Operating System for Industrial Equipment Distributors
            </h1>
            <p className="text-muted-foreground mt-6 text-lg text-balance">
              One platform for costing, pricing, quoting, selling, purchasing,
              stocking, and servicing industrial equipment — built to replace
              spreadsheets, not to imitate them.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
          <h2 className="sr-only">Planned modules</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <Card key={module.name} className="gap-4">
                <CardHeader>
                  <div className="bg-muted mb-2 flex size-10 items-center justify-center rounded-lg">
                    <module.icon className="size-5" aria-hidden="true" />
                  </div>
                  <CardTitle>{module.name}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="text-muted-foreground mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 text-sm sm:px-6">
          <span>FLOW360</span>
          <span>Built for distributors, by distributors.</span>
        </div>
      </footer>
    </div>
  );
}
