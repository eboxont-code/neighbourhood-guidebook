# Sewa dependency advisories

19 November 2026. Clean installation passed. Safe lockfile-only repair was attempted with `npm audit fix --package-lock-only --ignore-scripts` but npm failed internally (`edgesOut`). No dependency manifest or build configuration was changed.

| Package | Severity | Installed range | Fix reported |
|---|---|---|---|
| @esbuild-kit/core-utils | moderate | * | True |
| @esbuild-kit/esm-loader | moderate | * | True |
| @typescript-eslint/eslint-plugin | moderate | 6.16.0 - 8.72.2 | True |
| @typescript-eslint/parser | moderate | 6.16.0 - 8.72.2 | True |
| @typescript-eslint/type-utils | moderate | 6.16.0 - 8.72.2 | True |
| @typescript-eslint/typescript-estree | moderate | 6.16.0 - 8.72.2 | True |
| @typescript-eslint/utils | moderate | 6.16.0 - 8.72.2 | True |
| drizzle-kit | moderate | 0.19.0 - 1.0.0-beta.1-fd8bfcc | True |
| esbuild | moderate | <=0.24.2 | True |
| minimatch | moderate | 7.0.0 - 11.0.0 | True |
| typescript-eslint | moderate | <=8.72.2 | True |
| vite | high | 8.0.0 - 8.1.5 | {'name': 'vite', 'version': '8.3.8', 'isSemVerMajor': False} |
| zod | high | <4.6.6 | {'name': 'zod', 'version': '4.6.7', 'isSemVerMajor': True} |

The separate production scan reads bun.lock and still reports 12 advisory rows (6 high, 6 moderate). It is not a scan of the newly synchronized npm lockfile. Direct Zod remediation requires a major-version manifest change, outside this item’s permission. Owner approval and a successful lockfile repair are outstanding. No vulnerability suppression was added.
