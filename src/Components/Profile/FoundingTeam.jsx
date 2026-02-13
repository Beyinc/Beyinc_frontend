import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Clock, Trash2, X, Plus, User,
  KeyRound, Mail, AlertCircle, CheckCircle2
} from 'lucide-react';
import { ApiServices } from "../../Services/ApiServices";

// --- Constants for Styles ---
const COLORS = {
  primary: 'bg-[#8B5CF6]',
  primaryHover: 'hover:bg-[#7C3AED]',
  textLink: 'text-[#8B5CF6]',
  gradient: 'bg-gradient-to-br from-blue-500 to-purple-600',
};

const FoundingTeamWidget = ({ userId, startupName, initialTeam = [], isOwner = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [team, setTeam] = useState(initialTeam);

  // Sync with initialTeam from parent (backend data)
  useEffect(() => {
    setTeam(initialTeam);
  }, [initialTeam]);

  return (
    <>
      {/* --- DASHBOARD WIDGET --- */}
      <div className="bg-white w-full rounded-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Founding Team</h3>
          {/* Only show manage button if user is the owner */}
          {isOwner && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-[#4E54C6] border border-[#4E54C6] px-6 py-2 rounded-md font-medium text-sm flex items-center hover:bg-[#4E54C6] hover:text-white transition-all shadow-sm"
            >
              <User className="w-4 h-4 mr-1.5" /> Manage
            </button>
          )}
        </div>

        {team.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No team members yet
          </div>
        ) : (
          <div className="space-y-4">
            {team.map((member) => (
              <WidgetRow key={member._id || member.email} member={member} />
            ))}
          </div>
        )}
      </div>

      {/* --- MODAL (only for owners) --- */}
      {isOwner && isModalOpen && (
        <ManageTeamModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          team={team}
          setTeam={setTeam}
          startupName={startupName}
        />
      )}
    </>
  );
};

// --- Widget Row Component ---
const WidgetRow = ({ member }) => {
  const isVerified = member.verified || member.status === 'verified';
  const avatarUrl = member.profileImage || member.avatar || member.image?.url;

  return (
    <div className="flex items-start gap-3">
      {/* Avatar */}
      <div className="relative">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={member.name || member.userName}
            className="w-10 h-10 rounded-full object-cover border border-gray-100"
          />
        ) : (
          <div className={`w-10 h-10 rounded-full ${COLORS.gradient} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
            {(member.name || member.userName || 'U').charAt(0).toUpperCase()}
          </div>
        )}
        {/* Badge Overlay */}
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-[2px] shadow-sm border border-gray-50">
          {isVerified ? (
            <ShieldCheck className="w-3.5 h-3.5 text-green-500 fill-current" />
          ) : (
            <Clock className="w-3.5 h-3.5 text-orange-500" />
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h4 className="text-sm font-bold text-gray-900 truncate leading-none">
            {member.name || member.userName}
          </h4>
          {isVerified && <ShieldCheck className="w-3.5 h-3.5 text-green-500" />}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">{member.position || member.role}</span>
          {!isVerified && (
            <span className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded font-medium border border-orange-100">
              Pending
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Modal Component ---
const ManageTeamModal = ({ isOpen, onClose, team, setTeam, startupName }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [otpInputVisible, setOtpInputVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: '' });
  const [otpValues, setOtpValues] = useState({});

  // Auto-clear messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleSendInvite = async () => {
    setError(null);
    setSuccess(null);

    if (!newMember.name || !newMember.email || !newMember.role) {
      return setError("Please fill all fields.");
    }

    if (team.some(m => m.email.toLowerCase() === newMember.email.toLowerCase())) {
      return setError("User already in team.");
    }

    setLoading(true);

    try {
      // 1. Search for existing user to get their profile
      let dbUser = null;
      try {
        const searchRes = await ApiServices.searchUserByEmail(newMember.email);
        dbUser = searchRes.data || searchRes;
      } catch (e) {
        // User doesn't exist in system yet
      }

      // 2. Send invite email
      await ApiServices.sendCoFounderInvite({
        email: newMember.email,
        name: dbUser?.userName || dbUser?.name || newMember.name,
        startupName: startupName
      });

      // 3. Add pending member to local state
      const pendingMember = {
        _id: dbUser?._id || `temp-${Date.now()}`,
        name: dbUser?.userName || dbUser?.name || newMember.name,
        userName: dbUser?.userName || newMember.name,
        email: newMember.email,
        position: newMember.role,
        role: newMember.role,
        verified: false,
        status: 'pending',
        profileImage: dbUser?.image?.url || dbUser?.profileImage || dbUser?.avatar || null
      };

      setTeam(prev => [...prev, pendingMember]);
      setSuccess(`Invite sent to ${newMember.email}`);
      setNewMember({ name: '', email: '', role: '' });
      setShowAddForm(false);

      // Auto-open OTP input
      setTimeout(() => setOtpInputVisible(pendingMember.email), 600);

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to send invite.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (memberEmail, memberName, memberRole, memberImg) => {
    const otp = otpValues[memberEmail];

    if (!otp || otp.length !== 6) {
      return setError("Enter a valid 6-digit OTP");
    }

    setLoading(true);
    setError(null);

    try {
      await ApiServices.verifyCoFounder({
        email: memberEmail,
        otp: otp,
        name: memberName,
        position: memberRole,
        profileImage: memberImg || ''
      });

      // Update to verified
      setTeam(prev => prev.map(m =>
        m.email === memberEmail
          ? { ...m, verified: true, status: 'verified' }
          : m
      ));

      setSuccess("Member verified successfully!");
      setOtpInputVisible(null);
      setOtpValues(prev => {
        const updated = { ...prev };
        delete updated[memberEmail];
        return updated;
      });

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (email) => {
    if (!window.confirm("Remove this member?")) return;

    try {
      // Call API to remove from backend if needed
      // await ApiServices.removeCoFounder(email);

      setTeam(prev => prev.filter(m => m.email !== email));
      setSuccess("Member removed successfully.");
    } catch (err) {
      setError("Failed to remove member.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] w-full max-w-[850px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manage Founding Team</h2>
            <p className="text-gray-500 text-sm mt-1">Link founder profiles to verify their association with your startup</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Notifications */}
        {(error || success) && (
          <div className={`px-8 py-3 text-sm flex items-center gap-2 ${error ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {error ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            {error || success}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-white">
          {/* Team Members */}
          <div className="space-y-4">
            {team.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No team members yet. Add your first member below.
              </div>
            ) : (
              team.map(member => (
                <ModalRow
                  key={member._id || member.email}
                  member={member}
                  otpInputVisible={otpInputVisible}
                  setOtpInputVisible={setOtpInputVisible}
                  otpValues={otpValues}
                  setOtpValues={setOtpValues}
                  handleVerifyOTP={handleVerifyOTP}
                  handleRemove={handleRemove}
                  loading={loading}
                />
              ))
            )}
          </div>

          {/* Add Form */}
          <div className="mt-6">
            {showAddForm ? (
              <div className="bg-[#F9FAFB] border border-purple-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Add Team Member</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 text-sm font-medium"
                      value={newMember.name}
                      onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 bg-white text-sm font-medium appearance-none cursor-pointer"
                        value={newMember.role}
                        onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                      >
                        <option value="">Select Role</option>
                        <option value="Founder">Founder</option>
                        <option value="Co-Founder">Co-Founder</option>
                        <option value="CTO">CTO</option>
                        <option value="CFO">CFO</option>
                        <option value="COO">COO</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                          <path d="M1 1.5L6 6.5L11 1.5" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center w-full px-4 rounded-xl border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-purple-100 focus-within:border-purple-400 overflow-hidden transition-all">
                    <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full py-3 pl-3 text-sm font-medium outline-none border-none bg-transparent placeholder-gray-400"
                      value={newMember.email}
                      onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 ml-1">A verification email will be sent to this address</p>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-2.5 rounded-xl bg-white text-gray-500 border border-gray-200 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendInvite}
                    disabled={loading}
                    className="px-8 py-2.5 rounded-xl bg-[#4E54C6] text-white font-semibold shadow-md hover:bg-[#4348aa] transition-all disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Add Member'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full bg-white text-[#4E54C6] border border-[#4E54C6] px-6 py-3 rounded-md font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#4E54C6] hover:text-white transition-all shadow-sm group"
              >
                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Add Team Member
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 flex justify-end gap-3 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-white text-gray-500 border border-gray-200 font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-8 py-2.5 rounded-xl bg-[#4E54C6] text-white font-bold shadow-md hover:bg-[#4348aa] transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Modal Row ---
const ModalRow = ({
  member, otpInputVisible, setOtpInputVisible, otpValues, setOtpValues,
  handleVerifyOTP, handleRemove, loading
}) => {
  const isVerified = member.verified || member.status === 'verified';
  const avatarUrl = member.profileImage || member.avatar || member.image?.url;
  const isEditingOTP = otpInputVisible === member.email;
  const displayName = member.name || member.userName;

  return (
    <div className="bg-[#F9FAFB] rounded-2xl p-4 flex items-center justify-between gap-4 border border-transparent hover:border-gray-100 transition-colors">

      {/* Left: Info */}
      <div className="flex items-center gap-4 flex-1 overflow-hidden">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-12 h-12 rounded-full object-cover border border-white shadow-sm"
          />
        ) : (
          <div className={`w-12 h-12 rounded-full ${COLORS.gradient} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
            {(displayName || 'U').charAt(0).toUpperCase()}
          </div>
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="font-bold text-gray-900 text-base truncate">{displayName}</h4>
            <span className="bg-purple-100 text-purple-700 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md font-bold">
              {member.position || member.role}
            </span>
          </div>
          <p className="text-gray-500 text-sm truncate">{member.email}</p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 shrink-0">

        {isVerified ? (
          <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold">
            <ShieldCheck className="w-4 h-4" /> Verified
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg text-sm font-bold">
              <Clock className="w-4 h-4" /> Pending
            </div>

            {isEditingOTP ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  type="text"
                  placeholder="Enter OTP"
                  maxLength={6}
                  className="w-28 px-3 py-1.5 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={otpValues[member.email] || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setOtpValues(p => ({ ...p, [member.email]: val }));
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && otpValues[member.email]?.length === 6) {
                      handleVerifyOTP(member.email, displayName, member.position || member.role, avatarUrl);
                    }
                  }}
                />
                <button
                  onClick={() => handleVerifyOTP(member.email, displayName, member.position || member.role, avatarUrl)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                  disabled={loading || !otpValues[member.email] || otpValues[member.email].length !== 6}
                >
                  {loading ? 'Verifying...' : 'Confirm'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setOtpInputVisible(member.email)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm shadow-blue-200"
              >
                <KeyRound className="w-3.5 h-3.5" /> Enter OTP
              </button>
            )}
          </>
        )}

        <button
          onClick={() => handleRemove(member.email)}
          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FoundingTeamWidget;