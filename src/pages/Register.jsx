import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  RotateCw,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';

export const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/search';
  const { requestRegister, verifyRegistration, resendVerificationCode } = useAuth();

  // Step 1 = Enter details & send OTP, Step 2 = Enter OTP from personal Gmail
  const [step, setStep] = useState(1);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Step 2 OTP Fields
  const [verificationCode, setVerificationCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Countdown timer for Resend Code in Step 2
  useEffect(() => {
    let timer = null;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendTimer]);

  const validateStep1 = () => {
    const errs = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email address is required';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) errs.phone = 'Valid 10-digit phone number is required';
    if (!password || password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!termsAgreed) errs.terms = 'You must agree to the Terms of Service';
    return errs;
  };

  // Step 1: Submit details -> calls backend to send OTP to Gmail
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    const errs = validateStep1();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    setOtpError('');

    const res = await requestRegister({
      fullName,
      email,
      phone,
      password
    });

    setIsLoading(false);

    if (res?.success) {
      setStep(2);
      setVerificationCode('');
      setResendTimer(30);
    } else {
      setErrors({ form: res?.error || 'Registration failed. Please try again.' });
    }
  };

  // Step 2: Submit OTP entered from personal Gmail
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setOtpError('');

    const cleanCode = verificationCode.trim();
    if (!cleanCode || cleanCode.length < 6) {
      setOtpError('Please enter the complete 6-digit code received in your Gmail inbox.');
      return;
    }

    setOtpLoading(true);
    const res = await verifyRegistration(email, cleanCode);
    setOtpLoading(false);

    if (res?.success) {
      navigate(redirectPath);
    } else {
      setOtpError(res?.error || 'Invalid verification code. Please check your Gmail inbox.');
    }
  };

  // Resend code to Gmail
  const handleResend = async () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    setOtpError('');
    await resendVerificationCode(email);
    setIsResending(false);
    setResendTimer(30);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-stretch">
      {/* LEFT: Visual Showcase Column (Responsive: hidden on mobile, flex on desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-12 text-white flex-col justify-between overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

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
            Guaranteed parking spots, reserved in seconds.
          </h2>
          <p className="text-base text-slate-300 leading-relaxed">
            Create your SmartPark Driver account to unlock instant bay bookings, live vacancy tracking, and seamless QR gate entry.
          </p>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            {[
              'Email-verified secure driver registration',
              'Guaranteed spot holds before arrival with zero surge pricing',
              '55+ smart parking facilities across major urban centers',
              'Automated ANPR camera plate recognition support'
            ].map((p) => (
              <div key={p} className="flex items-center gap-2.5 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Real-time email verification powered by SmartPark Node.js Email Service</span>
        </div>
      </div>

      {/* RIGHT: Interactive Registration Flow */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-12 bg-white text-left overflow-y-auto">
        <div className="w-full max-w-md space-y-6">

          {/* STEP 1: Registration Details */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Create your account
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Enter your details below. A 6-digit verification code will be sent to your Gmail inbox.
                </p>
              </div>

              {errors.form && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errors.form}</span>
                </div>
              )}

              <form onSubmit={handleRequestOTP} className="space-y-4">
                <Input
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rashmitha Rao"
                  icon={User}
                  error={errors.fullName}
                  required
                />

                <Input
                  label="Email Address (OTP will be sent here)"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  icon={Mail}
                  error={errors.email}
                  required
                />

                <Input
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  icon={Phone}
                  error={errors.phone}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={Lock}
                    error={errors.password}
                    required
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={Lock}
                    error={errors.confirmPassword}
                    required
                  />
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAgreed}
                      onChange={(e) => setTermsAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>
                      I agree to the SmartPark{' '}
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(true)}
                        className="text-emerald-600 font-bold underline hover:text-emerald-700 inline"
                      >
                        Terms of Service
                      </button>{' '}
                      and privacy policy.
                    </span>
                  </label>
                  {errors.terms && (
                    <span className="text-xs text-rose-500 font-medium block mt-1">
                      {errors.terms}
                    </span>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full text-sm font-bold shadow-md shadow-emerald-600/20"
                >
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </form>

              <div className="text-center pt-1 text-xs text-slate-500">
                Already have an account?{' '}
                <Link
                  to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
                  className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </div>
          )}

          {/* STEP 2: Verify OTP Sent to Personal Gmail */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                  <Mail className="w-7 h-7" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Verify your email
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                  We've sent a 6-digit verification code to:
                </p>
                <div className="inline-flex items-center gap-1.5 font-bold text-slate-900 text-sm bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                  <span>{email}</span>
                </div>
                <p className="text-xs text-slate-400">
                  Please check your Gmail inbox (and Spam folder) and enter the code below.
                </p>
              </div>

              {otpError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{otpError}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 text-center">
                    Enter 6-Digit Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      autoFocus
                      value={verificationCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setVerificationCode(val);
                        if (otpError) setOtpError('');
                      }}
                      placeholder="• • • • • •"
                      className="w-full text-center font-mono text-2xl sm:text-3xl font-extrabold tracking-[0.4em] py-3.5 px-4 rounded-2xl border-2 border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all placeholder:text-slate-300 text-slate-900"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 text-center mt-2">
                    Code expires in 15 minutes
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={otpLoading}
                  disabled={verificationCode.length !== 6}
                  className="w-full text-sm font-bold shadow-md shadow-emerald-600/20"
                >
                  <span>Verify & Complete Registration</span>
                  <CheckCircle2 className="w-4 h-4 ml-1.5" />
                </Button>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtpError('');
                    }}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change email address</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendTimer > 0 || isResending}
                    className={`inline-flex items-center gap-1 font-bold ${
                      resendTimer > 0 || isResending
                        ? 'text-slate-400 cursor-not-allowed'
                        : 'text-emerald-600 hover:text-emerald-700 hover:underline'
                    }`}
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                    <span>
                      {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* Terms of Service Modal */}
      <Modal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="SmartPark Terms of Service & Privacy"
        maxWidth="max-w-lg"
      >
        <div className="space-y-4 text-xs text-slate-600 text-left max-h-[60vh] overflow-y-auto pr-2">
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">1. Reservation & Guaranteed Spots</h4>
            <p className="leading-relaxed">
              Upon reserving a bay through SmartPark, your allocated slot is reserved specifically for your registered vehicle plate number. Arrive up to 30 minutes before your slot commencement.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">2. Cancellation & Instant Refund</h4>
            <p className="leading-relaxed">
              Reservations cancelled prior to reservation start time receive 100% immediate credit refund back to original payment method with zero cancellation fees.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">3. Extensions & Overstay Policy</h4>
            <p className="leading-relaxed">
              If running late, use the in-app "Extend Booking" option before your session expires to avoid overstay penalty rates.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">4. Facility Security & Surveillance</h4>
            <p className="leading-relaxed">
              All facilities adhere to 24/7 CCTV surveillance, automated license plate recognition (ANPR), and on-site staff patrols.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">5. Data Privacy & Communications</h4>
            <p className="leading-relaxed">
              We never share your personal phone or email details with third-party advertisers. Dispatched emails are exclusively for booking vouchers, QR passes, and security PIN verification.
            </p>
          </div>

          <div className="pt-3 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setTermsAgreed(true);
                setShowTermsModal(false);
              }}
            >
              I Understand & Agree
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Register;
