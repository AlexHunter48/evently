function generateTicketId() {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TKT-${year}-${random}`;
}

export default generateTicketId;