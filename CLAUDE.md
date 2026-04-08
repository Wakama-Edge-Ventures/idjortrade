# IdjorTrade Memory
## Core Rules
- Plan before coding. Use Spec-Kit for specs, breakdowns, and verification.
- RTK for terminal: prefix with `rtk` on build/test/git/logs.
- UI/UX Pro Max for design, layouts, dashboards, pricing, onboarding.
- Security tools before merge on auth, payments, data flows.
- Keep changes scoped, testable, incremental.
## RTK
rtk git status/diff/add/commit/push
rtk cargo test/build/check
rtk next build
rtk pnpm install
rtk grep "pattern"
rtk err <cmd>
rtk summary <cmd>
rtk gain
text
## Spec-Kit
- Specs for unclear requirements or multi-file changes.
- Short, testable, implementation-focused.
## UI/UX Pro Max
- UI, UX, design system, dashboards, pricing, onboarding.
- Institutional, premium, fintech sober. No crypto-generic.
- Strong hierarchy, restrained color, clean components.
## Security Tools
- Semgrep, Gitleaks before merge.
- Check auth, payments, endpoints.
## Project Focus
- IdjorTrade: fintech/trading UI, credibility first.
- Wakama: agritech, trust, simplicity.