# Friction Log

Submitting this can earn up to a 10% judging bonus. Fill in an entry each
time something in the dev tools/docs slowed you down.

## Entry template

- **Task attempted:**
- **Steps taken:**
- **Expected result:**
- **Actual result:**
- **Severity:** (Low / Medium / High)
- **Workaround used:**
- **Suggestion:**

---

## Entry 1

- **Task attempted:** Running `npm install` for the first time on Windows.
- **Steps taken:** Opened a terminal in VS Code and ran `npm install`.
- **Expected result:** Dependencies install normally.
- **Actual result:** Blocked with a PowerShell security error: "running scripts is disabled on this system."
- **Severity:** Medium
- **Workaround used:** Ran `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` once, then install worked.
- **Suggestion:** Docs for Node/npm setup on Windows should mention this PowerShell policy upfront, since it's a common first-run blocker for anyone new to the terminal.

---

## Entry 2

- **Task attempted:** Calling Claude Sonnet 4.6 through Bedrock's Converse API.
- **Steps taken:** Used the plain model ID (`anthropic.claude-sonnet-4-6`) shown on the model's overview page.
- **Expected result:** The model responds normally.
- **Actual result:** `ValidationException: Invocation of model ID ... with on-demand throughput isn't supported. Retry your request with the ID or ARN of an inference profile.`
- **Severity:** High
- **Workaround used:** Found the correct value under Bedrock → Inference profiles, and used the full inference profile ARN instead of the plain model ID.
- **Suggestion:** The model overview page could directly link to or display the required inference profile ID/ARN when on-demand isn't supported for that model, instead of only surfacing this via a runtime error.

---

## Entry 3

- **Task attempted:** Verifying model access was correctly granted in the app.
- **Steps taken:** Tested the exact same prompt directly in the Bedrock Playground.
- **Expected result:** Determine if the issue was AWS-side or code-side.
- **Actual result:** Playground worked instantly with the same model, which helped isolate the bug to the app's configuration, not AWS access.
- **Severity:** Low
- **Workaround used:** Used the Playground's "API request" view to confirm the exact working `--model-id` string.
- **Suggestion:** None — this was actually a great debugging tool once I found it; more visibility to this feature for beginners would help.
