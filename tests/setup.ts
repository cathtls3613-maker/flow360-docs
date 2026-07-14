import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// jsdom (the simulated browser used in unit tests) does not implement
// window.matchMedia, which next-themes needs for system theme detection.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
