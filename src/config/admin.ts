// Admin configuration stored directly in the repository
// To allow all your devices (phone, laptop, iPad) to publish/update recipes seamlessly from /admin:
// Paste your GitHub Personal Access Token (PAT with 'repo' scope) below,
// or provide it as VITE_GITHUB_TOKEN in .env.local

export const ADMIN_GITHUB_CONFIG = {
  owner: "Dr-Anonymous",
  repo: "ChocoFarms",
  branch: "main",
  recipesPath: "public/recipes-data.json",
  rawUrl: "https://raw.githubusercontent.com/Dr-Anonymous/ChocoFarms/main/public/recipes-data.json",
  
  // Stored in repo / env so ANY device accessing /admin can publish immediately:
  // Paste your PAT string here (e.g. "ghp_xxxx") to commit it to the repository:
  githubToken: (import.meta.env.VITE_GITHUB_TOKEN as string) || "",

  // Simple password to guard /admin against public/unauthorized edits:
  // You can customize this here in the repo or via VITE_ADMIN_PASSWORD in .env.local
  adminPassword: (import.meta.env.VITE_ADMIN_PASSWORD as string) || "chocofarms2026",
};
