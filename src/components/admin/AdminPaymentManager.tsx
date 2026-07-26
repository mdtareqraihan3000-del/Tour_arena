import React, { useState } from 'react';
import { CreditCard, Save, Phone, DollarSign, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminPaymentManager: React.FC = () => {
  const { paymentMethods, updatePaymentMethods, showToast } = useApp();

  const [bkashNum, setBkashNum] = useState(paymentMethods.bkashNumber);
  const [bkashInst, setBkashInst] = useState(paymentMethods.bkashInstructions);

  const [nagadNum, setNagadNum] = useState(paymentMethods.nagadNumber);
  const [nagadInst, setNagadInst] = useState(paymentMethods.nagadInstructions);

  const [minDep, setMinDep] = useState(paymentMethods.minDeposit);
  const [minWd, setMinWd] = useState(paymentMethods.minWithdraw);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentMethods({
      bkashNumber: bkashNum,
      bkashInstructions: bkashInst,
      nagadNumber: nagadNum,
      nagadInstructions: nagadInst,
      minDeposit: minDep,
      minWithdraw: minWd
    });
  };

  return (
    <div className="space-y-4 pb-20 pt-2 px-3 sm:px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#121722] rounded-2xl p-4 border border-amber-500/40 shadow-md">
        <h2 className="text-xl font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-400" /> PAYMENT GATEWAY SETTINGS
        </h2>
        <p className="text-xs text-gray-400">Configure admin bKash/Nagad target numbers, deposit guidance text & minimum limits.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* bKash Settings */}
        <div className="bg-[#121722] p-5 rounded-2xl border border-pink-500/40 space-y-3 shadow-md">
          <h3 className="font-extrabold text-pink-300 text-sm uppercase flex items-center gap-2">
            <Phone className="w-4 h-4 text-pink-400" /> bKash Gateway Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-gray-300 font-bold mb-1">bKash Send Money Number</label>
              <input
                type="text"
                value={bkashNum}
                onChange={(e) => setBkashNum(e.target.value)}
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-gray-300 font-bold mb-1">bKash User Guidance Instructions</label>
              <textarea
                value={bkashInst}
                onChange={(e) => setBkashInst(e.target.value)}
                rows={3}
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>
          </div>
        </div>

        {/* Nagad Settings */}
        <div className="bg-[#121722] p-5 rounded-2xl border border-orange-500/40 space-y-3 shadow-md">
          <h3 className="font-extrabold text-orange-300 text-sm uppercase flex items-center gap-2">
            <Phone className="w-4 h-4 text-orange-400" /> Nagad Gateway Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Nagad Send Money Number</label>
              <input
                type="text"
                value={nagadNum}
                onChange={(e) => setNagadNum(e.target.value)}
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-gray-300 font-bold mb-1">Nagad User Guidance Instructions</label>
              <textarea
                value={nagadInst}
                onChange={(e) => setNagadInst(e.target.value)}
                rows={3}
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>
          </div>
        </div>

        {/* Limits */}
        <div className="bg-[#121722] p-5 rounded-2xl border border-gray-800 space-y-3 shadow-md">
          <h3 className="font-extrabold text-white text-sm uppercase flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" /> Transaction Limits
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Minimum Deposit Amount (৳)</label>
              <input
                type="number"
                value={minDep}
                onChange={(e) => setMinDep(Number(e.target.value))}
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Minimum Cashout Amount (৳)</label>
              <input
                type="number"
                value={minWd}
                onChange={(e) => setMinWd(Number(e.target.value))}
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white font-bold"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider shadow-lg transition-all cursor-pointer"
        >
          Save Payment Configurations ✅
        </button>
      </form>
    </div>
  );
};
