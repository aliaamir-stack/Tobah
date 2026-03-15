import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TiTick } from 'react-icons/ti';
import { Toaster, toast } from 'sonner';
import { CATEGORIES } from './registrationConfig';

const STEP_LABELS = ['Select Sport', 'Team Type', 'Team Info', 'Players', 'Review & Submit'];

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyIn4pUDH-b1aXhg59cbgbNoATQkVMx6vPIA-wz3Gl_863akehkoG3sx7GWsGyN0fCEkg/exec';

/* ─── helpers ─── */
const empty = (v) => !v || !v.trim();

const slideVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

/* ─── Component ─── */
export default function CategoryRegistrationForm({ category, onBack }) {
  const config = CATEGORIES[category];
  const sportsList = config.sports;

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);

  // Form state
  const [selectedSport, setSelectedSport] = useState('');
  const [teamType, setTeamType] = useState(''); // 'university' | 'private'
  const [teamInfo, setTeamInfo] = useState({
    teamName: '',
    captainName: '',
    captainPhone: '',
    captainCNIC: '',
    managerName: '',
  });
  const [players, setPlayers] = useState([]);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [paymentFileName, setPaymentFileName] = useState('');

  const sportConfig = sportsList.find((s) => s.name === selectedSport);

  /* ─── player field init ─── */
  const initPlayers = (sc) => {
    if (!sc) return;
    const arr = [];
    for (let i = 0; i < sc.mandatory; i++) {
      const label =
        sc.labels && sc.labels[i]
          ? sc.labels[i]
          : sc.captainOnly && sc.mandatory === 1
          ? 'Player (Captain)'
          : `Player ${i + 1}`;
      arr.push({ label, name: '', cnic: '', phone: '', isSub: false });
    }
    setPlayers(arr);
  };

  /* ─── validation ─── */
  const validateStep = () => {
    if (step === 1) {
      if (!selectedSport) {
        toast.error('Please select a sport');
        return false;
      }
    }
    if (step === 2) {
      if (!teamType) {
        toast.error('Please select a team type');
        return false;
      }
    }
    if (step === 3) {
      if (empty(teamInfo.teamName)) { toast.error('Team name is required'); return false; }
      if (empty(teamInfo.captainName)) { toast.error('Captain name is required'); return false; }
      if (empty(teamInfo.captainPhone)) { toast.error('Captain phone is required'); return false; }
      if (empty(teamInfo.captainCNIC)) { toast.error('Captain CNIC is required'); return false; }
    }
    if (step === 4) {
      for (const p of players) {
        if (empty(p.name) || empty(p.cnic) || empty(p.phone)) {
          toast.error('Please fill all player details (Name, CNIC, Phone)');
          return false;
        }
      }
    }
    if (step === 5) {
      if (teamType === 'private' && !paymentScreenshot) {
        toast.error('Please upload your payment screenshot');
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step === 1) initPlayers(sportConfig);
    setStep((s) => s + 1);
  };
  const prev = () => setStep((s) => s - 1);

  /* ─── add / remove substitute ─── */
  const addSub = () => {
    if (!sportConfig) return;
    const subsCount = players.filter((p) => p.isSub).length;
    if (subsCount >= sportConfig.maxSubs) {
      toast.error(`Maximum ${sportConfig.maxSubs} substitute(s) allowed`);
      return;
    }
    setPlayers((prev) => [
      ...prev,
      { label: `Sub ${subsCount + 1}`, name: '', cnic: '', phone: '', isSub: true },
    ]);
  };

  const removeSub = (idx) => {
    setPlayers((prev) => {
      const arr = prev.filter((_, i) => i !== idx);
      // relabel subs
      let subN = 1;
      return arr.map((p) => (p.isSub ? { ...p, label: `Sub ${subN++}` } : p));
    });
  };

  const updatePlayer = (idx, field, val) => {
    setPlayers((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  /* ─── file handling ─── */
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be under 5 MB');
      return;
    }
    setPaymentFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      setPaymentScreenshot({
        data: base64String,
        mimeType: file.type,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  /* ─── submit ─── */
  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      const payload = {
        category: config.label,
        sport: selectedSport,
        registrationFee: sportConfig?.fee,
        teamType,
        teamName: teamInfo.teamName,
        captainName: teamInfo.captainName,
        captainPhone: teamInfo.captainPhone,
        captainCnic: teamInfo.captainCNIC,
        managerName: teamInfo.managerName,
      };

      let playerIndex = 1;
      let subIndex = 1;

      players.forEach((p) => {
        if (p.isSub) {
          payload[`sub${subIndex}Name`] = p.name;
          payload[`sub${subIndex}Cnic`] = p.cnic;
          payload[`sub${subIndex}Phone`] = p.phone;
          subIndex++;
        } else {
          payload[`player${playerIndex}Name`] = p.name;
          payload[`player${playerIndex}Cnic`] = p.cnic;
          payload[`player${playerIndex}Phone`] = p.phone;
          playerIndex++;
        }
      });

      if (teamType === 'private' && paymentScreenshot) {
        payload.paymentScreenshot = paymentScreenshot;
      }

      // Using text/plain to avoid CORS preflight issues with Google Apps Script
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.status === 'success') {
        setComplete(true);
      } else {
        toast.error('Something went wrong, please try again.');
      }
    } catch {
      toast.error('Something went wrong, please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── stepper bar ─── */
  const Stepper = () => (
    <div className="w-full mb-8 px-2 overflow-x-auto">
      <div className="max-w-3xl mx-auto relative min-w-[420px]">
        <div className="absolute top-5 left-[40px] right-[40px] h-[2px] bg-gray-200">
          <div
            className="h-full bg-[#6B0F1A] transition-all duration-500"
            style={{ width: `${((step - 1) / (STEP_LABELS.length - 1)) * 100}%` }}
          />
        </div>
        <div className="relative flex justify-between">
          {STEP_LABELS.map((label, i) => {
            const stepNum = i + 1;
            const done = stepNum < step || complete;
            const active = stepNum === step && !complete;
            return (
              <div key={i} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-sm font-bold transition-colors duration-300
                    ${done ? 'border-[#6B0F1A] bg-[#6B0F1A] text-white' : ''}
                    ${active ? 'border-[#F5A623] bg-white text-[#F5A623]' : ''}
                    ${!done && !active ? 'border-gray-300 bg-white text-gray-400' : ''}
                  `}
                >
                  {done ? <TiTick className="text-white text-lg" /> : stepNum}
                </div>
                <span
                  className={`mt-2 text-xs text-center w-16 leading-tight ${
                    done || active ? 'text-[#6B0F1A] font-semibold' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  /* ─── shared input style ─── */
  const inputCls =
    'w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B0F1A] focus:border-transparent transition';
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1';

  /* ─── RENDER ─── */
  if (complete) {
    return (
      <>
        <Toaster richColors position="top-center" />
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-[#6B0F1A] rounded-full mx-auto flex items-center justify-center mb-5">
              <TiTick className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#6B0F1A] mb-3">Registration Received!</h2>
            <p className="text-gray-600 mb-6">
              Your registration has been received! We'll be in touch shortly.
            </p>
            <button
              onClick={onBack}
              className="px-8 py-2.5 bg-[#6B0F1A] text-white rounded-full font-semibold hover:bg-[#8a1422] transition"
            >
              Back to Categories
            </button>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <div className="min-h-screen flex justify-center items-start py-10 px-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Back to categories */}
          <button
            onClick={onBack}
            className="text-sm text-[#6B0F1A] hover:underline mb-4 flex items-center gap-1"
          >
            ← Back to categories
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#6B0F1A] mb-2 text-center">
            {config.label} Registration
          </h1>

          <Stepper />

          <AnimatePresence mode="wait">
            {/* ─── STEP 1: Select Sport ─── */}
            {step === 1 && (
              <motion.div key="s1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
                <h2 className="text-lg font-bold mb-4 text-gray-800">Select your sport</h2>
                <select
                  id="sport-select"
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className={inputCls}
                >
                  <option value="">-- Choose a sport --</option>
                  {sportsList.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name} — {s.fee.toLocaleString()} PKR
                    </option>
                  ))}
                </select>
                {sportConfig && (
                  <div className="mt-4 p-4 bg-[#fef8ec] border border-[#F5A623] rounded-lg text-sm">
                    <p><strong>Fee:</strong> {sportConfig.fee.toLocaleString()} PKR</p>
                    <p><strong>Players:</strong> {sportConfig.mandatory} mandatory{sportConfig.maxSubs > 0 ? ` + up to ${sportConfig.maxSubs} subs` : ''}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── STEP 2: Team Type ─── */}
            {step === 2 && (
              <motion.div key="s2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
                <h2 className="text-lg font-bold mb-4 text-gray-800">Team Type</h2>
                <div className="space-y-3">
                  {[
                    { val: 'university', label: 'University Team', desc: 'Representing a university — no advance payment required' },
                    { val: 'private', label: 'Private Team', desc: '50% advance payment required to confirm registration' },
                  ].map((opt) => (
                    <label
                      key={opt.val}
                      className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        teamType === opt.val
                          ? 'border-[#6B0F1A] bg-[#fef0f2]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="teamType"
                        value={opt.val}
                        checked={teamType === opt.val}
                        onChange={() => setTeamType(opt.val)}
                        className="mt-1 accent-[#6B0F1A]"
                      />
                      <div>
                        <span className="font-semibold text-gray-800">{opt.label}</span>
                        <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ─── STEP 3: Team Info ─── */}
            {step === 3 && (
              <motion.div key="s3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
                <h2 className="text-lg font-bold mb-4 text-gray-800">Team Information</h2>
                <div className="grid gap-4">
                  <div>
                    <label className={labelCls}>Team Name *</label>
                    <input className={inputCls} value={teamInfo.teamName} onChange={(e) => setTeamInfo({ ...teamInfo, teamName: e.target.value })} placeholder="e.g. Thunder Bolts" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Captain Name *</label>
                      <input className={inputCls} value={teamInfo.captainName} onChange={(e) => setTeamInfo({ ...teamInfo, captainName: e.target.value })} placeholder="Full name" />
                    </div>
                    <div>
                      <label className={labelCls}>Captain Phone *</label>
                      <input className={inputCls} value={teamInfo.captainPhone} onChange={(e) => setTeamInfo({ ...teamInfo, captainPhone: e.target.value })} placeholder="03XX-XXXXXXX" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Captain CNIC *</label>
                      <input className={inputCls} value={teamInfo.captainCNIC} onChange={(e) => setTeamInfo({ ...teamInfo, captainCNIC: e.target.value })} placeholder="XXXXX-XXXXXXX-X" />
                    </div>
                    <div>
                      <label className={labelCls}>Manager Name <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input className={inputCls} value={teamInfo.managerName} onChange={(e) => setTeamInfo({ ...teamInfo, managerName: e.target.value })} placeholder="Full name" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── STEP 4: Players ─── */}
            {step === 4 && (
              <motion.div key="s4" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
                <h2 className="text-lg font-bold mb-1 text-gray-800">Player Details</h2>
                <p className="text-sm text-gray-500 mb-4">
                  {sportConfig?.mandatory} mandatory player{sportConfig?.mandatory > 1 ? 's' : ''}
                  {sportConfig?.maxSubs > 0 ? ` · up to ${sportConfig?.maxSubs} substitute${sportConfig?.maxSubs > 1 ? 's' : ''}` : ''}
                </p>

                <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                  {players.map((p, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border ${
                        p.isSub ? 'border-dashed border-[#F5A623] bg-[#fffdf6]' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-semibold text-[#6B0F1A]">
                          {p.label} {p.isSub && <span className="text-[#F5A623]">(Substitute)</span>}
                        </span>
                        {p.isSub && (
                          <button
                            onClick={() => removeSub(idx)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid sm:grid-cols-3 gap-3">
                        <div>
                          <label className={labelCls}>Name *</label>
                          <input
                            className={inputCls}
                            value={p.name}
                            onChange={(e) => updatePlayer(idx, 'name', e.target.value)}
                            placeholder="Full name"
                          />
                        </div>
                        <div>
                          <label className={labelCls}>CNIC *</label>
                          <input
                            className={inputCls}
                            value={p.cnic}
                            onChange={(e) => updatePlayer(idx, 'cnic', e.target.value)}
                            placeholder="XXXXX-XXXXXXX-X"
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Phone *</label>
                          <input
                            className={inputCls}
                            value={p.phone}
                            onChange={(e) => updatePlayer(idx, 'phone', e.target.value)}
                            placeholder="03XX-XXXXXXX"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {sportConfig && sportConfig.maxSubs > 0 && players.filter((p) => p.isSub).length < sportConfig.maxSubs && (
                  <button
                    onClick={addSub}
                    className="mt-4 px-5 py-2 border-2 border-dashed border-[#F5A623] text-[#F5A623] rounded-full text-sm font-semibold hover:bg-[#fef8ec] transition"
                  >
                    + Add Substitute
                  </button>
                )}
              </motion.div>
            )}

            {/* ─── STEP 5: Review & Payment ─── */}
            {step === 5 && (
              <motion.div key="s5" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
                <h2 className="text-lg font-bold mb-4 text-gray-800">Review & Submit</h2>

                {/* Summary */}
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-bold text-[#6B0F1A] mb-2">Sport & Team</h3>
                    <p className="text-sm"><strong>Sport:</strong> {selectedSport}</p>
                    <p className="text-sm"><strong>Team Type:</strong> {teamType === 'university' ? 'University' : 'Private'}</p>
                    <p className="text-sm"><strong>Team Name:</strong> {teamInfo.teamName}</p>
                    <p className="text-sm"><strong>Captain:</strong> {teamInfo.captainName} · {teamInfo.captainPhone}</p>
                    {teamInfo.managerName && <p className="text-sm"><strong>Manager:</strong> {teamInfo.managerName}</p>}
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-bold text-[#6B0F1A] mb-2">Players ({players.length})</h3>
                    <div className="space-y-1">
                      {players.map((p, i) => (
                        <p key={i} className="text-sm">
                          <span className="font-medium">{p.label}:</span> {p.name}{' '}
                          {p.isSub && <span className="text-[#F5A623] text-xs">(sub)</span>}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Fee */}
                  <div className="p-4 bg-[#fef8ec] border border-[#F5A623] rounded-lg flex justify-between items-center">
                    <span className="font-bold text-gray-800">Registration Fee</span>
                    <span className="text-xl font-bold text-[#6B0F1A]">{sportConfig?.fee.toLocaleString()} PKR</span>
                  </div>

                  {/* Payment – private only */}
                  {teamType === 'private' && (
                    <div className="p-4 bg-[#fef0f2] border border-[#6B0F1A] rounded-lg">
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Registration Fee: {sportConfig?.fee.toLocaleString()} PKR</strong> — A 50% advance payment is mandatory to confirm your registration. Please upload your payment screenshot below.
                      </p>
                      <label className="block">
                        <span className={labelCls}>Payment Screenshot *</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFile}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#6B0F1A] file:text-white hover:file:bg-[#8a1422] cursor-pointer"
                        />
                      </label>
                      {paymentFileName && (
                        <p className="mt-2 text-sm text-green-700">✓ {paymentFileName}</p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Navigation Buttons ─── */}
          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={prev}
                disabled={submitting}
                className="px-6 py-2.5 bg-gray-200 rounded-full text-gray-700 font-semibold hover:bg-gray-300 transition disabled:opacity-50"
              >
                Previous
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: submitting ? 1 : 1.04 }}
              whileTap={{ scale: submitting ? 1 : 0.96 }}
              onClick={step === STEP_LABELS.length ? handleSubmit : next}
              disabled={submitting}
              className={`px-6 py-2.5 rounded-full text-white font-semibold min-w-[130px] transition disabled:opacity-60 ${
                step === STEP_LABELS.length
                  ? 'bg-[#6B0F1A] hover:bg-[#8a1422]'
                  : 'bg-[#F5A623] hover:bg-[#e0951c]'
              } ${step === 1 ? 'ml-auto' : ''}`}
            >
              {step === STEP_LABELS.length ? (
                submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting…
                  </span>
                ) : (
                  'Submit Registration'
                )
              ) : (
                'Next'
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
}
