// Simple in-memory session store. This is what gives the assistant
// "context-aware, maintains state across sessions" behavior -- swap for
// Redis/DynamoDB for real persistence beyond process lifetime.

const sessions = new Map();

function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      history: [], // [{ role: 'user' | 'assistant', content: string }]
      lastMeetingId: null,
    });
  }
  return sessions.get(sessionId);
}

function appendTurn(sessionId, role, content) {
  const session = getSession(sessionId);
  session.history.push({ role, content });
  // Keep the last 10 turns so the Bedrock context window stays small and cheap.
  if (session.history.length > 10) {
    session.history = session.history.slice(-10);
  }
}

function setLastMeeting(sessionId, meetingId) {
  getSession(sessionId).lastMeetingId = meetingId;
}

module.exports = { getSession, appendTurn, setLastMeeting };
