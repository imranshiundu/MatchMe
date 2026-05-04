import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function AccountSettings() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    
    const [emailError, setEmailError] = useState('');
    const [emailSuccess, setEmailSuccess] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [emailPassword, setEmailPassword] = useState('');

    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRepeatPassword, setNewRepeatPassword] = useState('');

    const handleChangeEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError('');
        setEmailSuccess('');
        try {
            const response = await fetch('http://localhost:8085/change-email', {
                method: 'PUT',
                body: JSON.stringify({ newEmail, currentPassword: emailPassword }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const data = await response.json().catch(() => null);
                throw new Error(data?.message || 'Failed to change email');
            }
            setEmailSuccess('Email changed successfully');
            setNewEmail('');
            setEmailPassword('');
        } catch (error) {
            setEmailError(error instanceof Error ? error.message : 'An error occurred');
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        if (newPassword !== newRepeatPassword) {
            setPasswordError('Passwords do not match');
            return;
        }
        try {
            const response = await fetch('http://localhost:8085/change-password', {
                method: 'PUT',
                body: JSON.stringify({ newPassword, newRepeatPassword, oldPassword }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const data = await response.json().catch(() => null);
                throw new Error(data?.message || 'Failed to change password');
            }
            setPasswordSuccess('Password changed successfully');
            setOldPassword('');
            setNewPassword('');
            setNewRepeatPassword('');
        } catch (error) {
            setPasswordError(error instanceof Error ? error.message : 'An error occurred');
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }
        try {
            const response = await fetch('http://localhost:8085/delete', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete account');
            }
            logout();
            navigate('/');
        } catch (error) {
            alert('Failed to delete account');
        }
    };

    return (
        <div className="w-full max-w-2xl mt-6 space-y-6">
            <div className="border-2 border-[#313030] bg-[#1C1B1B] px-10 py-8 rounded-xl">
                <h2 className="text-xl text-[#C0FF00] font-bold mb-4">//account_settings</h2>

                <form onSubmit={handleChangeEmail} className="mb-8 border-b border-[#313030] pb-6">
                    <h3 className="text-[#D8FF80] mb-2 text-sm">//change_email</h3>
                    <div className="flex flex-col gap-3">
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="bg-[#121212] placeholder-[#adaaaa] text-[#C0FF00] p-2 outline-none rounded-md"
                            placeholder="New Email"
                            required
                        />
                        <input
                            type="password"
                            value={emailPassword}
                            onChange={(e) => setEmailPassword(e.target.value)}
                            className="bg-[#121212] placeholder-[#adaaaa] text-[#C0FF00] p-2 outline-none rounded-md"
                            placeholder="Current Password"
                            required
                        />
                        <button type="submit" className="self-end cursor-pointer px-4 py-2 rounded-md bg-[#403D39] text-[#C0FF00] hover:bg-[#6B6562] transition-all">
                            Update Email
                        </button>
                    </div>
                    {emailError && <p className="text-[#ff7351] mt-2 text-sm">{emailError}</p>}
                    {emailSuccess && <p className="text-[#8BBA00] mt-2 text-sm">{emailSuccess}</p>}
                </form>

                <form onSubmit={handleChangePassword} className="mb-8 border-b border-[#313030] pb-6">
                    <h3 className="text-[#D8FF80] mb-2 text-sm">//change_password</h3>
                    <div className="flex flex-col gap-3">
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="bg-[#121212] placeholder-[#adaaaa] text-[#C0FF00] p-2 outline-none rounded-md"
                            placeholder="Current Password"
                            required
                        />
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="bg-[#121212] placeholder-[#adaaaa] text-[#C0FF00] p-2 outline-none rounded-md"
                            placeholder="New Password"
                            required
                        />
                        <input
                            type="password"
                            value={newRepeatPassword}
                            onChange={(e) => setNewRepeatPassword(e.target.value)}
                            className="bg-[#121212] placeholder-[#adaaaa] text-[#C0FF00] p-2 outline-none rounded-md"
                            placeholder="Repeat New Password"
                            required
                        />
                        <button type="submit" className="self-end cursor-pointer px-4 py-2 rounded-md bg-[#403D39] text-[#C0FF00] hover:bg-[#6B6562] transition-all">
                            Update Password
                        </button>
                    </div>
                    {passwordError && <p className="text-[#ff7351] mt-2 text-sm">{passwordError}</p>}
                    {passwordSuccess && <p className="text-[#8BBA00] mt-2 text-sm">{passwordSuccess}</p>}
                </form>

                <div>
                    <h3 className="text-[#ff7351] mb-2 text-sm">//danger_zone</h3>
                    <button 
                        onClick={handleDeleteAccount}
                        type="button" 
                        className="cursor-pointer px-4 py-2 rounded-md bg-[#FF3B30] text-[#1c1b1b] hover:bg-[#E62721] font-bold transition-all w-full"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AccountSettings;
