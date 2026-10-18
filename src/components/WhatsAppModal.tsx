import React, { useState } from 'react';
import { ProjectData, ProjectConfigType } from '../data/mockProjects';
import {
  calculateTCO,
  calculateRentalYield,
  formatNumberIndian,
  formatLakhCroreValue,
} from '../utils/realEstateCalculators';
import { Rupee } from './Rupee';
import {
  X,
  Send,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Phone,
  Clock,
  ArrowRight,
  MessageSquare,
  Lock,
} from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData | null;
  selectedConfig: ProjectConfigType;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  project,
  selectedConfig,
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('9823012345');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpInput, setOtpInput] = useState<string>('');
  const [verified, setVerified] = useState<boolean>(false);
  const [rateLimitCount, setRateLimitCount] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !project) return null;

  const unit = project.configs[selectedConfig]?.available
    ? project.configs[selectedConfig]
    : project.configs['2 BHK'];

  const isReady = project.stage === 'Ready to Move';
  const tco = calculateTCO(unit.basePrice, isReady, true);
  const yieldData = calculateRentalYield(
    unit.expectedMonthlyRent,
    unit.annualMaintenanceAndTax,
    unit.basePrice
  );

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setErrorMsg(null);
    setOtpSent(true);
    setRateLimitCount((prev) => Math.min(3, prev + 1));
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === '123456' || otpInput.length === 6) {
      setVerified(true);
      setErrorMsg(null);
    } else {
      setErrorMsg('Invalid OTP. Use test code 123456');
    }
  };

  const handleReset = () => {
    setOtpSent(false);
    setOtpInput('');
    setVerified(false);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#16A34A] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base text-white">WhatsApp Report Delivery</h3>
                <span className="text-[10px] font-mono bg-white/20 px-1.5 py-0.5 rounded text-white">
                  FR-8.1
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Direct verified project dossier sent to your WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            aria-label="Close WhatsApp modal"
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5">
          {!verified ? (
            /* STEP 1: Phone & OTP Verification */
            <div className="space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700">
                <span className="font-semibold block text-slate-900">
                  Target Dossier: {project.name}
                </span>
                <div className="font-mono text-slate-600 mt-1 flex items-center flex-wrap gap-1">
                  <span>Selected Config: <strong>{selectedConfig}</strong> • Price: </span>
                  <strong className="flex items-center gap-0.5"><Rupee className="w-3 h-3 text-slate-800" />{formatLakhCroreValue(unit.basePrice)}</strong>
                  <span> (TCO: </span>
                  <span className="flex items-center gap-0.5 font-bold text-blue-700"><Rupee className="w-3 h-3 text-blue-700" />{formatNumberIndian(tco.totalTCO)}</span>
                  <span>)</span>
                </div>
              </div>

              {/* Rate limit badge (FR-6.8) */}
              <div className="flex items-center justify-between text-xs px-1">
                <span className="flex items-center gap-1 text-slate-500 font-mono text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Anti-Abuse Rate Limit: {rateLimitCount}/3 per hour (FR-6.8)
                </span>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Zero Spam Guarantee
                </span>
              </div>

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-800 block mb-1">
                      Enter WhatsApp Mobile Number (+91)
                    </label>
                    <div className="relative flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
                      <span className="bg-slate-100 text-slate-600 px-3 py-2 text-xs font-mono flex items-center border-r border-slate-300">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="9823012345"
                        className="w-full px-3 py-2 text-sm font-mono outline-none"
                      />
                    </div>
                  </div>

                  {errorMsg && (
                    <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#16A34A] hover:bg-[#15803D] text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Send Verification OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                    <span className="font-semibold block">OTP Sent to +91 {phoneNumber}</span>
                    <span className="text-[11px] text-emerald-700 font-mono mt-0.5 block">
                      Demo Testing Hint: Enter code <strong>123456</strong>
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-800 block mb-1">
                      Enter 6-Digit OTP
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="123456"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-center font-mono text-lg tracking-widest outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="w-1/3 py-2.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      Change Phone
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#16A34A] hover:bg-[#15803D] text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Verify & Deliver Report</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* STEP 2: Realistic WhatsApp Business Thread Preview */
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Delivery Successful! Client verification authenticated for +91 {phoneNumber}.
                </span>
              </div>

              {/* WhatsApp Thread Mock Container */}
              <div className="bg-[#EFEAE2] rounded-xl border border-slate-300 overflow-hidden shadow-inner font-sans">
                {/* Simulated WhatsApp Header */}
                <div className="bg-[#075E54] text-white px-3 py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#075E54] font-bold flex items-center justify-center text-xs">
                      EF
                    </div>
                    <div>
                      <div className="font-bold flex items-center gap-1">
                        <span>Estate Flow Verified</span>
                        <CheckCircle2 className="w-3 h-3 text-emerald-300 fill-emerald-300" />
                      </div>
                      <div className="text-[10px] text-emerald-200">Official Business Account</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-200 font-mono">10:53 AM</span>
                </div>

                {/* Simulated Message Bubble (Approved WhatsApp Template) */}
                <div className="p-3 space-y-2">
                  <div className="max-w-[90%] bg-white rounded-lg rounded-tl-none p-3 shadow-xs text-xs space-y-2 text-slate-800">
                    <p className="font-bold text-emerald-800 text-sm">
                      🏛️ MahaRERA Verified Property Dossier
                    </p>
                    <p>
                      Hello, here is your requested canonical financial report for{' '}
                      <strong>{project.name}</strong>, {project.location}.
                    </p>

                    <div className="bg-slate-50 p-2 rounded border border-slate-200 space-y-1 font-mono text-[11px]">
                      <div>• RERA ID: <strong>{project.reraNumber}</strong></div>
                      <div>• UPI Code: <strong>{project.upi}</strong></div>
                      <div>• Config: <strong>{selectedConfig}</strong> ({unit.carpetAreaSqFt} sq.ft.)</div>
                      <div className="flex items-center gap-0.5">• Base Price: <Rupee className="w-2.5 h-2.5 text-slate-800" /><strong>{formatLakhCroreValue(unit.basePrice)}</strong></div>
                      <div className="flex items-center gap-0.5">• Net TCO (All Taxes): <Rupee className="w-2.5 h-2.5 text-blue-700" /><strong className="text-blue-700">{formatNumberIndian(tco.totalTCO)}</strong></div>
                      <div>• Expected Net Yield: <strong>{yieldData.netYieldPct}%</strong></div>
                      <div>• Livability Score: <strong>{project.livability.compositeScore}/100</strong></div>
                    </div>

                    {/* PDF Attachment Simulation */}
                    <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-lg border border-slate-300">
                      <FileText className="w-6 h-6 text-red-500" />
                      <div className="flex-1 truncate">
                        <div className="font-bold text-[11px] truncate">
                          {project.name.replace(/\s+/g, '_')}_Official_Appraisal.pdf
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono">1.8 MB • Verified Digital Signature</div>
                      </div>
                    </div>

                    <div className="text-[9px] text-slate-400 text-right font-mono">
                      10:53 AM • Delivered ✓✓
                    </div>
                  </div>

                  {/* Interactive Reply Quick Actions */}
                  <div className="space-y-1 pl-1">
                    <button
                      type="button"
                      onClick={() => alert(`Simulated: Callback scheduled with verified site manager for ${project.name}`)}
                      className="bg-white/90 hover:bg-white text-blue-700 text-[11px] font-semibold py-1.5 px-3 rounded-md shadow-xs border border-slate-300 flex items-center gap-1.5"
                    >
                      <Phone className="w-3 h-3 text-blue-600" />
                      <span>Request Guided Site Visit</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-slate-50"
              >
                Send to Another Number
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
