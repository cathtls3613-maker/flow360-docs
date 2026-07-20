import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import { describe, expect, it } from "vitest";

import { ModeToggle } from "@/components/mode-toggle";

function renderToggle() {
  return render(
    <ThemeProvider attribute="class">
      <ModeToggle />
    </ThemeProvider>,
  );
}

describe("ModeToggle", () => {
  it("renders an accessible theme button", () => {
    renderToggle();
    expect(
      screen.getByRole("button", { name: /toggle theme/i }),
    ).toBeInTheDocument();
  });

  it("shows light, dark, and system options when opened", async () => {
    const user = userEvent.setup();
    renderToggle();

    await user.click(screen.getByRole("button", { name: /toggle theme/i }));

    expect(
      await screen.findByRole("menuitem", { name: /light/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /dark/i })).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /system/i }),
    ).toBeInTheDocument();
  });
});
