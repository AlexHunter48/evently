// Generates a unique ticket ID
// Example output: TKT-2026-A3F9KZ

function generateTicketId() {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TKT-${year}-${random}`;
}

module.exports = generateTicketId;
