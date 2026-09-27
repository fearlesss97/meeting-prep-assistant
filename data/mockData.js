// Mock data standing in for calendar, CRM, and docs integrations.
// Swap this out for real Google Calendar / CRM / Drive APIs post-hackathon.

const meetings = [
  {
    id: "m1",
    title: "Acme Corp Renewal Call",
    company: "Acme Corp",
    time: "2026-09-28T15:00:00Z",
    attendees: [
      {
        name: "Dana Whitfield",
        role: "VP of Operations",
        company: "Acme Corp",
        lastInteraction:
          "Raised concerns about onboarding time in the last QBR (Aug 2026).",
      },
      {
        name: "Marcus Lee",
        role: "IT Director",
        company: "Acme Corp",
        lastInteraction:
          "Requested SSO support via email three weeks ago, still unresolved.",
      },
    ],
    relatedDocs: [
      {
        title: "Acme Corp QBR Notes - Aug 2026",
        summary:
          "Renewal is likely but contingent on resolving onboarding friction and SSO support before contract end date.",
      },
      {
        title: "Acme Corp Contract Summary",
        summary:
          "Current contract value $84,000/yr, renews annually, expires Nov 2026.",
      },
    ],
  },
  {
    id: "m2",
    title: "Globex Kickoff",
    company: "Globex",
    time: "2026-09-29T18:00:00Z",
    attendees: [
      {
        name: "Priya Nair",
        role: "Head of Product",
        company: "Globex",
        lastInteraction:
          "First meeting with this contact; came in via inbound demo request.",
      },
    ],
    relatedDocs: [
      {
        title: "Globex Demo Request Form",
        summary:
          "Interested primarily in the analytics dashboard and API access tier.",
      },
    ],
  },
];

function findMeetingByCompany(query) {
  const q = query.toLowerCase();
  return meetings.find(
    (m) =>
      q.includes(m.company.toLowerCase()) || q.includes(m.title.toLowerCase())
  );
}
  

function findMeetingById(id) {
  return meetings.find((m) => m.id === id);
}

module.exports = { meetings, findMeetingByCompany, findMeetingById };
