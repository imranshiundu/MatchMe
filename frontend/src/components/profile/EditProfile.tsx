import { useState, useEffect, useRef } from 'react';
import { useAuth } from "../../hooks/useAuth";
import AccountSettings from "./AccountSettings";
import Icon from '../Icon';

type EditableProfile = {
    nickname: string;
    interest: string[];
    bio: string;
    age: number | null;
    gender: string;
    lookingFor: string[];
    location: string;
    latitude: number | null;
    longitude: number | null;
    radius: number;
    imageUrl: string;
    prompt1?: string;
    answer1?: string;
    prompt2?: string;
    answer2?: string;
    prompt3?: string;
    answer3?: string;
};

type EditProfileFormState = {
    nickname: string;
    interest: string[];
    bio: string;
    age: number | '';
    gender: string;
    lookingFor: string[];
    location: string;
    latitude: number | null;
    longitude: number | null;
    radius: number;
    prompt1: string;
    answer1: string;
    prompt2: string;
    answer2: string;
    prompt3: string;
    answer3: string;
};

type EditProfileProps = {
    userDetails: EditableProfile;
    viewChange: () => void;
    needsRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

function EditProfile({ userDetails, viewChange, needsRefresh }: EditProfileProps) {
    const { token } = useAuth();
    const [error, setError] = useState<string>('');
    const [activeSection, setActiveSection] = useState<'basics' | 'prompts' | 'stack' | 'account'>('basics');

    const [inputFields, setInputFields] = useState<EditProfileFormState>({
        nickname: userDetails.nickname,
        interest: userDetails.interest,
        bio: userDetails.bio,
        age: userDetails.age ?? '',
        gender: userDetails.gender,
        lookingFor: userDetails.lookingFor,
        location: userDetails.location,
        latitude: userDetails.latitude ?? null,
        longitude: userDetails.longitude ?? null,
        radius: userDetails.radius ?? 50,
        prompt1: userDetails.prompt1 ?? '',
        answer1: userDetails.answer1 ?? '',
        prompt2: userDetails.prompt2 ?? '',
        answer2: userDetails.answer2 ?? '',
        prompt3: userDetails.prompt3 ?? '',
        answer3: userDetails.answer3 ?? ''
    });

    const interestsList = ['Full-Stack', 'Front-End', 'Back-End', 'Cyber-Security', 'Vibe Coding', 'Open Source', 'Linux', 'React', 'Node.js', 'Python', 'Rust', 'TypeScript'];
    const toggleInterests = (interest: string) => {
        const newInterests = inputFields.interest.includes(interest) 
            ? inputFields.interest.filter(item => item !== interest) 
            : [...inputFields.interest, interest];
        handleChange('interest', newInterests);
    };

    const lookingForList = ['Co-Founder', 'Pair-Programmer', 'Reviewer', 'Teammate', 'Friend'];
    const toggleLookingFor = (looking: string) => {
        const newLookingFors = inputFields.lookingFor.includes(looking) 
            ? inputFields.lookingFor.filter(item => item !== looking) 
            : [...inputFields.lookingFor, looking];
        handleChange('lookingFor', newLookingFors);
    };

    const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
    const [removeProfilePicture, setRemoveProfilePicture] = useState<boolean>(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setNewProfilePicture(file);
    };

    useEffect(() => {
        return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
    }, [previewUrl]);

    const handleFileRemoval = () => {
        setPreviewUrl("https://res.cloudinary.com/ddvukican/image/upload/v1775725641/default-profile-image.jpg");
        setRemoveProfilePicture(true);
    };

    const handleChange = <K extends keyof EditProfileFormState>(field: K, value: EditProfileFormState[K]) => {
        setInputFields(prev => ({ ...prev, [field]: value }));
    };

    const fetchCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                handleChange('latitude', latitude);
                handleChange('longitude', longitude);
                setError("");
            },
            (err) => setError(`Failed to get location: ${err.message}`)
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8085/me/editProfile', {
                method: 'PATCH',
                body: JSON.stringify({ ...inputFields, age: inputFields.age === '' ? null : inputFields.age }),
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Update failed');
            
            if (newProfilePicture) {
                const formData = new FormData();
                formData.append('file', newProfilePicture);
                await fetch('http://localhost:8085/profile/upload-image', {
                    method: "POST",
                    body: formData,
                    headers: { "Authorization": `Bearer ${token}` }
                });
            }

            if (removeProfilePicture) {
                await fetch('http://localhost:8085/profile/remove-image', {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
            }
            needsRefresh(true);
            viewChange();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred.');
        }
    };

    return (
        <div className="max-w-5xl mx-auto w-full px-4 py-8 flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 flex-shrink-0">
                <div className="bg-[#1C1B1B] border-2 border-[#313030] rounded-2xl p-4 sticky top-24 shadow-2xl">
                    <h2 className="text-white text-xs font-black uppercase tracking-widest mb-6 px-2 opacity-50">Settings</h2>
                    <div className="flex flex-col gap-1">
                        <button 
                            onClick={() => setActiveSection('basics')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === 'basics' ? 'bg-[#C0FF00] text-[#121212]' : 'text-[#adaaaa] hover:bg-[#252422] hover:text-white'}`}
                        >
                            <Icon name="profile-icon" size={18} /> Profile Basics
                        </button>
                        <button 
                            onClick={() => setActiveSection('prompts')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === 'prompts' ? 'bg-[#C0FF00] text-[#121212]' : 'text-[#adaaaa] hover:bg-[#252422] hover:text-white'}`}
                        >
                            <Icon name="message-icon" size={18} /> Social Prompts
                        </button>
                        <button 
                            onClick={() => setActiveSection('stack')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === 'stack' ? 'bg-[#C0FF00] text-[#121212]' : 'text-[#adaaaa] hover:bg-[#252422] hover:text-white'}`}
                        >
                            <Icon name="network-icon" size={18} /> Tech Stack
                        </button>
                        <button 
                            onClick={() => setActiveSection('account')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === 'account' ? 'bg-[#C0FF00] text-[#121212]' : 'text-[#adaaaa] hover:bg-[#252422] hover:text-white'}`}
                        >
                            <Icon name="lock-icon" size={18} /> Account Security
                        </button>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-[#313030]">
                        <button onClick={viewChange} className="w-full py-3 bg-[#313030] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#3a3939] transition-all">
                            Back to Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
                {activeSection === 'account' ? (
                    <AccountSettings />
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Section Header */}
                        <div className="bg-[#1C1B1B] border-2 border-[#313030] rounded-2xl p-8 shadow-2xl overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#C0FF00]" />
                            
                            {activeSection === 'basics' && (
                                <div className="space-y-8">
                                    <div className="flex flex-col md:flex-row items-center gap-8 border-b border-[#313030] pb-8">
                                        <div className="relative group">
                                            <img
                                                className="h-32 w-32 rounded-3xl object-cover border-4 border-[#313030] group-hover:border-[#C0FF00] transition-all shadow-xl"
                                                src={previewUrl ?? userDetails.imageUrl}
                                                alt="Profile"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute inset-0 bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-[#C0FF00] text-xs font-bold transition-opacity"
                                            >
                                                Change
                                            </button>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <h3 className="text-xl font-bold text-white">Profile Identity</h3>
                                            <p className="text-[#adaaaa] text-sm max-w-sm">This is how other developers will see you in the grid.</p>
                                            <div className="flex gap-2 mt-2">
                                                <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-[#C0FF00] text-[#121212] rounded-lg text-xs font-bold hover:bg-[#D8FF80] transition-all">Upload New</button>
                                                <button type="button" onClick={handleFileRemoval} className="px-4 py-2 bg-[#313030] text-[#adaaaa] rounded-lg text-xs font-bold hover:text-white transition-all">Remove</button>
                                            </div>
                                            <input type="file" accept="image/*" onChange={handleFileUpload} ref={fileInputRef} className="hidden" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[#C0FF00]">Full Name / Nickname</label>
                                            <input
                                                type="text"
                                                value={inputFields.nickname}
                                                onChange={(e) => handleChange('nickname', e.target.value)}
                                                className="w-full bg-[#121212] border-2 border-[#313030] rounded-xl p-3 text-white focus:border-[#C0FF00] outline-none transition-all"
                                                placeholder="e.g. Alex Dev"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[#C0FF00]">Age</label>
                                            <input
                                                type="number"
                                                value={inputFields.age}
                                                onChange={(e) => handleChange('age', e.target.value === '' ? '' : Number(e.target.value))}
                                                className="w-full bg-[#121212] border-2 border-[#313030] rounded-xl p-3 text-white focus:border-[#C0FF00] outline-none transition-all"
                                                placeholder="25"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[#C0FF00]">Gender Identity</label>
                                            <select
                                                value={inputFields.gender}
                                                onChange={(e) => handleChange('gender', e.target.value)}
                                                className="w-full bg-[#121212] border-2 border-[#313030] rounded-xl p-3 text-white focus:border-[#C0FF00] outline-none transition-all appearance-none"
                                            >
                                                <option value="" disabled>Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other / Private</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[#C0FF00]">Location</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={inputFields.location}
                                                    onChange={(e) => handleChange('location', e.target.value)}
                                                    className="w-full bg-[#121212] border-2 border-[#313030] rounded-xl p-3 pr-12 text-white focus:border-[#C0FF00] outline-none transition-all"
                                                    placeholder="San Francisco, CA"
                                                />
                                                <button type="button" onClick={fetchCurrentLocation} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C0FF00] hover:scale-110 transition-all">
                                                    <Icon name="location-icon" size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-[#C0FF00]">Match Radius ({inputFields.radius} km)</label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="500"
                                            value={inputFields.radius}
                                            onChange={(e) => handleChange('radius', Number(e.target.value))}
                                            className="w-full accent-[#C0FF00] h-2 bg-[#313030] rounded-lg appearance-none cursor-pointer mt-4"
                                        />
                                        <div className="flex justify-between text-[10px] text-[#5a6a6a] font-mono mt-2">
                                            <span>1 KM</span>
                                            <span>500 KM</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-[#C0FF00]">Professional Bio</label>
                                        <textarea
                                            value={inputFields.bio}
                                            onChange={(e) => handleChange('bio', e.target.value)}
                                            rows={4}
                                            className="w-full bg-[#121212] border-2 border-[#313030] rounded-xl p-4 text-white focus:border-[#C0FF00] outline-none transition-all resize-none"
                                            placeholder="Tell the community about what you're building..."
                                        />
                                    </div>
                                </div>
                            )}

                            {activeSection === 'prompts' && (
                                <div className="space-y-8">
                                    <div className="border-b border-[#313030] pb-6">
                                        <h3 className="text-xl font-bold text-white mb-2">Social Prompts</h3>
                                        <p className="text-[#adaaaa] text-sm">Answers to these prompts appear on your profile to help start conversations.</p>
                                    </div>

                                    {[1, 2, 3].map((num) => (
                                        <div key={num} className="space-y-3 p-6 bg-[#121212] rounded-2xl border border-[#313030]">
                                            <label className="text-xs font-black uppercase tracking-widest text-[#C0FF00]">Prompt #{num}</label>
                                            <select
                                                value={inputFields[`prompt${num}` as keyof EditProfileFormState]}
                                                onChange={(e) => handleChange(`prompt${num}` as any, e.target.value)}
                                                className="w-full bg-[#1C1B1B] border-2 border-[#313030] rounded-xl p-3 text-white focus:border-[#C0FF00] outline-none transition-all"
                                            >
                                                <option value="">Choose a prompt...</option>
                                                <option value="A tech hot take:">A tech hot take:</option>
                                                <option value="My ideal hackathon project:">My ideal hackathon project:</option>
                                                <option value="Tabs or spaces?">Tabs or spaces?</option>
                                                <option value="My favorite dev tool:">My favorite dev tool:</option>
                                                <option value="When I'm not coding, I am:">When I'm not coding, I am:</option>
                                                <option value="I geek out on:">I geek out on:</option>
                                            </select>
                                            <input
                                                type="text"
                                                value={inputFields[`answer${num}` as keyof EditProfileFormState]}
                                                onChange={(e) => handleChange(`answer${num}` as any, e.target.value)}
                                                className="w-full bg-[#1C1B1B] border-2 border-[#313030] rounded-xl p-3 text-white focus:border-[#C0FF00] outline-none transition-all"
                                                placeholder="Your answer..."
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeSection === 'stack' && (
                                <div className="space-y-10">
                                    <div className="border-b border-[#313030] pb-6">
                                        <h3 className="text-xl font-bold text-white mb-2">Capabilities & Needs</h3>
                                        <p className="text-[#adaaaa] text-sm">Define your stack and what you're looking for in a collaborator.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-[#C0FF00]">Primary Tech Stack</label>
                                        <div className="flex flex-wrap gap-2">
                                            {interestsList.map((tag) => (
                                                <button
                                                    type="button"
                                                    key={tag}
                                                    onClick={() => toggleInterests(tag)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${inputFields.interest.includes(tag) ? 'bg-[#C0FF00] border-[#C0FF00] text-[#121212]' : 'bg-transparent border-[#313030] text-[#adaaaa] hover:border-[#adaaaa]'}`}
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-[#C0FF00]">Looking For</label>
                                        <div className="flex flex-wrap gap-2">
                                            {lookingForList.map((tag) => (
                                                <button
                                                    type="button"
                                                    key={tag}
                                                    onClick={() => toggleLookingFor(tag)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${inputFields.lookingFor.includes(tag) ? 'bg-[#C0FF00] border-[#C0FF00] text-[#121212]' : 'bg-transparent border-[#313030] text-[#adaaaa] hover:border-[#adaaaa]'}`}
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="mt-8 p-4 bg-[#3a1f1f] border border-[#ff7351] rounded-xl text-[#ff7351] text-xs font-bold flex items-center gap-3">
                                    <span>⚠️</span> {error}
                                </div>
                            )}

                            <div className="mt-12 flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#C0FF00] text-[#121212] py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#D8FF80] transition-all shadow-xl active:scale-[0.98]"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={viewChange}
                                    className="px-8 bg-[#313030] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#3a3939] transition-all active:scale-[0.98]"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default EditProfile;
