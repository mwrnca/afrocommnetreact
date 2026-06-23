// featureFlags.js
// Central control for what's visible across the whole app.
// Flip a value to true to "release" that feature/section.
// Keep this as the ONLY place these booleans live — never duplicate them in components.

export const FEATURES = {
  // ── Nav sections / whole pages ──
  todo:         true,
  inbox:        true,
  tools:        true,
  communities:  true,
  settings:     true,
  directory:    true,   // consumer directory browsing
  employeeMgmt: true,   // management dashboard
  employeeApp:  true,   // employee-side dashboard

  // ── In-page features (finer grained) ──
  salesGraph:        false,
  expensesGraph:     false,
  revenueGraph:      false,
  voiceInput:        true,
  attachments:       true,
  publicChannel:     true,
  pinnedChats:       true,
  inboxPeopleTab:    true,
  conversationPdf:   true,
  privateCommunities: true,
  calendarBooking:   true,  // not built yet, placeholder for later
  aiAssistant:       true,  // not built yet, placeholder for later
  updateDataForm:    false,
};