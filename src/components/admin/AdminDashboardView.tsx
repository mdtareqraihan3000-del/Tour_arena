import React from 'react';
import { Shield, Users, Gamepad2, Wallet, ArrowDownCircle, ArrowUpCircle, Play, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDashboardView: React.FC = () => {
  const {
    usersList,
    matches,
    deposits,
    withdraws,
    transactions,
    reports,
    setActiveAdminTab
  } = useApp();

  const totalUsers = usersList.length;
  const totalMatches = matches.length;
  const liveMatchesCount = matches.filter((m) => m.status === 'live').length;

  const pendingDeposits = deposits.filter((d) => d.status === 'pending');
  const pendingWithdraws = withdraws.filter((w) => w.status === 'pending');

  const totalDepositAmount = deposits
    .filter((d) => d.status === 'approved')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalWithdrawAmount = withdraws
    .filter((w) => w.status === 'approved')
    .reduce((sum, w) => sum + w.amount, 0);

  return (
    <div className="space-y-5 pb-20 pt-2 px-3 sm:px-4 max-w-5xl mx-auto">
      {/* Admin Portal Banner */}
      <div className="bg-gradient-to-r from-[#1E1B10] via-[#2A1F10] to-[#1E1B10] rounded-2xl p-5 border-2 border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500 text-black rounded-xl font-black shadow-lg">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded font-black uppercase">
                ADMINISTRATION PORTAL
              </span>
              <h2 className="text-xl font-black text-white mt-0.5">FIRE ARENA CONTROL CENTER</h2>
              <p className="text-xs text-gray-300">Real-time tournament match manager, deposit/withdraw approvals & user control.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => setActiveAdminTab('users')}
          className="bg-[#121722] p-4 rounded-2xl border border-gray-800 hover:border-amber-500/50 cursor-pointer transition-all shadow-md"
        >
          <div className="flex justify-between items-center text-gray-400 mb-1">
            <span className="text-[10px] font-bold uppercase">Users</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-black text-white">{totalUsers}</span>
        </div>

        <div
          onClick={() => setActiveAdminTab('matches')}
          className="bg-[#121722] p-4 rounded-2xl border border-gray-800 hover:border-amber-500/50 cursor-pointer transition-all shadow-md"
        >
          <div className="flex justify-between items-center text-gray-400 mb-1">
            <span className="text-[10px] font-bold uppercase">Matches</span>
            <Gamepad2 className="w-4 h-4 text-red-500" />
          </div>
          <span className="text-2xl font-black text-white">{totalMatches}</span>
        </div>

        <div
          onClick={() => setActiveAdminTab('matches')}
          className="bg-[#121722] p-4 rounded-2xl border border-red-500/50 cursor-pointer transition-all shadow-md"
        >
          <div className="flex justify-between items-center text-gray-400 mb-1">
            <span className="text-[10px] font-bold uppercase">Live Rooms</span>
            <Play className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
          </div>
          <span className="text-2xl font-black text-red-400">{liveMatchesCount}</span>
        </div>

        <div
          onClick={() => setActiveAdminTab('wallet')}
          className="bg-[#121722] p-4 rounded-2xl border border-gray-800 hover:border-emerald-500/50 cursor-pointer transition-all shadow-md"
        >
          <div className="flex justify-between items-center text-gray-400 mb-1">
            <span className="text-[10px] font-bold uppercase">Deposits</span>
            <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xl font-black text-emerald-400">৳{totalDepositAmount}</span>
        </div>

        <div
          onClick={() => setActiveAdminTab('wallet')}
          className="bg-[#121722] p-4 rounded-2xl border border-gray-800 hover:border-red-500/50 cursor-pointer transition-all shadow-md"
        >
          <div className="flex justify-between items-center text-gray-400 mb-1">
            <span className="text-[10px] font-bold uppercase">Cashouts</span>
            <ArrowUpCircle className="w-4 h-4 text-red-400" />
          </div>
          <span className="text-xl font-black text-red-400">৳{totalWithdrawAmount}</span>
        </div>

        <div
          onClick={() => setActiveAdminTab('reports')}
          className="bg-[#121722] p-4 rounded-2xl border border-gray-800 hover:border-amber-500/50 cursor-pointer transition-all shadow-md"
        >
          <div className="flex justify-between items-center text-gray-400 mb-1">
            <span className="text-[10px] font-bold uppercase">Reports</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-black text-amber-400">{reports.length}</span>
        </div>
      </div>

      {/* Action shortcuts / Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pending Deposit Requests Alert */}
        <div className="bg-[#121722] rounded-2xl p-4 border border-emerald-500/40 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <ArrowDownCircle className="w-4 h-4 text-emerald-400" /> Pending Deposit Approvals ({pendingDeposits.length})
            </h3>
            <button
              onClick={() => setActiveAdminTab('wallet')}
              className="text-xs text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              Manage All
            </button>
          </div>

          <div className="space-y-2">
            {pendingDeposits.length === 0 ? (
              <p className="text-xs text-gray-500 py-3 text-center">No pending deposit requests.</p>
            ) : (
              pendingDeposits.slice(0, 3).map((dep) => (
                <div
                  key={dep.id}
                  className="p-2.5 bg-[#182030] rounded-xl border border-gray-800 flex justify-between items-center text-xs"
                >
                  <div>
                    <span className="font-bold text-white">{dep.userName}</span>
                    <span className="text-[10px] text-gray-400 block font-mono">
                      {dep.method} • TrxID: {dep.transactionId}
                    </span>
                  </div>
                  <span className="font-extrabold text-emerald-400 text-sm">৳{dep.amount}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Withdraw Requests Alert */}
        <div className="bg-[#121722] rounded-2xl p-4 border border-red-500/40 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <ArrowUpCircle className="w-4 h-4 text-red-400" /> Pending Cashout Requests ({pendingWithdraws.length})
            </h3>
            <button
              onClick={() => setActiveAdminTab('wallet')}
              className="text-xs text-red-400 font-bold hover:underline cursor-pointer"
            >
              Manage All
            </button>
          </div>

          <div className="space-y-2">
            {pendingWithdraws.length === 0 ? (
              <p className="text-xs text-gray-500 py-3 text-center">No pending withdrawal requests.</p>
            ) : (
              pendingWithdraws.slice(0, 3).map((wd) => (
                <div
                  key={wd.id}
                  className="p-2.5 bg-[#182030] rounded-xl border border-gray-800 flex justify-between items-center text-xs"
                >
                  <div>
                    <span className="font-bold text-white">{wd.userName}</span>
                    <span className="text-[10px] text-gray-400 block font-mono">
                      {wd.method} • Number: {wd.accountNumber}
                    </span>
                  </div>
                  <span className="font-extrabold text-red-400 text-sm">৳{wd.amount}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
