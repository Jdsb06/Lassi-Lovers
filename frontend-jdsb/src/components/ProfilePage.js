import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Header from './Header';

const ProfilePage = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    confirmPassword: ''
  });
  const [passwordChangeData, setPasswordChangeData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  // Sync formData when user loads/changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChangeInput = (e) => {
    const { name, value } = e.target;
    setPasswordChangeData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isLoginView) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const url = isLoginView ? '/api/login' : '/api/register';
      const body = isLoginView
        ? { email: formData.email, password: formData.password }
        : {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
          };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const data = await response.json();
        login(data.user, data.token);
        navigate('/');
      } else {
        const error = await response.json();
        setErrors({ form: error.message || 'Authentication failed.' });
      }
    } catch (err) {
      console.error(err);
      setErrors({ form: 'An error occurred. Please try again later.' });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
        })
      });

      if (response.ok) {
        const data = await response.json();
        login(data.user, token);
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      } else {
        const error = await response.json();
        setErrors({ form: error.message || 'Update failed.' });
      }
    } catch (err) {
      console.error(err);
      setErrors({ form: 'An error occurred. Please try again later.' });
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        logout();
        navigate('/');
      } else {
        const error = await response.json();
        setDeleteError(error.message || 'Failed to delete account.');
      }
    } catch (err) {
      console.error(err);
      setDeleteError('An unexpected error occurred.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match';
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePassword = async () => {
    if (!validatePasswordForm()) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        setPasswordUpdateSuccess(true);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
        setTimeout(() => setPasswordUpdateSuccess(false), 3000);
      } else {
        const error = await response.json();
        setPasswordErrors({ form: error.message || 'Password update failed.' });
      }
    } catch (err) {
      console.error(err);
      setPasswordErrors({ form: 'An error occurred. Please try again later.' });
    }
  };

  // Unauthenticated view
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-red-600 px-6 py-8 text-center">
            <h2 className="text-3xl font-extrabold text-white">
              {isLoginView ? 'Sign in to your account' : 'Create a new account'}
            </h2>
            <p className="mt-2 text-white/80">
              {isLoginView
                ? 'Access all features of FactChecker'
                : 'Join our fact-checking community'}
            </p>
          </div>
          <div className="px-6 py-8">
            {errors.form && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-600 p-4 rounded-md">
                <p className="text-red-600 text-sm">{errors.form}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginView && (
                <>
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number (optional)
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLoginView ? 'current-password' : 'new-password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
              {!isLoginView && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              )}
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl shadow-md text-white bg-gradient-to-r from-blue-900 to-red-600 hover:from-blue-800 hover:to-red-700 transform hover:scale-105 transition-all duration-200"
                >
                  {isLoginView ? 'Sign In' : 'Sign Up'}
                </button>
              </div>
            </form>
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLoginView(!isLoginView)}
                className="text-blue-900 hover:text-red-600 transition-colors font-medium"
              >
                {isLoginView
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated view
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile header */}
          <div className="bg-gradient-to-r from-blue-900 to-red-600 px-6 py-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-blue-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-white/80">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg"
            >
              Sign Out
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {['profile', 'activity', 'settings'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-red-600 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab === 'profile'
                    ? 'Profile'
                    : tab === 'activity'
                    ? 'My Activity'
                    : 'Account Settings'}
                </button>
              ))}
            </nav>
          </div>

          <div className="px-6 py-8">
            {activeTab === 'profile' && (
              <>
                {updateSuccess && (
                  <div className="mb-4 bg-green-50 border-l-4 border-green-600 p-4 rounded-md">
                    <p className="text-green-600">Profile updated successfully!</p>
                  </div>
                )}
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2 px-6 rounded-md text-white bg-gradient-to-r from-blue-900 to-red-600 hover:from-blue-800 hover:to-red-700 transform hover:scale-105 transition duration-200"
                  >
                    Save Changes
                  </button>
                </form>
              </>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Your Submissions</h3>
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-gray-500">Your submitted claims and reviews will appear here.</p>
                  <button
                    onClick={() => navigate('/submit')}
                    className="mt-4 inline-flex items-center px-4 py-2 shadow-sm text-white bg-gradient-to-r from-blue-900 to-red-600 rounded-md hover:from-blue-800 hover:to-red-700"
                  >
                    Submit a New Claim
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>

                {/* Change Password */}
                <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
                  <div className="px-4 py-5 sm:p-6">
                    <h4 className="text-md font-medium text-gray-900">Change Password</h4>
                    <div className="mt-4 space-y-4">
                      {passwordUpdateSuccess && (
                        <div className="mb-4 bg-green-50 border-l-4 border-green-600 p-4 rounded-md">
                          <p className="text-green-600">Password updated successfully!</p>
                        </div>
                      )}
                      {passwordErrors.form && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-600 p-4 rounded-md">
                          <p className="text-red-600 text-sm">{passwordErrors.form}</p>
                        </div>
                      )}
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          id="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className={`mt-1 block w-full px-3 py-2 border ${passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {passwordErrors.currentPassword && (
                          <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className={`mt-1 block w-full px-3 py-2 border ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {passwordErrors.newPassword && (
                          <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmNewPassword"
                          id="confirmNewPassword"
                          value={passwordData.confirmNewPassword}
                          onChange={handlePasswordChange}
                          className={`mt-1 block w-full px-3 py-2 border ${passwordErrors.confirmNewPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {passwordErrors.confirmNewPassword && (
                          <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmNewPassword}</p>
                        )}
                      </div>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleUpdatePassword}
                          className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-900 to-red-600 hover:from-blue-800 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="p-6">
                    <h4 className="text-md font-medium text-gray-900">Notification Settings</h4>
                    <div className="mt-4 flex items-start">
                      <input
                        id="emailNotif"
                        name="emailNotif"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <div className="ml-3 text-sm">
                        <label htmlFor="emailNotif" className="font-medium text-gray-700">
                          Email notifications
                        </label>
                        <p className="text-gray-500">
                          Receive emails about your submissions and important updates
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="p-6">
                    <h4 className="text-md font-medium text-red-600">Danger Zone</h4>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="mt-4 inline-flex justify-center py-2 px-4 rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      Delete Account
                    </button>
                    <p className="mt-2 text-xs text-gray-500">
                      This action cannot be undone. Your data will be permanently removed.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Delete Account</h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              {deleteError && <p className="mt-2 text-sm text-red-600">{deleteError}</p>}
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="py-2 px-4 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="py-2 px-4 rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;

