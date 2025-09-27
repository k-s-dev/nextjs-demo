// to be in sync with THEMES in `src/lib/components/nav/theme/NavThemeToggleButton.tsx`
const THEMES = ["light", "dark"];

let themeName = document.cookie
  .split("; ")
  .find((row) => row.startsWith("theme="))
  ?.split("=")[1];

if (!THEMES.includes(themeName) && window.matchMedia) {
  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    themeName = "light";
  }
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    themeName = "dark";
  }
}

document.documentElement.setAttribute("data-theme", themeName);
document.cookie = `theme=${themeName}; max-age=${60 * 60 * 24 * 30};`

