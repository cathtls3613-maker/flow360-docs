/**
 * Enforces Conventional Commits so the git history reads like a changelog.
 * Format: <type>(<optional scope>): <description>
 * Example: feat(pricing): add cost-plus calculation method
 */
const commitlintConfig = {
  extends: ["@commitlint/config-conventional"],
};

export default commitlintConfig;
