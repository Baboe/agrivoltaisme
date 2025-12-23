## Plan to Fix Sheep Farm Detail Page 404s

### Problem
Some Sheep Farm "View details" links resolve to 404 pages, e.g., /sheepfarms/netherlands/Alpaca%20Bontebok

This breaks trust and suppresses signal collection.

### Objective
Ensure every Sheep Farm "View details" link resolves to a valid page. No 404s, no hidden listings, no invented data.

### Resolution Rules
- Case A: Listing exists in data → Fix slug generation/routing to render correct detail page.
- Case B: Listing missing/incomplete → Render placeholder page with name, country, neutral message, existing claim/correct entry point.

### Implementation Steps
1. Modify `fetchSheepFarmByName` in `lib/data-service.ts` to accept country parameter and filter by country for accurate matching.

2. Update `app/sheepfarms/[country]/[name]/page.tsx`:
   - Remove `notFound()` call for missing farms.
   - Add placeholder rendering for Case B.
   - Update metadata for placeholders.
   - Include ClaimCorrectionForm for user feedback.

3. Placeholder content:
   - Breadcrumbs, back button.
   - Card with farm name, country, message "This listing is currently being validated."
   - ClaimCorrectionForm with farm name as solarParkName, country as location, "unknown" status.

### Files to Modify
- lib/data-service.ts
- app/sheepfarms/[country]/[name]/page.tsx

### Definition of Done
- No 404s on sheep farm detail links.
- All routes render intentionally.
- Placeholders for incomplete data.
- No new features added.

### Guiding Principle
Sparse page acceptable, broken page not. Preserve trust and signal flow.