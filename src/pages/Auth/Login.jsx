import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
export const Login = () => {
    const { login } = useApp();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const handleLogin = async (e) => {
        e.preventDefault();
        const trimmedLoginId = loginId.trim();
        const trimmedPassword = password.trim();
        const newErrors = {};
        if (!trimmedLoginId) {
            newErrors.loginId = 'Username or Email is required';
        }
        if (!trimmedPassword) {
            newErrors.password = 'Password is required';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            showToast('error', 'Validation Error', 'Please enter required login credentials.');
            return;
        }
        setErrors({});
        setIsLoading(true);
        const isEmail = trimmedLoginId.includes('@');
        const usernameVal = isEmail ? '' : trimmedLoginId;
        const emailVal = isEmail ? trimmedLoginId : '';

        try {
            const result = await login(usernameVal, emailVal, trimmedPassword);
            setIsLoading(false);
            if (result && (result === true || result.success)) {
                showToast('success', 'Welcome Back!', `Logged in as ${trimmedLoginId}`);
                navigate('/');
            } else {
                showToast('error', 'Login Error', (result && result.error) || 'Invalid credentials or login failed.');
            }
        } catch (err) {
            setIsLoading(false);
            showToast('error', 'Connection Error', 'Could not reach server.');
        }
    };
    const handleDemoFill = () => {
        setLoginId('admin');
        setPassword('admin123');
        setErrors({});
    };

    return (<div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold font-outfit text-white">Sign in to console</h1>
        <p className="text-sm text-slate-400">
          Enter credentials below to enter the dashboard.
        </p>
      </div>

      <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs">
        <div className="text-slate-400">
          <span className="text-slate-200 font-semibold">Demo Account:</span> admin / admin123
        </div>
        <button
          type="button"
          onClick={handleDemoFill}
          className="text-primary hover:text-blue-400 font-semibold cursor-pointer underline text-xs"
        >
          Auto fill
        </button>
      </div>

      <form onSubmit={handleLogin} noValidate className="space-y-4 text-slate-300">
        <Input
          label="Username or Email"
          type="text"
          value={loginId}
          onChange={(e) => {
            setLoginId(e.target.value);
            if (errors.loginId) setErrors((prev) => ({ ...prev, loginId: '' }));
          }}
          error={errors.loginId}
          leftIcon={<User className="h-4 w-4"/>}
          placeholder="e.g. admin or admin@yourdomain.com"
        />

        <div className="space-y-1">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
            }}
            error={errors.password}
            leftIcon={<Lock className="h-4 w-4"/>}
            placeholder="••••••••"
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-hidden hover:text-primary text-slate-400 dark:text-slate-500 cursor-pointer transition-colors p-1"
                tabIndex="-1"
              >
                {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
              </button>
            }
          />
          <div className="text-right">
            <Link to="/forgot-password" className="text-xs text-primary hover:text-blue-400 font-semibold">
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
          Login
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary hover:text-blue-400 font-semibold">
          Register now
        </Link>
      </div>
    </div>);
};
