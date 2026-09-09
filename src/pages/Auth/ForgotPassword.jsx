import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail } from 'lucide-react';
export const ForgotPassword = () => {
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            setError('Email address is required');
            return;
        }
        else if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Invalid email address');
            return;
        }
        setError('');
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            showToast('success', 'Reset Link Dispatched', `A simulated reset link was sent to ${email}`);
        }, 1000);
    };
    return (<div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold font-outfit text-white">Reset password</h1>
        <p className="text-sm text-slate-400">
          Enter your email below and we will dispatch a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-slate-300">
        <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} leftIcon={<Mail className="h-4 w-4"/>} placeholder="support@ultrakeyit.com"/>

        <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
          Send Reset Link
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500">
        Return to{' '}
        <Link to="/login" className="text-primary hover:text-blue-400 font-semibold">
          Sign in
        </Link>
      </div>
    </div>);
};
