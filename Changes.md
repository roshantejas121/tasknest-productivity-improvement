# TaskNest Productivity Improvement

## 1. Investigation Summary

The original Productivity Score mixed two unrelated sources of truth. Creating a task added five points to a stored `Score` row, while completing a task added another ten points. The `/score` endpoint then loaded completed tasks and added a second, dynamic momentum bonus. That bonus used one multiplier for fewer than two completed tasks and a different multiplier after two tasks. As a result, the displayed value depended on historical mutations and an opaque bonus rather than on the current task list.

The original implementation also did not provide the functionality requested by the client: tasks had no `important` or priority field, the task form could not mark a task as important, and task cards contained only a TODO comment for future support.

## 2. Problems Discovered

| Area | Problem | Product impact |
| --- | --- | --- |
| Score source of truth | Task creation and completion mutated a stored score independently of the tasks. | The score could remain inflated after a task was deleted or marked incomplete. |
| Score calculation | The score endpoint added an undocumented momentum bonus to the stored value. | Users could not explain why a particular action changed the score. |
| Important tasks | The data model and UI had no way to mark a task as important. | The client requirement about important work could not influence the score. |
| Consistency | The score was not bounded and used arbitrary increments and multipliers. | Comparing progress across task lists was difficult and unintuitive. |
| Frontend quality | The API URL was hard-coded and the baseline lint command failed on effect usage. | Deployment configuration was brittle and CI-style validation did not pass. |

## 3. Engineering Interpretation

I interpreted “consider important tasks” as a task-level importance flag, because the requirement describes important tasks rather than a separate user-wide priority system. I interpreted “help users stay consistent” as a completion-rate measure: users see the share of planned task weight they completed, instead of receiving points merely for creating tasks.

The resulting score is a transparent percentage from 0 to 100. Regular tasks have weight 1, important tasks have weight 2, and the score is calculated as:

> `round(completed task weight / total task weight × 100)`

This means completing an important task has twice the impact of completing a regular task, while adding, deleting, or editing a task changes the denominator in an understandable way. An empty task list returns 0 rather than an arbitrary initial score.

## 4. Implemented Changes

The Prisma `Task` model now includes `important Boolean @default(false)`. Task creation accepts and validates `important`, while task updates accept either `completed` or `important`. Invalid titles, IDs, and non-boolean values return clear 400 responses.

The stored-score mutation logic was removed from task creation and completion. The `/score` endpoint now reads the current task state and returns the weighted score together with completion counts, important-task counts, and weight totals. The helper is deterministic and bounded, so the same task list always produces the same result.

The interface now lets users mark a new task as important, toggle importance on an existing task, and see an “Important · counts double” label on important tasks. The score card explains the formula and shows both overall completion and important-task completion. The API client now supports `VITE_API_URL`, which makes the frontend configurable for deployment instead of being tied to `localhost`.

The seed data demonstrates the new field, and the existing React effect lint failures were corrected with cancellation-safe asynchronous loading. A focused regression test covers empty lists, weighted important tasks, and fully completed task sets.

## 5. Validation

The following checks pass locally:

| Check | Result |
| --- | --- |
| `node server/scoreHelper.test.js` | Passed |
| Backend JavaScript syntax checks | Passed |
| `npx prisma validate` | Passed |
| `npm run lint` in `client` | Passed |
| `npm run build` in `client` | Passed |

## 6. Deployment Links

- Frontend Deployment Link: To be added after deployment.
- Backend Deployment Link: To be added after deployment.

## 7. Video Explanation

The final submission video explains the original score behavior, the discovered inconsistencies, the important-task interpretation, the new weighted formula, and the validation results. The Google Drive link will be added after upload and sharing configuration.
