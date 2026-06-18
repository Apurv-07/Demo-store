import React, { useState } from "react";
import { X, Lock, User as UserIcon, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginStart, loginSuccess, loginFailure, clearAuthError } from "../store/slices/authSlice";
import { AnimatePresence, motion } from "motion/react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showDemoUsers, setShowDemoUsers] = useState(true);

  // Ready-to-go credentials from DummyJSON API to make testing super fast
  const demoUsers = [
    { name: "Emily Smith", username: "emilys", pass: "emilyspass", role: "Primary Buyer" },
    { name: "Michael Williams", username: "michaelw", pass: "michaelwpass", role: "Elite Member" }
  ];

  const handleFillCredentials = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    dispatch(loginStart());

    try {
      const res = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          expiresInMins: 120, // optional dummyJSON flag
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Invalid username or password");
      }

      const userData = await res.json();
      dispatch(loginSuccess(userData));
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      dispatch(loginFailure(msg));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal box */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 flex flex-col pointer-events-auto"
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-gray-900 text-white rounded-xl">
                    <Lock size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Secure Sign-In</h3>
                    <p className="text-[11px] text-gray-400">Unlock custom member profiles and checkout privileges</p>
                  </div>
                </div>
                <button
                  className="p-1 px-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors border border-transparent hover:border-gray-100 cursor-pointer"
                  onClick={onClose}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {isAuthenticated ? (
                  <div className="text-center py-6 space-y-3">
                    <div className="mx-auto w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={32} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Welcome Back, {user?.firstName}!</h4>
                      <p className="text-xs text-gray-400 mt-1">Successfully signed in through secure DummyJSON network.</p>
                    </div>
                    <div className="text-[11px] bg-emerald-50 text-emerald-800 p-2.5 rounded-xl inline-block font-mono">
                      Token: {user?.token ? `${user.token.substring(0, 24)}...` : "N/A (Local Session)"}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Error indicator */}
                    {error && (
                      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start space-x-3 text-rose-800 text-xs text-left">
                        <AlertCircle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold block">Authentication Refused</span>
                          <span>{error}</span>
                        </div>
                      </div>
                    )}

                    {/* Main Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5 font-sans">
                          Username
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <UserIcon size={14} />
                          </span>
                          <input
                            type="text"
                            required
                            placeholder="Enter test username"
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 focus:border-gray-900 rounded-xl text-xs placeholder-gray-400 focus:outline-none transition-colors"
                            value={username}
                            onChange={(e) => {
                              setUsername(e.target.value);
                              if (error) dispatch(clearAuthError());
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5 font-sans">
                          Password
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Lock size={14} />
                          </span>
                          <input
                            type="password"
                            required
                            placeholder="Enter test password"
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 focus:border-gray-900 rounded-xl text-xs placeholder-gray-400 focus:outline-none transition-colors"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              if (error) dispatch(clearAuthError());
                            }}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium text-xs rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        {isLoading ? (
                          <span>Verifying with DummyJSON API...</span>
                        ) : (
                          <span>Sign In Securely</span>
                        )}
                      </button>
                    </form>

                    {/* Quick Demo Accounts Banner */}
                    {showDemoUsers && (
                      <div className="pt-4 border-t border-gray-100 text-left">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles size={11} className="text-yellow-500" /> DummyJSON Live Accounts
                          </span>
                          <button
                            className="text-[10px] text-gray-400 hover:text-gray-900 transition-colors underline cursor-pointer"
                            onClick={() => setShowDemoUsers(false)}
                          >
                            Hide suggestions
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {demoUsers.map((user_i, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className="p-3 bg-gray-50 hover:bg-gray-100/80 border border-gray-100 rounded-xl flex flex-col hover:border-gray-300 text-left transition-all cursor-pointer group"
                              onClick={() => handleFillCredentials(user_i.username, user_i.pass)}
                            >
                              <span className="text-xs font-semibold text-gray-900 leading-tight block group-hover:text-gray-900">
                                {user_i.name}
                              </span>
                              <span className="text-[9.5px] text-gray-400 block mt-0.5">
                                User: <span className="font-mono text-gray-600 bg-white px-1 border border-gray-100 rounded">{user_i.username}</span>
                              </span>
                              <span className="text-[9.5px] text-gray-400 block mt-0.5">
                                Pass: <span className="font-mono text-gray-600 bg-white px-1 border border-gray-100 rounded">{user_i.pass}</span>
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
