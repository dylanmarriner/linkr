# Moderation & Takedown SOP (Draft)
- Reporting: `/api/moderation/report` receives reports and creates ModerationEvent records.
- SLA: Initial triage within 24 hours; escalation to admin within 48 hours.
- Evidence: All actions logged in AuditLog; media actions require signed URLs.
