import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, ArrowDownCircle, ArrowUpCircle, History, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CopyButton } from '../common/CopyButton';

export const WalletView: React.FC = () => {
  const {
    user,
    paymentMethods,
    transactions,
    requestDeposit,
    requestWithdraw,
    showToast
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');

  // Deposit Form State
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [depositMethod, setDepositMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [trxId, setTrxId] = useState('');

  // Withdraw Form State
  const [withdrawAmount, setWithdrawAmount] = useState<number>(100);
  const [withdrawMethod, setWithdrawMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [withdrawAccount, setWithdrawAccount] = useState(user.phone || '');

  const userTransactions = transactions.filter((t) => t.userId === user.id || t.userEmail === user.email);

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId.trim()) {
      showToast('Please enter the Transaction ID (TrxID)!');
      return;
    }
    const res = requestDeposit(depositAmount, depositMethod, trxId);
    if (res.success) {
      setTrxId('');
      setActiveSubTab('history');
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAccount.trim()) {
      showToast('Please enter your account phone number!');
      return;
    }
    const res = requestWithdraw(withdrawAmount, withdrawMethod, withdrawAccount);
    if (res.success) {
      setActiveSubTab('history');
    }
  };

  const activeNumber = depositMethod === 'bKash' ? paymentMethods.bkashNumber : paymentMethods.nagadNumber;
  const activeInstructions = depositMethod === 'bKash' ? paymentMethods.bkashInstructions : paymentMethods.nagadInstructions;

  return (
    <div className="space-y-4 pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto font-sans">
      {/* Wallet Overview Header */}
      <div className="bg-gradient-to-r from-orange-950 via-slate-900 to-amber-950 rounded-2xl p-5 text-white shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold text-orange-300 uppercase tracking-widest flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-emerald-400" /> FIRE ARENA WALLET
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-white font-sans">৳{user.walletBalance.toFixed(2)}</h2>
              <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30">
                Winnings: ৳{user.winningBalance.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveSubTab('deposit')}
              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeSubTab === 'deposit'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <ArrowDownCircle className="w-4 h-4 text-emerald-300" /> Deposit
            </button>
            <button
              onClick={() => setActiveSubTab('withdraw')}
              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeSubTab === 'withdraw'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <ArrowUpCircle className="w-4 h-4 text-orange-200" /> Withdraw
            </button>
            <button
              onClick={() => setActiveSubTab('history')}
              className={`px-3 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeSubTab === 'history'
                  ? 'bg-white text-orange-950 font-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              title="Transaction History"
            >
              <History className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SUB TABS CONTENT */}

      {/* 1. DEPOSIT TAB */}
      {activeSubTab === 'deposit' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 space-y-4 shadow-2xs"
        >
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 font-sans">
            <ArrowDownCircle className="w-5 h-5 text-emerald-600" /> Deposit Funds
          </h3>

          {/* Select Payment Method */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select Payment Gateway</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDepositMethod('bKash')}
                className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-between cursor-pointer transition-all ${
                  depositMethod === 'bKash'
                    ? 'bg-pink-50 text-pink-700 border-pink-400 font-black shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <span>bKash Personal</span>
                <span className="text-[9px] bg-pink-600 text-white px-1.5 py-0.5 rounded uppercase font-black">Fast</span>
              </button>

              <button
                type="button"
                onClick={() => setDepositMethod('Nagad')}
                className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-between cursor-pointer transition-all ${
                  depositMethod === 'Nagad'
                    ? 'bg-orange-50 text-orange-700 border-orange-400 font-black shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <span>Nagad Personal</span>
                <span className="text-[9px] bg-orange-600 text-white px-1.5 py-0.5 rounded uppercase font-black">Fast</span>
              </button>
            </div>
          </div>

          {/* Admin Payment Number Card */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-bold uppercase">
                {depositMethod} Target Number
              </span>
              <CopyButton textToCopy={activeNumber} label="Copy Number" />
            </div>
            <p className="text-xl font-mono font-black text-orange-600 tracking-wider">{activeNumber}</p>

            <div className="mt-2 text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 whitespace-pre-line font-sans">
              {activeInstructions}
            </div>
          </div>

          {/* Deposit Form */}
          <form onSubmit={handleDepositSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deposit Amount (Minimum ৳{paymentMethods.minDeposit})
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[50, 100, 200, 500].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositAmount(amt)}
                    className={`py-1.5 rounded-lg font-bold text-xs border cursor-pointer ${
                      depositAmount === amt
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    ৳{amt}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                min={paymentMethods.minDeposit}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-orange-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Enter {depositMethod} Transaction ID (TrxID)
              </label>
              <input
                type="text"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="e.g. BK8920192A"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-orange-600 uppercase"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl uppercase tracking-wider shadow-xs transition-all cursor-pointer active:scale-95"
            >
              Submit Deposit Request 🚀
            </button>
          </form>
        </motion.div>
      )}

      {/* 2. WITHDRAW TAB */}
      {activeSubTab === 'withdraw' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 space-y-4 shadow-2xs"
        >
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 font-sans">
            <ArrowUpCircle className="w-5 h-5 text-orange-600" /> Cashout / Withdraw Winnings
          </h3>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
            <p className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" /> Fast Cashout Guarantee!
            </p>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Minimum withdrawal is ৳{paymentMethods.minWithdraw}. Funds will be sent directly to your bKash / Nagad number.
            </p>
          </div>

          <form onSubmit={handleWithdrawSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select Cashout Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setWithdrawMethod('bKash')}
                  className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-between cursor-pointer transition-all ${
                    withdrawMethod === 'bKash'
                      ? 'bg-pink-50 text-pink-700 border-pink-400 font-black shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  <span>bKash Cashout</span>
                </button>

                <button
                  type="button"
                  onClick={() => setWithdrawMethod('Nagad')}
                  className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-between cursor-pointer transition-all ${
                    withdrawMethod === 'Nagad'
                      ? 'bg-orange-50 text-orange-700 border-orange-400 font-black shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  <span>Nagad Cashout</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Withdrawal Amount (Min ৳{paymentMethods.minWithdraw})
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                min={paymentMethods.minWithdraw}
                max={user.walletBalance}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-orange-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your {withdrawMethod} Account Phone Number
              </label>
              <input
                type="tel"
                value={withdrawAccount}
                onChange={(e) => setWithdrawAccount(e.target.value)}
                placeholder="e.g. 01700000000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-orange-600"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs rounded-xl uppercase tracking-wider shadow-xs transition-all cursor-pointer active:scale-95"
            >
              Submit Cashout Request 💳
            </button>
          </form>
        </motion.div>
      )}

      {/* 3. TRANSACTION HISTORY TAB */}
      {activeSubTab === 'history' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 space-y-3 shadow-2xs"
        >
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 font-sans">
            <History className="w-5 h-5 text-orange-600" /> Transaction Logs
          </h3>

          <div className="space-y-2">
            {userTransactions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No wallet transactions found.</p>
            ) : (
              userTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-800 uppercase">{tx.type}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                          tx.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tx.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{tx.note || tx.method}</p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(tx.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-base font-black ${
                        tx.type === 'deposit' || tx.type === 'prize_won' || tx.type === 'refund'
                          ? 'text-emerald-600'
                          : 'text-slate-900'
                      }`}
                    >
                      {tx.type === 'deposit' || tx.type === 'prize_won' || tx.type === 'refund' ? '+' : '-'}৳{tx.amount}
                    </span>
                    {tx.transactionId && (
                      <span className="text-[10px] text-slate-400 font-mono block">TrxID: {tx.transactionId}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
