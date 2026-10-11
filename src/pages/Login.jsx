import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';

export const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/search';
  const { login, forgotPassword, resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState(1); // 1 = Request OTP, 2 = Verify & Set Password
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    const result = await login(trimmedEmail, trimmedPassword);
    setIsLoading(false);

    if (result?.success) {
      if (result.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(redirectPath);
      }
    } else {
      setError(result?.error || 'Invalid email or password.');
    }
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setForgotError('');
    const trimmed = forgotEmail.trim();
    if (!trimmed) {
      setForgotError('Please enter your registered email address.');
      return;
    }
    setForgotLoading(true);
    const res = await forgotPassword(trimmed);
    setForgotLoading(false);
    if (res?.success) {
      setForgotStep(2);
      setResetCode('');
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      setForgotError(res?.error || 'Account not found with this email.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError('');

    const cleanCode = resetCode.trim();
    const cleanPass = newPassword.trim();
    const cleanConfirm = confirmNewPassword.trim();

    if (!cleanCode || cleanCode.length < 6) {
      setForgotError('Please enter the complete 6-digit verification code received in your Gmail.');
      return;
    }
    if (!cleanPass || cleanPass.length < 6) {
      setForgotError('New password must be at least 6 characters.');
      return;
    }
    if (cleanPass !== cleanConfirm) {
      setForgotError('Passwords do not match. Please verify.');
      return;
    }

    setForgotLoading(true);
    const res = await resetPassword(forgotEmail.trim(), cleanCode, cleanPass);
    setForgotLoading(false);

    if (res?.success) {
      setForgotSuccess('Your password has been reset successfully! You can now sign in.');
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotStep(1);
        setForgotSuccess('');
        setPassword(cleanPass);
        setEmail(forgotEmail.trim());
      }, 1500);
    } else {
      setForgotError(res?.error || 'Invalid verification code. Please check your Gmail.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-stretch">
      {/* LEFT: Brand / Visual Column */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-12 text-white flex-col justify-between overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
            <span className="font-extrabold text-xl font-mono leading-none">🅿</span>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            Smart<span className="text-emerald-400">Park</span>
          </span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg text-left">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Effortless city parking, reserved in seconds.
          </h2>
          <p className="text-base text-slate-300 leading-relaxed">
            Gain immediate access to verified covered bays, high-speed EV chargers, and contactless barrier entry across major metropolitan zones.
          </p>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            {[
              'Guaranteed spot holds before arrival with zero surge pricing',
              'Real-time IoT occupancy telemetry across 55+ locations',
              'Fast contactless QR entry boom barriers'
            ].map((perk) => (
              <div key={perk} className="flex items-center gap-2.5 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{perk}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Full-Stack Node.js, Express & MongoDB secured session</span>
        </div>
      </div>

      {/* RIGHT: Login Form (Clean, without demo pills, with eye icon & forgot password) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white text-left">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign In
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Welcome to SmartPark. Enter your credentials to access your account.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={Mail}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-600 font-medium">Remember me</span>
              </label>

              {/* Requirement 4: Forgot Password Option */}
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setForgotStep(1);
                  setForgotError('');
                  setForgotSuccess('');
                  setShowForgotModal(true);
                }}
                className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full text-sm font-bold shadow-md shadow-emerald-600/20"
            >
              <span>Sign In & Continue</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link
              to={`/register?redirect=${encodeURIComponent(redirectPath)}`}
              className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>

      {/* Requirement 4: Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Account Password"
        description="We'll send a 6-digit verification code to your registered email"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-left">
          {forgotError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {forgotError}
            </div>
          )}

          {forgotSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-bold">
              {forgotSuccess}
            </div>
          )}

          {forgotStep === 1 ? (
            <form onSubmit={handleRequestOTP} className="space-y-4">
              <Input
                label="Registered Email Address"
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="you@example.com"
                icon={Mail}
                required
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setShowForgotModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={forgotLoading}
                >
                  Send Verification Code
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-800">
                A 6-digit OTP code was sent to <strong>{forgotEmail}</strong>. Please check your Gmail inbox and enter the code below.
              </div>

              <Input
                label="6-Digit Verification Code (from your Gmail)"
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="e.g. 542891"
                icon={KeyRound}
                required
              />

              <Input
                label="New Password (min 6 characters)"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new strong password"
                icon={Lock}
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Re-enter new password"
                icon={Lock}
                required
              />

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setForgotStep(1)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  ← Back to Email
                </button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={forgotLoading}
                >
                  Update Password
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Login;
