---
name: Use pnpm not npm
description: Always use pnpm for package management in this project, never npm
type: feedback
---

Always use `pnpm` for installing packages in both dicas-frontapp and dicas-backapp. Never use `npm install`.

**Why:** User explicitly corrected npm → pnpm usage.

**How to apply:** Any `npm install` or `npm add` command should be `pnpm add` instead.
