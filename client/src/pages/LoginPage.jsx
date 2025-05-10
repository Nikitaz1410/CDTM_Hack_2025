// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Heart, Loader, AlertCircle } from 'lucide-react';
import authService from '../services/authService';

const LoginPage = ({ onLogin, onRegistration }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(''); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                // For login, we use the username field (which is actually the email)
                const response = await authService.login(formData.username, formData.password);
                onLogin(response.user);
            } else {
                // Registration - new users need onboarding
                const response = await authService.register({
                    username: formData.username,
                    password: formData.password,
                    email: formData.email
                });
                onRegistration(response.user); // This triggers onboarding
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({
            username: '',
            password: '',
            email: ''
        });
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center px-6">
            {/* Logo/Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 flex items-center justify-center">
                    <Heart className="text-teal-600" size={32} />
                </div>
                <h1 className="text-2xl font-bold">Health Tracker</h1>
                <p className="text-gray-600 mt-2">
                    {isLogin ? 'Welcome back!' : 'Create your account'}
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                    <AlertCircle size={16} className="mr-2" />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            {/* Login/Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isLogin ? 'Email' : 'Username'}
                    </label>
                    <input
                        type={isLogin ? 'email' : 'text'}
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder={isLogin ? 'Enter your email' : 'Enter username'}
                        required
                    />
                </div>

                {!isLogin && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Enter your password"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {loading ? (
                        <>
                            <Loader className="animate-spin mr-2" size={20} />
                            {isLogin ? 'Signing in...' : 'Creating account...'}
                        </>
                    ) : (
                        isLogin ? 'Sign In' : 'Create Account'
                    )}
                </button>
            </form>

            {/* Toggle between login/register */}
            <div className="mt-6 text-center">
                <p className="text-gray-600">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={toggleMode}
                        className="text-teal-600 font-medium hover:text-teal-700"
                    >
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;