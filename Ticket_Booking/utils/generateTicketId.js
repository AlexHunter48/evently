// Generates a unique ticket ID in the format: TKT-2024-ABC123

function generateTicketId() {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TKT-${year}-${random}`;
}

module.exports = generateTicketId;
