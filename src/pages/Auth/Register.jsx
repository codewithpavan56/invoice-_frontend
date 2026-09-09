import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
export const Register = () => {
    const { register } = useApp();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleRegister = async (e) => {
        e.preventDefault();
        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        const trimmedConfirmPassword = confirmPassword.trim();

        const newErrors = {};
        if (!trimmedUsername) {
            newErrors.username = 'Username is required';
        } else if (trimmedUsername.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }
        if (!trimmedEmail) {
            newErrors.email = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            newErrors.email = 'Please enter a valid email address (e.g. user@domain.com)';
        }
        if (!trimmedPassword) {
            newErrors.password = 'Password is required';
        } else if (trimmedPassword.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!trimmedConfirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (trimmedPassword !== trimmedConfirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});
        setIsLoading(true);

        try {
            const result = await register(trimmedUsername, trimmedEmail, trimmedPassword);
            setIsLoading(false);
            if (result.success) {
                showToast(
                    'success',
                    'Account Created!',
                    result.message || 'Welcome to your invoice ledger dashboard.'
                );
                navigate('/');
            } else {
                showToast('error', 'Registration Failed', result.error || 'User creation failed');
            }
        } catch (err) {
            setIsLoading(false);
            showToast('error', 'Registration Error', 'An unexpected error occurred.');
        }
    };
    return (<div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold font-outfit text-white">Create your account</h1>
        <p className="text-sm text-slate-400">
          Get started with our premium invoice ledger dashboard.
        </p>
      </div>

      <form onSubmit={handleRegister} noValidate className="space-y-4 text-slate-300">
        <Input
          label="Username"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (errors.username) setErrors((prev) => ({ ...prev, username: '' }));
          }}
          error={errors.username}
          leftIcon={<User className="h-4 w-4"/>}
          placeholder="admin"
        />

        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
          }}
          error={errors.email}
          leftIcon={<Mail className="h-4 w-4"/>}
          placeholder="admin@yourdomain.com"
        />

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

        <Input
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
          }}
          error={errors.confirmPassword}
          leftIcon={<Lock className="h-4 w-4"/>}
          placeholder="••••••••"
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="focus:outline-hidden hover:text-primary text-slate-400 dark:text-slate-500 cursor-pointer transition-colors p-1"
              tabIndex="-1"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
            </button>
          }
        />

        <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
          Create Account
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:text-blue-400 font-semibold">
          Sign in
        </Link>
      </div>
    </div>);
};

