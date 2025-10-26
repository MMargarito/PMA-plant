import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useMutation, gql } from '@apollo/client';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        email
        first_name
        last_name
        role
      }
      accessToken
      refreshToken
    }
  }
`;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [login, { loading }] = useMutation(LOGIN_MUTATION);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const { data } = await login({
        variables: { input: formData },
      });

      dispatch(loginSuccess(data.login));
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-myceili-gradient py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 space-y-8">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-myceili-gradient rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="16" y1="28" x2="16" y2="6" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="16" cy="6" r="3" fill="white"/>
              <line x1="16" y1="12" x2="8" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="8" cy="12" r="3" fill="white"/>
              <line x1="16" y1="12" x2="24" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="24" cy="12" r="3" fill="white"/>
              <line x1="16" y1="22" x2="8" y2="22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="8" cy="22" r="3" fill="white"/>
              <line x1="16" y1="22" x2="24" y2="22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="24" cy="22" r="3" fill="white"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-myceili-gradient bg-clip-text text-transparent mb-2">
            Myceili
          </h1>
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-myceili-gradient hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium bg-myceili-gradient bg-clip-text text-transparent hover:opacity-75 transition-opacity"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

