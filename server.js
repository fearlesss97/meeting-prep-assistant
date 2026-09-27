require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const { findMeetingByCompany, findMeetingById } = require("./data/mockData");
const { getSession, appendTurn, setLastMeeting } = require("./lib/sessionStore");
const { generateBriefing } = require("./lib/bedrock");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Start a new conversational session (mirrors an Alexa+ session start).
app.post("/api/session", (req, res) => {
  const sessionId = uuidv4();
  getSession(sessionId); // initializes it
  res.json({ sessionId });
});

// Handle a spoken/typed command.
app.post("/api/command", async (req, res) => {
  try {
    const { sessionId, text } = req.body;
    if (!sessionId || !text) {
      return res.status(400).json({ error: "sessionId and text are required" });
    }

    const session = getSession(sessionId);

    // Very small intent layer: try to detect a company name in the utterance
    // to load a *new* meeting into context; otherwise, fall back to whatever
    // meeting was last discussed in this session (this is the "remembers
    // context across turns" behavior).
    let meeting = null;
    const companyMatch = findMeetingByCompany(text);
    if (companyMatch) {
      meeting = companyMatch;
      setLastMeeting(sessionId, meeting.id);
    } else if (session.lastMeetingId) {
      meeting = findMeetingById(session.lastMeetingId);
    }

    appendTurn(sessionId, "user", text);

    const replyText = await generateBriefing({
      meeting,
      conversationHistory: session.history.slice(0, -1), // exclude the turn we just added
      userQuery: text,
    });

    appendTurn(sessionId, "assistant", replyText);

    res.json({
      response: replyText,
      meeting: meeting ? { id: meeting.id, title: meeting.title } : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong generating a response." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Meeting Prep Assistant running at http://localhost:${PORT}`);
});
