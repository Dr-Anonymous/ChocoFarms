import { Recipe } from "@/data/recipes";
import { ADMIN_GITHUB_CONFIG } from "@/config/admin";

export const GITHUB_CONFIG = {
  owner: ADMIN_GITHUB_CONFIG.owner,
  repo: ADMIN_GITHUB_CONFIG.repo,
  branch: ADMIN_GITHUB_CONFIG.branch,
  recipesPath: ADMIN_GITHUB_CONFIG.recipesPath,
  rawUrl: ADMIN_GITHUB_CONFIG.rawUrl,
  storageKey: "chocofarms_github_token",
};

/**
 * Get GitHub Personal Access Token:
 * Prioritizes the token stored in the repository (src/config/admin.ts or VITE_GITHUB_TOKEN),
 * then falls back to localStorage if overridden.
 */
export function getGitHubToken(): string {
  if (ADMIN_GITHUB_CONFIG.githubToken && ADMIN_GITHUB_CONFIG.githubToken !== "ghp_YOUR_TOKEN_HERE") {
    return ADMIN_GITHUB_CONFIG.githubToken.trim();
  }
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(GITHUB_CONFIG.storageKey);
    if (stored) return stored.trim();
  }
  return "";
}

/**
 * Save GitHub Personal Access Token locally if needed
 */
export function setGitHubToken(token: string): void {
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem(GITHUB_CONFIG.storageKey, token.trim());
    } else {
      localStorage.removeItem(GITHUB_CONFIG.storageKey);
    }
  }
}

/**
 * Check if a token is configured
 */
export function hasGitHubToken(): boolean {
  return Boolean(getGitHubToken());
}

/**
 * Fetch latest recipes from GitHub raw or local fallback
 */
export async function fetchRecipesFromGitHub(): Promise<Recipe[] | null> {
  const timestamp = Date.now();
  
  // Try GitHub Raw first so updates are immediately visible worldwide
  try {
    const rawResponse = await fetch(`${GITHUB_CONFIG.rawUrl}?t=${timestamp}`, {
      headers: {
        "Accept": "application/json",
      },
    });
    if (rawResponse.ok) {
      const data = await rawResponse.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Could not fetch from GitHub raw URL, trying local public asset...", err);
  }

  // Fallback to local /recipes-data.json
  try {
    const localResponse = await fetch(`/recipes-data.json?t=${timestamp}`);
    if (localResponse.ok) {
      const data = await localResponse.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Could not fetch local recipes-data.json:", err);
  }

  return null;
}

/**
 * Commit updated recipes directly to GitHub (public/recipes-data.json)
 */
export async function updateGitHubRecipesFile(
  recipes: Recipe[],
  commitMessage: string,
  customToken?: string
): Promise<{ success: boolean; error?: string }> {
  const token = customToken || getGitHubToken();
  if (!token) {
    return {
      success: false,
      error: "No GitHub token configured in src/config/admin.ts",
    };
  }

  const { owner, repo, branch, recipesPath } = GITHUB_CONFIG;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${recipesPath}`;

  const headers = {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3+json",
  };

  let sha: string | undefined;

  // 1. Get existing file SHA if present
  try {
    const response = await fetch(`${apiUrl}?ref=${branch}`, { headers });
    if (response.ok) {
      const fileData = await response.json();
      sha = fileData.sha;
    } else if (response.status !== 404) {
      const errorBody = await response.text();
      console.warn(`Failed to get file SHA: ${response.statusText}`, errorBody);
    }
  } catch (error) {
    console.warn("Error fetching existing file SHA:", error);
  }

  // 2. Format JSON and convert to Base64 (Unicode safe)
  const contentString = JSON.stringify(recipes, null, 2);
  const contentBase64 = btoa(unescape(encodeURIComponent(contentString)));

  const body = JSON.stringify({
    message: commitMessage || "feat: Update recipes data",
    content: contentBase64,
    branch,
    sha,
  });

  // 3. PUT to GitHub API
  try {
    const updateResponse = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body,
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json().catch(() => ({}));
      const message = errorData.message || updateResponse.statusText;
      return {
        success: false,
        error: `GitHub API error (${updateResponse.status}): ${message}`,
      };
    }

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      error: err.message || "Network error while connecting to GitHub API",
    };
  }
}
