const ContactMessage = require('../models/ContactMessage');

module.exports = {
  create(req, res) {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required.' });
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }
    const row = ContactMessage.create({ name, email, phone, subject, message });
    res.status(201).json({ data: { id: row.id, message: 'Message received. Thank you!' } });
  },

  listAdmin(req, res) {
    res.json({ data: ContactMessage.all() });
  },

  markRead(req, res) {
    ContactMessage.markRead(req.params.id);
    res.json({ data: { message: 'Marked as read.' } });
  },

  destroy(req, res) {
    const ok = ContactMessage.remove(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Not found.' });
    res.status(204).send();
  },
};
