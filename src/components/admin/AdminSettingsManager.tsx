import React, { useState } from 'react';
import { Settings, Shield, Power, Phone, Mail, FileText, Check, Copy } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CopyButton } from '../common/CopyButton';

export const AdminSettingsManager: React.FC = () => {
  const { appSettings, updateAppSettings, copyEverythingState, showToast } = useApp();

  const [version, setVersion] = useState(appSettings.appVersion);
  const [maintenance, setMaintenance] = useState(appSettings.maintenanceMode);
  const [supportPhone, setSupportPhone] = useState(appSettings.supportPhone);
  const [telegram, setTelegram] = useState(appSettings.telegramChannel);
  const [email, setEmail] = useState(appSettings.supportEmail);
  const [apPasscode, setApPasscode] = useState(localStorage.getItem('ap_passcode') || '123456');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apPasscode.length < 4) {
      showToast('⚠️ AP Passcode must be at least 4 digits!');
      return;
    }
    localStorage.setItem('ap_passcode', apPasscode);
    updateAppSettings({
      appVersion: version,
      maintenanceMode: maintenance,
      supportPhone,
      telegramChannel: telegram,
      supportEmail: email
    });
    showToast('⚡ Admin configurations & AP Passcode saved!');
  };

  return (
    <div className="space-y-4 pb-20 pt-2 px-3 sm:px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#121722] rounded-2xl p-4 border border-amber-500/40 shadow-md">
        <h2 className="text-xl font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-400" /> SYSTEM CONFIGURATION & MAINTENANCE
        </h2>
        <p className="text-xs text-gray-400">Configure global app settings, maintenance mode, version numbers & support links.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Maintenance & Versioning */}
        <div className="bg-[#121722] p-5 rounded-2xl border border-gray-800 space-y-3 shadow-md">
          <h3 className="font-extrabold text-white text-sm uppercase flex items-center gap-2">
            <Power className="w-4 h-4 text-red-500" /> System State
          </h3>

          <div className="flex items-center justify-between p-3 bg-[#182030] rounded-xl border border-gray-800">
            <div>
              <p className="text-xs font-bold text-white">App Maintenance Mode</p>
              <p className="text-[11px] text-gray-400">If enabled, non-admin users cannot access tournament matches.</p>
            </div>
            <button
              type="button"
              onClick={() => setMaintenance(!maintenance)}
              className={`w-12 h-7 rounded-full p-1 transition-all cursor-pointer ${
                maintenance ? 'bg-red-600' : 'bg-gray-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-all ${
                  maintenance ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
            <div>
              <label className="block text-gray-300 font-bold mb-1">App Release Version</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-amber-300 font-extrabold mb-1 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-amber-400" /> AP Portal Passcode (এডমিন পাসওয়ার্ড)
              </label>
              <input
                type="text"
                value={apPasscode}
                onChange={(e) => setApPasscode(e.target.value)}
                placeholder="e.g. 123456"
                className="w-full bg-[#182030] border border-amber-500/60 rounded-xl px-3 py-2 text-amber-300 font-mono font-black text-sm"
                required
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Enter the passcode required when tapping AP button 5 times. Default is 123456.
              </p>
            </div>
          </div>
        </div>

        {/* Support Contacts */}
        <div className="bg-[#121722] p-5 rounded-2xl border border-gray-800 space-y-3 shadow-md">
          <h3 className="font-extrabold text-white text-sm uppercase flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400" /> Support Contact Channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-gray-300 font-bold mb-1">WhatsApp Support Number</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Telegram Channel Username</label>
              <input
                type="text"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Official Support Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 py-3 bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider shadow-lg cursor-pointer"
          >
            Save Admin Configurations ✅
          </button>

          <button
            type="button"
            onClick={copyEverythingState}
            className="px-5 py-3 bg-gray-800 hover:bg-gray-700 text-amber-300 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
          >
            Copy Everything A-Z 📋
          </button>
        </div>
      </form>
    </div>
  );
};
