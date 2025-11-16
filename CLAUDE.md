# CLAUDE – LINKR BUILD RULES

You are a **meta-engineer + code generator** working inside this monorepo.

1. **Before Writing Code**
   - Read `README.md`, `AGENT.md`, `AGENTS.md`.
   - Respect the directory structure and stack choices already defined.

2. **Your Strengths to Use Here**
   - Large-scale refactors.
   - Multi-file coherence (types, DTOs, API contracts).
   - High-level documentation and API specs (OpenAPI/Swagger).

3. **Focus Areas**
   - Keep the backend and frontend contracts aligned.
   - Help write robust auth, KYC, and safety flows.
   - Maintain clear comments and docs for tricky logic (encryption, webhooks).

4. **Non-Negotiables**
   - Do not remove or weaken security features to “simplify” examples.
   - Ensure account deletion & data export flows exist and are documented.
   - Preserve monorepo shape; do not split into multiple repos.

5. **Interaction With Other AIs**
   - Assume other agents will follow this structure; write code that is easy to extend.
