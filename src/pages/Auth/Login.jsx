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
    const handleLogin = (e) => {
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
            return;
        }
        setErrors({});
        setIsLoading(true);
        const isEmail = trimmedLoginId.includes('@');
        const usernameVal = isEmail ? '' : trimmedLoginId;
        const emailVal = isEmail ? trimmedLoginId : '';
        login(usernameVal, emailVal, trimmedPassword)
            .then((success) => {
            setIsLoading(false);
            if (success) {
                showToast('success', 'Welcome Back!', `Logged in as ${trimmedLoginId}`);
                navigate('/');
            }
            else {
                showToast('error', 'Login Error', 'Invalid credentials or login failed.');
            }
        })
            .catch((err) => {
            setIsLoading(false);
            showToast('error', 'Connection Error', 'Could not reach server.');
        });
    };
    return (<div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold font-outfit text-white">Sign in to console</h1>
        <p className="text-sm text-slate-400">
          Enter credentials below to enter the sandbox dashboard.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 text-slate-300">
        <Input label="Username or Email" type="text" value={loginId} onChange={(e) => setLoginId(e.target.value)} error={errors.loginId} leftIcon={<User className="h-4 w-4"/>} placeholder="e.g. admin or admin@yourdomain.com"/>

        <div className="space-y-1">
          <Input label="Password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} leftIcon={<Lock className="h-4 w-4"/>} placeholder="••••••••" rightIcon={<button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-hidden hover:text-primary text-slate-400 dark:text-slate-500 cursor-pointer transition-colors p-1" tabIndex="-1">
                {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
              </button>}/>
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
