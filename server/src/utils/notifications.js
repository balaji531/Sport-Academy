const Notification = require('../models/Notification');

/**
 * Create a notification and emit via Socket.IO if io is provided
 */
const createNotification = async (io, { userId, title, message, type = 'general', link }) => {
  const notif = await Notification.create({ user: userId, title, message, type, link });
  if (io) {
    io.to(String(userId)).emit('notification', notif);
  }
  return notif;
};

module.exports = { createNotification };
