# HUMAN GATE — publication and Arbiter entry

**Current status: LOCAL_ONLY.** No remote repository, push, Pages run, deployment, live URL, external video, registration, post or submission has been created. The local static build is not a public deployment. Free app operation is possible; **the competition entry fee is not verified as zero**.

## Blocking review before any public or competition action

- [ ] Human confirms permission to publish this separate project and its source; reviews the MIT licence and original vector art.
- [ ] Human checks official [Arbiter overview](https://arbiter-hacks-v1.devpost.com/), [rules](https://arbiter-hacks-v1.devpost.com/rules), [dates](https://arbiter-hacks-v1.devpost.com/details/dates) and [updates](https://arbiter-hacks-v1.devpost.com/updates), resolving entry fee, new-work/reuse and AI-assistance policy. An AI tag is not blanket permission.
- [ ] Human confirms student, age, team and regional eligibility. Verified overview says students only, 13+, solo/teams 1–4 and region exclusions; this user’s eligibility is not known.
- [ ] Human clarifies cash versus sponsor credits and final prize terms. No return/acceptance/win/payment is promised; do not treat the headline pool as spendable cash.
- [ ] Human reviews all app/source/README/report disclaimers. Only selected glass/PET carbon references and the NIST conversion are source-backed. Mass/price/cost/displacement and opt-in illustrative factors remain assumptions. No path reports measured/net/marginal emissions or water savings; source water is unmodelled.
- [ ] Human reviews TEST_RESULTS.md and reruns tests; checks a real device as appropriate. Local checks are not a full hosted Pages/CI or cross-browser pass.
- [ ] Human removes private photos, notes, local profiles and personal exports from any intended public repository. .local/ is ignored; _site/ excludes .git, evidence, tests and submission drafts. Test evidence here contains only artificial test inputs, but still merits review.
- [ ] Human approves publication explicitly. Local code and a manual workflow configuration do not establish eligibility or submission readiness.

Verified calendar only: **20 Dec 2026 21:00 PST = 21 Dec 2026 13:00 Asia/Shanghai**. Missing public repo or video makes an Arbiter entry ineligible under the retrieved rules. Bracketed video wording remains ambiguous; this draft aims for 2:00, not a verified approved cap. A live deployment was not expressly required in the retrieved rules, but can aid judging if separately approved.

## Human-only free GitHub Pages path

1. After the gates above, the human creates an appropriate public GitHub repository and reviews/commits/pushes this independent app source. No such commands were run by this worker.
2. Human chooses **Settings → Pages → GitHub Actions** and checks current GitHub plan/Pages terms. This static app has no metered backend or API keys.
3. Human configures the **github-pages** environment with required reviewers/deployment protection where available. The input flag is an intentional manual gate, not a technical verifier of legal/rule compliance.
4. Human manually dispatches **HUMAN GATE - ReLoop Pages**, checking the public_release_approved flag only after review. Default is **false**, and both jobs are skipped without approval. There are **no push or PR deployment triggers**.
5. The workflow runs Node 22 built-in tests, copies the explicit public-file whitelist to _site/, uploads the Pages artifact and deploys under the protected environment. Browser E2E was local; this workflow does not claim it ran hosted-browser checks.
6. Human reads the **actual** resulting Pages URL from the successful job/Pages settings, opens it at desktop and 375px, exercises save/upload/slider/export/offline reload under the repository subpath, and records the observed result. Do not invent a URL from a guessed username/repository.
7. Human records/uploads a real working video, reviews DEVPOST_SUBMISSION_DRAFT.md and only then completes the external submission. Neither this file nor the draft story is a submission.

## Manual static fallback

    npm test
    npm run build

_site/ is the complete static deploy artifact; it contains only app shell files. A host must serve module JavaScript with a JavaScript MIME type and the app via HTTPS for offline caching. Do not upload the entire working directory as a website.

## Updates and safety

Bump sw.js’s cache version when changing shell files, re-test offline/nested paths, and review new factors before making claims. Local browser storage has no cloud backup; changing origin/repository/port creates a separate shelf. Keep the LOCAL_ONLY status until actual external actions and all remaining gates are evidenced; do not copy this package to READY_TO_SUBMIT while rules remain unresolved.
