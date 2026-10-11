import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotification } from './NotificationContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { showToast } = useNotification();

  // Requirement 1: Start as logged out on every fresh run/browser session
  // Use sessionStorage so closing browser or running project starts logged out
  const [user, setUser] = useState(() => {
    try {
      // Clean up legacy localStorage so it never auto-logs in from past runs
      localStorage.removeItem('smartpark_active_user');
      const saved = sessionStorage.getItem('smartpark_session_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(sessionStorage.getItem('smartpark_session_user'));
  });

  // Modal for showing dispatched verification email
  const [emailModalData, setEmailModalData] = useState(null);

  useEffect(() => {
    if (user && isLoggedIn) {
      sessionStorage.setItem('smartpark_session_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('smartpark_session_user');
    }
  }, [user, isLoggedIn]);

  const login = async (email, password) => {
    try {
      const trimmedEmail = (email || '').trim();
      const trimmedPassword = (password || '').trim();

      const res = await fetch('http://127.0.0.1:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Login failed. Please check your credentials.', 'error');
        return {
          success: false,
          error: data.error || 'Invalid credentials',
          unverified: data.unverified,
          email: data.email
        };
      }

      setUser(data.user);
      setIsLoggedIn(true);
      showToast(`Welcome back, ${data.user.name}!`);
      return { success: true, user: data.user };
    } catch (err) {
      console.error('Backend login error:', err.message);

      // Distinguish server network failure from bad credentials!
      const isNetworkError = err.name === 'TypeError' || err.message?.includes('fetch') || err.message?.includes('Failed to fetch');
      if (isNetworkError) {
        const errorMsg = 'Cannot reach backend server on port 5000. Please ensure the server is running.';
        showToast(errorMsg, 'error');
        return { success: false, error: errorMsg };
      }

      const msg = err.message || 'Login failed. Please verify your details.';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  // Step 1 of Registration: Request verification OTP sent to personal Gmail
  const requestRegister = async (formData) => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName?.trim(),
          email: formData.email?.trim().toLowerCase(),
          phone: formData.phone?.trim(),
          password: formData.password?.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Registration failed.', 'error');
        return { success: false, error: data.error };
      }

      showToast(`Verification code sent to ${data.email}. Check your Gmail!`);
      return {
        success: true,
        email: data.email,
        message: data.message
      };
    } catch (err) {
      console.error('Registration network error:', err);
      const msg = 'Cannot connect to SmartPark server. Please verify backend status.';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  // Step 2 of Registration: Verify code entered from Gmail
  const verifyRegistration = async (email, code) => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/verify-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: (email || '').trim().toLowerCase(),
          code: (code || '').trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Verification failed. Please check the code.', 'error');
        return { success: false, error: data.error };
      }

      setUser(data.user);
      setIsLoggedIn(true);
      showToast(`Account verified! Welcome to SmartPark, ${data.user.name}.`);
      return { success: true, user: data.user };
    } catch (err) {
      console.error('Verify registration network error:', err);
      const msg = 'Connection error. Please try verifying again.';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  // Resend code to Gmail
  const resendVerificationCode = async (email) => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: (email || '').trim().toLowerCase() })
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Could not resend code.', 'error');
        return { success: false, error: data.error };
      }

      showToast(data.message || 'Fresh verification code dispatched to your Gmail!');
      return { success: true, message: data.message };
    } catch (err) {
      const msg = 'Failed to connect to server.';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  // Backward compatibility alias for register
  const register = async (formData) => {
    return requestRegister(formData);
  };

  // Step 1 of Forgot Password: Request OTP sent to personal Gmail
  const forgotPassword = async (email) => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: (email || '').trim().toLowerCase() })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to request password reset.', 'error');
        return { success: false, error: data.error };
      }
      showToast(data.message || 'Password reset OTP dispatched to your Gmail inbox.');
      return { success: true, message: data.message };
    } catch (err) {
      const msg = 'Unable to reach backend server. Please verify server is running.';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  // Step 2 of Forgot Password: Reset password with code from Gmail
  const resetPassword = async (email, code, newPassword) => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: (email || '').trim().toLowerCase(),
          code: (code || '').trim(),
          newPassword: (newPassword || '').trim()
        })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Password reset failed.', 'error');
        return { success: false, error: data.error };
      }
      showToast(data.message || 'Password updated! Please sign in with your new password.');
      return { success: true, message: data.message };
    } catch (err) {
      const msg = 'Failed to connect to server to reset password.';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    sessionStorage.removeItem('smartpark_session_user');
    localStorage.removeItem('smartpark_active_user');
    showToast('You have been signed out.', 'info');
  };

  const updateProfile = async (updatedFields) => {
    // 1. Optimistically update local state & sessionStorage
    setUser((prev) => {
      const updated = {
        ...prev,
        ...updatedFields
      };
      sessionStorage.setItem('smartpark_session_user', JSON.stringify(updated));
      return updated;
    });

    showToast('Profile updated successfully!');

    // 2. Persist to MongoDB database
    if (user?.email) {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/users/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, ...updatedFields })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            sessionStorage.setItem('smartpark_session_user', JSON.stringify(data.user));
          }
        }
      } catch (err) {
        console.warn('Profile DB sync notice:', err.message);
      }
    }
  };

  const toggleSaveParking = async (parkingId) => {
    if (!isLoggedIn) {
      showToast('Please sign in to save favorite parking spaces.', 'info');
      return;
    }

    const currentSaved = user?.savedParkingIds || [];
    const exists = currentSaved.includes(parkingId);
    const updatedSaved = exists
      ? currentSaved.filter((id) => id !== parkingId)
      : [...currentSaved, parkingId];

    // Optimistically update local state & sessionStorage
    setUser((prev) => {
      const updatedUser = {
        ...prev,
        savedParkingIds: updatedSaved
      };
      sessionStorage.setItem('smartpark_session_user', JSON.stringify(updatedUser));
      return updatedUser;
    });

    showToast(exists ? 'Removed from saved parking' : 'Saved to favorites!');

    // Persist to MongoDB database
    if (user?.email) {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/users/saved-parking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, parkingId })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.savedParkingIds) {
            setUser((prev) => {
              const u = { ...prev, savedParkingIds: data.savedParkingIds };
              sessionStorage.setItem('smartpark_session_user', JSON.stringify(u));
              return u;
            });
          }
        }
      } catch (err) {
        console.warn('Saved parking DB sync notice:', err.message);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        register,
        requestRegister,
        verifyRegistration,
        resendVerificationCode,
        forgotPassword,
        resetPassword,
        logout,
        updateProfile,
        toggleSaveParking,
        emailModalData: null,
        setEmailModalData: () => {}
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
