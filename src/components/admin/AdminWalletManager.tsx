import React, { useState } from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle, CheckCircle2, XCircle, DollarSign, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminWalletManager: React.FC = () => {
  const {
    deposits,
    withdraws,
    approveDeposit,
    rejectDeposit,
    approveWithdraw,
    rejectWithdraw,
    adminAdjustWallet,
    usersList,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'deposits' | 'withdraws' | 'adjust'>('deposits');

  // Manual Adjust Form
  const [targetUserId, setTargetUserId] = useState('');
  const [adjustAmount, setAdjustAmount] = useState<number>(100);
  const [adjustType, setAdjustType] = useState<'add' | 'deduct'>('add');
  const [adjustNote, setAdjustNote] = useState('');

  const pendingDeposits = deposits.filter((d) => d.status === 'pending');
  const approvedDeposits = deposits.filter((d) => d.status === 'approved');

  const pendingWithdraws = withdraws.filter((w) => w.status === 'pending');
  const approvedWithdraws = withdraws.filter((w) => w.status === 'approved');

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId) {
      showToast('Please select a user to adjust balance!');
      return;
    }
    const finalAmount = adjustType === 'add' ? Math.abs(adjustAmount) : -Math.abs(adjustAmount);
    adminAdjustWallet(targetUserId, finalAmount, adjustNote || 'Admin Manual Adjustment');
    setTargetUserId('');
    setAdjustAmount(100);
    setAdjustNote('');
  };

  return (
    <div className="space-y-4 pb-20 pt-2 px-3 sm:px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#121722] rounded-2xl p-4 border border-amber-500/40 shadow-md flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-400" /> WALLET & PAYMENTS CONTROL
          </h2>
          <p className="text-xs text-gray-400">Review bKash/Nagad deposit TrxIDs, cashouts & manual balance adjustments.</p>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex bg-[#121622] rounded-2xl p-1 border border-gray-800">
        <button
          onClick={() => setActiveTab('deposits')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'deposits' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          <ArrowDownCircle className="w-4 h-4 text-emerald-400" /> Deposits ({pendingDeposits.length})
        </button>
        <button
          onClick={() => setActiveTab('withdraws')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'withdraws' ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          <ArrowUpCircle className="w-4 h-4 text-red-400" /> Withdrawals ({pendingWithdraws.length})
        </button>
        <button
          onClick={() => setActiveTab('adjust')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'adjust' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4 text-amber-300" /> Manual Adjust
        </button>
      </div>

      {/* 1. DEPOSITS TAB */}
      {activeTab === 'deposits' && (
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
            Pending Deposit Approvals ({pendingDeposits.length})
          </h3>

          {pendingDeposits.length === 0 ? (
            <div className="p-8 text-center bg-[#121722] rounded-2xl border border-gray-800 text-gray-500 text-xs">
              No pending deposit requests. All deposits cleared!
            </div>
          ) : (
            pendingDeposits.map((dep) => (
              <div
                key={dep.id}
                className="bg-[#121722] rounded-2xl p-4 border border-emerald-500/40 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm">{dep.userName}</span>
                    <span className="text-xs text-gray-400">({dep.userEmail})</span>
                  </div>
                  <p className="text-xs text-emerald-400 font-mono font-bold mt-0.5">
                    Method: {dep.method} • TrxID: {dep.transactionId}
                  </p>
                  <span className="text-[10px] text-gray-500 font-mono">
                    Requested: {new Date(dep.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-emerald-400">৳{dep.amount}</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => approveDeposit(dep.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => rejectDeposit(dep.id)}
                      className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-400 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1 border border-red-500/40"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. WITHDRAWS TAB */}
      {activeTab === 'withdraws' && (
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
            Pending Cashout Requests ({pendingWithdraws.length})
          </h3>

          {pendingWithdraws.length === 0 ? (
            <div className="p-8 text-center bg-[#121722] rounded-2xl border border-gray-800 text-gray-500 text-xs">
              No pending withdrawal requests. All cashouts processed!
            </div>
          ) : (
            pendingWithdraws.map((wd) => (
              <div
                key={wd.id}
                className="bg-[#121722] rounded-2xl p-4 border border-red-500/40 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm">{wd.userName}</span>
                    <span className="text-xs text-gray-400">({wd.userEmail})</span>
                  </div>
                  <p className="text-xs text-red-400 font-mono font-bold mt-0.5">
                    Send Money To: {wd.method} • Phone: {wd.accountNumber}
                  </p>
                  <span className="text-[10px] text-gray-500 font-mono">
                    Requested: {new Date(wd.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-red-400">৳{wd.amount}</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => approveWithdraw(wd.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Send Money & Clear
                    </button>
                    <button
                      onClick={() => rejectWithdraw(wd.id)}
                      className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-400 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1 border border-red-500/40"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. MANUAL BALANCE ADJUSTMENT TAB */}
      {activeTab === 'adjust' && (
        <form onSubmit={handleAdjustSubmit} className="bg-[#121722] p-5 rounded-2xl border border-gray-800 space-y-4 shadow-md max-w-lg mx-auto">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" /> Manual Wallet Balance Adjustment Tool
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Select Target User</label>
            <select
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
              required
            >
              <option value="">-- Choose User Account --</option>
              {usersList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.ingameName} ({u.email} • Balance: ৳{u.walletBalance})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Action Type</label>
              <select
                value={adjustType}
                onChange={(e) => setAdjustType(e.target.value as 'add' | 'deduct')}
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="add">Add Balance (+)</option>
                <option value="deduct">Deduct Balance (-)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Amount (৳)</label>
              <input
                type="number"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(Number(e.target.value))}
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-xs font-bold text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Reason / Note</label>
            <input
              type="text"
              value={adjustNote}
              onChange={(e) => setAdjustNote(e.target.value)}
              placeholder="e.g. Compensation for match delay"
              className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-extrabold text-xs rounded-xl uppercase tracking-wider cursor-pointer"
          >
            Apply Balance Adjustment ⚡
          </button>
        </form>
      )}
    </div>
  );
};
