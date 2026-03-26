# ScioEdu Intranet

Internal intranet for the ScioPolis organization. Login via Google OAuth restricted to the `@scioskola.cz` domain.

## Detailed docs

- **Architecture & stack:** `.claude/docs/architecture.md`
- **Conventions & shadcn/ui:** `.claude/docs/conventions.md`

---

## Work Strategy

**Parallelize** — when a task can be split into independent parts, always run subagents in parallel (single message, multiple Agent tool calls). Sequential by default is an antipattern.

**Explore in parallel** — prefer parallel codebase searches (Glob + Grep at the same time) over sequential. When unsure where to look, use the Explore agent instead of repeated Grep calls.

**Read before writing** — never propose changes to code you haven't read. Read the relevant files, understand the context, then write.

**Minimal intervention** — do only what was asked. Don't fix surrounding code, don't add docstrings, don't refactor "while you're at it". A simple fix doesn't need architecture.

**Failure = stop and reassess** — if an approach doesn't work on the first or second try, don't keep repeating the same thing. Stop, diagnose the root cause, change the approach. After 3 failed attempts use `/systematic-debugging`.

**Evidence first** — never say "should work" without running the command and reading the output. Done = green output in the terminal.

**Use specialized agents** — for Rails/RSpec use `backend-rails`, for Vue use `frontend-vue`, for React use `frontend-react`. Agents have specialized context and are faster than the general approach.

---

## Boundaries — what the agent may and may not do

✅ **Always safe:** Reading files, running lint/build, searching code, editing components

⚠️ **Ask first:**
- Task requires deleting or major restructuring of existing files
- There are 2+ valid architectural approaches with real trade-offs
- Instruction conflicts with CLAUDE.md
- A dependency or env variable is missing

🚫 **Never:**
- Never push directly to `main` — always branch + PR
- Never commit with a broken build or unresolved lint errors
- Never add a new shadcn component if an existing one can be extended
- Never chain `git add` and `git commit` with `&&`
- Never store sensitive values (tokens, keys) in code — only via env variables

---

## Git — workflow for every task

1. Check current branch: `git branch --show-current`
2. If `main` → always create a new branch. Feature branch → compare with existing changes.
3. New branch: `git checkout main && git pull origin main && git checkout -b [type/description]`
4. Naming: `feature/`, `fix/`, `issue-<number>`
5. Implement → lint + build → commit → push → `gh pr create`

Commit messages in English, concise.

---

## Self-review before finishing

1. Find ALL places that depend on what you changed.
2. Run `npm run lint` and `npm run build` — both must pass.
3. Review the full git diff before declaring done.
4. Ask yourself: **"Would an experienced developer approve this?"** If not, fix it.
