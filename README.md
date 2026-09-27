# Meeting Prep Assistant

A voice-first assistant that gets you ready for a meeting in seconds — it pulls
together who's attending, what they care about, and what documents matter,
then lets you ask natural follow-up questions.

Built for the **Build, Ship, Shape: Amazon Developer Hackathon** —
**Alexa+ Track** (simulated experience path) and the **AWS Builder Mini-Challenge**.

## Why this exists

Before any meeting you have to manually dig through your calendar, CRM notes,
and old docs just to remember who you're talking to and what's outstanding.
This assistant does that digging for you, out loud, and keeps context across
the conversation so you can ask "who else is joining?" without repeating
yourself.

## How it meets the hackathon tracks

- **Alexa+ (simulated experience path):** This project uses the hackathon's
  alternate submission path for the Alexa+ track — a web-based agentic
  experience built with any AI/agentic tool of choice, rather than a
  self-hosted MCP server. The UI simulates a voice assistant (speech input via
  the Web Speech API, spoken responses via speech synthesis) and the backend
  behaves like a stateful voice-assistant session.
- **AWS Builder Mini-Challenge:** All natural-language understanding and
  response generation is done via **Amazon Bedrock** (`lib/bedrock.js`), called
  through `@aws-sdk/client-bedrock-runtime`'s `ConverseCommand`. This is a
  real runtime call, not just a mention — see `lib/bedrock.js` for the
  integration.

## Architecture

```
public/index.html   → simulated voice UI (speech in/out, text fallback)
server.js            → Express API: session + command routes
lib/sessionStore.js  → in-memory conversation state per session
lib/bedrock.js       → Bedrock Converse API call, grounded in meeting context
data/mockData.js     → mock meetings/attendees/docs (swap for real Calendar/CRM APIs)
```

**Context flow:** each utterance is checked for a company name. If found, that
meeting is loaded and remembered for the session (`sessionStore.js`). If not
found, the assistant falls back to whatever meeting was last discussed — this
is what lets you ask short follow-ups.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment template and fill in AWS credentials with Bedrock
   Runtime access:
   ```bash
   cp .env.example .env
   ```
3. Make sure the model in `BEDROCK_MODEL_ID` is enabled for your account in
   the Bedrock console (Model access page).
4. Run it:
   ```bash
   npm start
   ```
5. Open `http://localhost:3000` and either click the mic (Chrome-based
   browsers) or type: *"Prep me for my Acme Corp meeting"*, then follow up
   with *"who else is joining?"*

## Demo script (for the submission video)

1. Say/type: "Prep me for my meeting with Acme Corp."
2. Follow up: "Who else is joining?"
3. Follow up: "What's outstanding with them?"
4. Switch context: "What about my Globex meeting?"

## Product Feedback (hackathon submission requirement)

> Fill this in after building — judges want direct feedback on the dev tools.

- **Tools/APIs used and for what:** Amazon Bedrock (Converse API) for
  generating grounded, context-aware briefings.
- **What worked well:**
- **What needs work:**
- **Onboarding experience (zero to hello world):**
- **Would you build with these again?**

## Roadmap / what's mocked

- `data/mockData.js` stands in for a real calendar + CRM integration. A real
  version would pull from Google Calendar, Salesforce/HubSpot, and a docs
  store (Drive/Notion) via their APIs.
- Session state is in-memory and resets on server restart — swap
  `lib/sessionStore.js` for DynamoDB/Redis for real persistence.

## License

MIT — see [LICENSE](./LICENSE).
