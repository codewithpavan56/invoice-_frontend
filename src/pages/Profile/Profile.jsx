import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User, Mail, Monitor, BellRing, Sparkles } from 'lucide-react';
export const Profile = () => {
    const { userProfile, updateUserProfile } = useApp();
    const { showToast } = useToast();
    const [fullName, setFullName] = useState(userProfile.fullName);
    const [username, setUsername] = useState(userProfile.username);
    const [email, setEmail] = useState(userProfile.email);
    const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl);
    // notification toggles
    const [emailNotif, setEmailNotif] = useState(userProfile.notifications.email);
    const [pushNotif, setPushNotif] = useState(userProfile.notifications.push);
    const [themePref, setThemePref] = useState(userProfile.visualPreference);
    const [isLoading, setIsLoading] = useState(false);
    const handleSave = (e) => {
        e.preventDefault();
        if (!fullName || !email) {
            showToast('error', 'Validation Error', 'Full Name and Email address are required.');
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            updateUserProfile({
                fullName,
                username,
                email,
                avatarUrl,
                notifications: {
                    email: emailNotif,
                    push: pushNotif
                },
                visualPreference: themePref
            });
            showToast('success', 'Profile Updated', 'Your profile options have been modified.');
        }, 600);
    };
    return (<div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold font-outfit tracking-tight">Personal Profile Settings</h1>
        <p className="text-sm text-slate-500 font-sans">Modify personal notifications, login keys, and visual ledger settings.</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left Avatar Card */}
        <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm text-center space-y-4">
          <div className="relative inline-block mx-auto">
            {avatarUrl ? (<img src={avatarUrl} alt={fullName} className="h-28 w-28 rounded-full object-cover border-2 border-primary mx-auto"/>) : (<div className="h-28 w-28 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold border-2 border-primary mx-auto">
                {(fullName || username || 'A').slice(0, 2).toUpperCase()}
              </div>)}
            <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold" title="Status Online">
              ✓
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{fullName}</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">{userProfile.email || 'Administrator'}</p>
          </div>
          
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-col gap-1 items-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Ledger Role</span>
            <span className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-primary dark:text-blue-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
              ADMINISTRATOR
            </span>
          </div>
        </div>

        {/* Right Info panels */}
        <div className="md:col-span-2 space-y-6">
          {/* Main Account details */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold font-outfit border-b pb-2 flex items-center gap-1.5">
              <User className="h-4.5 w-4.5 text-primary"/> Login Credentials
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Full Name *" value={fullName} onChange={(e) => setFullName(e.target.value)} leftIcon={<User className="h-4 w-4"/>}/>
              <Input label="Console Username" value={username} onChange={(e) => setUsername(e.target.value)} leftIcon={<User className="h-4 w-4"/>}/>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Email Address *" value={email} onChange={(e) => setEmail(e.target.value)} leftIcon={<Mail className="h-4 w-4"/>}/>
              <Input label="Avatar Image Link URL" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://images.unsplash.com..."/>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold font-outfit border-b pb-2 flex items-center gap-1.5">
              <Monitor className="h-4.5 w-4.5 text-accent"/> UI Visual Preferences
            </h3>

            {/* Dark Mode toggle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Console Display Theme</label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                  <input type="radio" checked={themePref === 'light'} onChange={() => setThemePref('light')} className="text-primary"/>
                  Light Mode Visuals
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                  <input type="radio" checked={themePref === 'dark'} onChange={() => setThemePref('dark')} className="text-primary"/>
                  Dark Mode Premium Visuals
                </label>
              </div>
            </div>

            {/* Notifications switches */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-400 flex items-center gap-1">
                <BellRing className="h-4 w-4 text-slate-400"/> Notifications Channels
              </h4>
              <div className="space-y-2 text-xs font-semibold">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} className="rounded text-primary focus:ring-primary"/>
                  Dispatched outbox notification emails on invoice activities
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={pushNotif} onChange={(e) => setPushNotif(e.target.checked)} className="rounded text-primary focus:ring-primary"/>
                  Enable web notification push drawer tray alerts
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" isLoading={isLoading} leftIcon={<Sparkles className="h-4 w-4"/>}>
              Save Profile Options
            </Button>
          </div>
        </div>

      </form>
    </div>);
};
