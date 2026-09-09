import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
export const Register = () => {
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
    const handleRegister = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!username)
            newErrors.username = 'Username is required';
        if (!email) {
            newErrors.email = 'Email address is required';
        }
        else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Invalid email address';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        }
        else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});
        setIsLoading(true);
        const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
        fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
            credentials: 'include'
        })
            .then((res) => {
            setIsLoading(false);
            if (res.ok) {
                showToast('success', 'Account Created!', 'Please sign in with your new credentials');
                navigate('/login');
            }
            else {
                res.json().then((data) => {
                    showToast('error', 'Registration Failed', data.error || 'User creation failed');
                });
            }
        })
            .catch((err) => {
            setIsLoading(false);
            showToast('error', 'Connection Error', 'Could not reach server.');
        });
    };
    return (<div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold font-outfit text-white">Create your account</h1>
        <p className="text-sm text-slate-400">
          Get started with our premium invoice ledger simulation dashboard.
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4 text-slate-300">
        <Input label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} error={errors.username} leftIcon={<User className="h-4 w-4"/>} placeholder="admin"/>

        <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} leftIcon={<Mail className="h-4 w-4"/>} placeholder="admin@yourdomain.com"/>

        <Input label="Password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} leftIcon={<Lock className="h-4 w-4"/>} placeholder="••••••••" rightIcon={<button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-hidden hover:text-primary text-slate-400 dark:text-slate-500 cursor-pointer transition-colors p-1" tabIndex="-1">
              {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
            </button>}/>

        <Input label="Confirm Password" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={errors.confirmPassword} leftIcon={<Lock className="h-4 w-4"/>} placeholder="••••••••" rightIcon={<button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="focus:outline-hidden hover:text-primary text-slate-400 dark:text-slate-500 cursor-pointer transition-colors p-1" tabIndex="-1">
              {showConfirmPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
            </button>}/>

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
