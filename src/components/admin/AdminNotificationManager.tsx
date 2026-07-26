import React, { useState } from 'react';
import { Bell, Send, Megaphone, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminNotificationManager: React.FC = () => {
  const {
    notifications,
    sendNotification,
    noticeTickerText,
    updateNoticeTicker,
    showToast
  } = useApp();

  const [notifTitle, setNotifTitle] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [tickerInput, setTickerInput] = useState(noticeTickerText);

  const handleSendNotif = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifBody.trim()) {
      showToast('Please enter notification title and message body!');
      return;
    }
    sendNotification(notifTitle.trim(), notifBody.trim());
    setNotifTitle('');
    setNotifBody('');
  };

  const handleUpdateTicker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tickerInput.trim()) return;
    updateNoticeTicker(tickerInput.trim());
  };

  return (
    <div className="space-y-4 pb-20 pt-2 px-3 sm:px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#121722] rounded-2xl p-4 border border-amber-500/40 shadow-md">
        <h2 className="text-xl font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-400" /> BROADCAST NOTIFICATIONS & TICKER
        </h2>
        <p className="text-xs text-gray-400">Broadcast pop-up notifications to all app users and edit marquee notice text.</p>
      </div>

      {/* Notice Board Ticker Editor */}
      <form onSubmit={handleUpdateTicker} className="bg-[#121722] p-5 rounded-2xl border border-red-500/40 space-y-3 shadow-md">
        <h3 className="font-extrabold text-white text-sm uppercase flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-red-500" /> Marquee Notice Ticker Text
        </h3>

        <div>
          <textarea
            value={tickerInput}
            onChange={(e) => setTickerInput(e.target.value)}
            rows={2}
            className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
            required
          />
        </div>

        <button
          type="submit"
          className="px-5 py-2 bg-gradient-to-r from-red-600 to-amber-500 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider cursor-pointer"
        >
          Update Notice Ticker 📢
        </button>
      </form>

      {/* Push Notification Broadcast Form */}
      <form onSubmit={handleSendNotif} className="bg-[#121722] p-5 rounded-2xl border border-amber-500/40 space-y-3 shadow-md">
        <h3 className="font-extrabold text-white text-sm uppercase flex items-center gap-2">
          <Send className="w-4 h-4 text-amber-400" /> Broadcast Global Push Alert
        </h3>

        <div className="space-y-2 text-xs">
          <div>
            <label className="block text-gray-300 font-bold mb-1">Notification Title</label>
            <input
              type="text"
              value={notifTitle}
              onChange={(e) => setNotifTitle(e.target.value)}
              placeholder="e.g. 🔴 GRAND LONE WOLF MATCH ROOM OPEN NOW"
              className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-1">Notification Message</label>
            <textarea
              value={notifBody}
              onChange={(e) => setNotifBody(e.target.value)}
              rows={3}
              placeholder="Enter push notification message..."
              className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-extrabold text-xs rounded-xl uppercase tracking-wider cursor-pointer"
        >
          Send Push Alert to All Users ⚡
        </button>
      </form>

      {/* Broadcast History */}
      <div className="bg-[#121722] p-5 rounded-2xl border border-gray-800 space-y-3 shadow-md">
        <h3 className="font-extrabold text-gray-300 text-xs uppercase">Broadcast Log History</h3>
        <div className="space-y-2">
          {notifications.map((n) => (
            <div key={n.id} className="p-3 bg-[#182030] rounded-xl border border-gray-800 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">{n.title}</span>
                <span className="text-[10px] text-gray-500 font-mono">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-300 text-[11px] mt-1">{n.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
