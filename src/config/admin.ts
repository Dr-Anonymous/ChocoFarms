// Admin configuration
// In production, these are injected via GitHub Actions secrets/variables during build.
// In local development, they are read from your local .env file.

export const ADMIN_GITHUB_CONFIG = {
  owner: "Dr-Anonymous",
  repo: "ChocoFarms",
  branch: "main",
  recipesPath: "public/recipes-data.json",
  rawUrl: "https://raw.githubusercontent.com/Dr-Anonymous/ChocoFarms/main/public/recipes-data.json",

  // GitHub Personal Access Token with 'repo' scope
  githubToken: (import.meta.env.VITE_GITHUB_TOKEN as string) || "",

  // Password guarding /admin against unauthorized edits
  adminPassword: (import.meta.env.VITE_ADMIN_PASSWORD as string) || "",
};

