import React, { useState } from 'react';
import { Users, Search, ShieldAlert, CheckCircle2, XCircle, DollarSign, Edit3, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminUserManager: React.FC = () => {
  const { usersList, banUser, unbanUser, adminAdjustWallet } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = usersList.filter((u) => {
    return (
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.ingameName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery) ||
      u.freeFireUid.includes(searchQuery)
    );
  });

  return (
    <div className="space-y-4 pb-20 pt-2 px-3 sm:px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#121722] rounded-2xl p-4 border border-amber-500/40 shadow-md flex flex-col sm:flex-row justify-between items-center gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" /> USER ACCOUNTS MANAGER ({usersList.length})
          </h2>
          <p className="text-xs text-gray-400">Search gamers by Ingame Name, FF UID, Email, Phone & Ban toxic players.</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search User / FF UID..."
            className="w-full bg-[#182030] border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.map((u) => (
          <div
            key={u.id}
            className={`bg-[#121722] rounded-2xl p-4 border transition-all shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
              u.isBanned ? 'border-red-500/80 bg-red-950/20' : 'border-gray-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={u.avatarUrl}
                alt={u.ingameName}
                className="w-12 h-12 rounded-xl object-cover border border-gray-700 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-white">{u.ingameName}</h3>
                  {u.role === 'admin' && (
                    <span className="px-1.5 py-0.2 bg-amber-500 text-black font-black text-[9px] rounded uppercase">
                      ADMIN
                    </span>
                  )}
                  {u.isBanned && (
                    <span className="px-1.5 py-0.2 bg-red-600 text-white font-black text-[9px] rounded uppercase animate-pulse">
                      BANNED
                    </span>
                  )}
                </div>
                <p className="text-xs text-amber-300 font-mono mt-0.5">
                  UID: {u.freeFireUid} • Phone: {u.phone}
                </p>
                <p className="text-[11px] text-gray-400">
                  Email: {u.email} • Joined: {u.joinedDate}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-gray-800">
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Wallet Balance</span>
                <span className="text-base font-black text-emerald-400">৳{u.walletBalance}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {u.isBanned ? (
                  <button
                    onClick={() => unbanUser(u.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Unban User
                  </button>
                ) : (
                  <button
                    onClick={() => banUser(u.id, 'Hacking / Toxic behavior detected')}
                    className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-400 border border-red-500/40 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Ban User
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
