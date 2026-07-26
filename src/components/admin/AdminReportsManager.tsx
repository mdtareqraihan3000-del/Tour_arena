import React from 'react';
import { Flag, CheckCircle2, ShieldAlert, UserX } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminReportsManager: React.FC = () => {
  const { reports, resolveReport, banUser } = useApp();

  return (
    <div className="space-y-4 pb-20 pt-2 px-3 sm:px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#121722] rounded-2xl p-4 border border-amber-500/40 shadow-md">
        <h2 className="text-xl font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <Flag className="w-5 h-5 text-red-500" /> HACKER & PLAYER REPORTS PANEL ({reports.length})
        </h2>
        <p className="text-xs text-gray-400">Investigate user reports against headshot script users, toxic behavior, or room issues.</p>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {reports.length === 0 ? (
          <div className="p-8 text-center bg-[#121722] rounded-2xl border border-gray-800 text-gray-500 text-xs">
            No player reports submitted.
          </div>
        ) : (
          reports.map((rep) => (
            <div
              key={rep.id}
              className={`bg-[#121722] rounded-2xl p-4 border transition-all shadow-md space-y-2 ${
                rep.status === 'resolved' ? 'border-gray-800 opacity-70' : 'border-red-500/60'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-red-600 text-white font-black text-[10px] rounded uppercase">
                      {rep.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      Reported by: <span className="text-white font-bold">{rep.reporterName}</span>
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-white mt-1">
                    Target: <span className="text-amber-300">{rep.reportedItemName}</span>
                  </h3>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                    rep.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {rep.status}
                </span>
              </div>

              <p className="text-xs text-gray-300 bg-[#182030] p-2.5 rounded-xl border border-gray-800">
                {rep.description}
              </p>

              <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono pt-1">
                <span>Submitted: {new Date(rep.createdAt).toLocaleString()}</span>
                {rep.status === 'pending' && (
                  <button
                    onClick={() => resolveReport(rep.id)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolve Report
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
