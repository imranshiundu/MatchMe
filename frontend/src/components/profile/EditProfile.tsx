import type {serverAuthResponse} from "../../types/loginFormData";
import {useState, useEffect, useRef} from 'react';
import {useAuth} from "../../hooks/useAuth";

function EditProfile({userDetails, viewChange}) {
    const { token } = useAuth();
    // Error message
    const [error, setError] = useState<string>('');

    // Input field logic
    const [inputFields, setInputFields] = useState<object>({
        nickname: userDetails.nickname,
        interest: userDetails.interest,
        bio: userDetails.bio,
        age: userDetails.age,
        gender: userDetails.gender,
        lookingFor: userDetails.lookingFor,
        location: userDetails.location
    })

    // List & logic for interests
    const interestsList = ['Full-Stack', 'Front-End', 'Back-End', 'Cyber-Security', 'Vibe Coding', 'Open Source', 'Linux'];
    const [selectedInterests, setSelectedInterests] = useState<string[]>(userDetails.interest);
    const toggleInterests = (interest:string) => {
        const newInterests = selectedInterests.includes(interest) ? selectedInterests.filter(item => item !== interest) : [...selectedInterests, interest];
        setSelectedInterests(newInterests);
        handleChange('interest', newInterests);
    };

    // List & logic for "looking for"
    const lookingForList = ['Co-Founder', 'Pair-Programmer', 'Reviewer', 'Teammate'];
    const [selectedLookingFor, setSelectedLookingFor] = useState<string[]>(userDetails.lookingFor);
    const toggleLookingFor = (looking:string) => {
        const newLookingFors = selectedLookingFor.includes(looking) ? selectedLookingFor.filter(item => item !== looking) : [...selectedLookingFor, looking]
        setSelectedLookingFor(newLookingFors);
        handleChange('lookingFor', newLookingFors);
    };

    // Profile picture logic
    const [newProfilePicture, setNewProfilePicture] = useState(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // revoke previous preview URL if exists
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setNewProfilePicture(file);
    }

    // cleanup object URL on unmount
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        }
    }, [previewUrl])


    const handleChange = (field, value) => {
        setInputFields(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async (e: FormDataEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:8085/me/editProfile',
                {
                    method: 'PATCH',
                    body: JSON.stringify(inputFields),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization" : `Bearer ${token}`
                    },
                    credentials: "include"
                })
            if (!response.ok) {
                const error = await response.json() as { message: string };
                throw new Error(error.message || 'Update failed');
            }
            // uploads photo if new one was selected
            if (newProfilePicture) {
                const formData = new FormData();
                formData.append('file', newProfilePicture)
                const uploadResponse = await fetch('http://localhost:8085/profile/upload-image',
                    {
                        method: "POST",
                        body: formData,
                        headers: {"Authorization": `Bearer ${token}`},
                        credentials: "include"
                    })
                if (!uploadResponse.ok) {
                    const error = await response.json() as { message: string };
                    throw new Error(error.message || 'Image upload failed');
            }
        }
            console.log('Save successful');
            viewChange();

        }   catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred.');
        }
    }

    return (
        <div className="grid place-items-center p-4">
            <div className="bg-[#1C1B1B] w-full max-w-2xl px-10 py-8 rounded-xl">
                <h1 className="text-2xl py-2 text-[#D8FF80] font-bold text-center">Edit Profile</h1>

                <div className="flex flex-col items-center">
                    <img
                        className="h-40 w-40 bg-[#CCC5B9] border-2 border-[#eaffb8] rounded-xl mt-4"
                        src={previewUrl ?? userDetails.imageUrl}
                        alt="Profile"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-4 cursor-pointer bg-[#403D39] text-[#C0FF00] px-4 py-2 rounded-md hover:bg-[#6B6562] transition-all"
                    >
                        upload picture
                    </button>
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleFileUpload}
                        ref={fileInputRef}
                        className="hidden"
                    />
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col w-full gap-3 mt-6">
                    <p className="text-[#adaaaa]">//enter <span className="text-[#D8FF80]">full_name</span></p>
                    <input
                        type="text"
                        name="nickname"
                        value={inputFields.nickname}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        className="bg-[#121212] placeholder-[#adaaaa] text-[#C0FF00] p-2 outline-none rounded-md"
                        placeholder="e.g. John Doe"
                    />

                    <p className="text-[#adaaaa] mt-2">//enter <span className="text-[#D8FF80]">age</span></p>
                    <input
                        type="number"
                        name="age"
                        value={inputFields.age}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        className="bg-[#121212] placeholder-[#adaaaa] text-[#C0FF00] p-2 outline-none rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="e.g. 25"
                    />

                    <p className="text-[#adaaaa] mt-2">//select <span className="text-[#D8FF80]">gender</span></p>
                    <select
                        name="gender"
                        value={inputFields.gender ?? ""}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        className="bg-[#121212] text-[#C0FF00] p-2 outline-none rounded-md"
                    >
                        <option value="" disabled>Please select gender</option>
                        <option value="male">male</option>
                        <option value="female">female</option>
                        <option value="other">other</option>
                    </select>

                    <p className="text-[#adaaaa] mt-2">//enter <span className="text-[#D8FF80]">location</span></p>
                    <input
                        type="text"
                        name="location"
                        value={inputFields.location}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        className="bg-[#121212] placeholder-[#adaaaa] text-[#C0FF00] p-2 outline-none rounded-md"
                        placeholder="e.g. Tallinn"
                    />

                    <p className="text-[#adaaaa] mt-2">//enter <span className="text-[#D8FF80]">user_bio</span></p>
                    <textarea
                        type="text"
                        name="bio"
                        value={inputFields.bio}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        className="bg-[#121212] placeholder-[#adaaaa] text-[#C0FF00] p-2 outline-none rounded-md resize-y"
                        placeholder="e.g. Software developer..."
                    />

                    <p className="text-[#adaaaa] mt-2">//select <span className="text-[#D8FF80]">tech_stack</span></p>
                    <div className="flex flex-wrap gap-2">
                        {interestsList.map((interest) => (
                            <button
                                type="button"
                                key={interest}
                                onClick={() => toggleInterests(interest)}
                                className={`px-3 py-1 rounded-xl text-sm text-black transition-colors ${
                                    selectedInterests.includes(interest) ? "bg-[#C0FF00]" : "bg-[#403D39]"
                                }`}
                            >
                                {interest}
                            </button>
                        ))}
                    </div>

                    <p className="text-[#adaaaa] mt-2">//select <span className="text-[#D8FF80]">looking_for</span></p>
                    <div className="flex flex-wrap gap-2">
                        {lookingForList.map((looking) => (
                            <button
                                type="button"
                                key={looking}
                                onClick={() => toggleLookingFor(looking)}
                                className={`px-3 py-1 rounded-xl text-sm text-black transition-colors ${
                                    selectedLookingFor.includes(looking) ? "bg-[#C0FF00]" : "bg-[#403D39]"
                                }`}
                            >
                                {looking}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            type="submit"
                            className="flex-1 cursor-pointer bg-[#C0FF00] text-[#121212] p-2 rounded-md hover:bg-[#D8FF80] hover:text-[#1c1b1b] transition-all"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={viewChange}
                            className="flex-1 cursor-pointer bg-[#403D39] text-[#C0FF00] p-2 rounded-md hover:bg-[#6B6562] transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                    {error && <p className={'bg-[#121212] text-[#ff7351] border-1 p-2 rounded-sm mt-5'}>
                        {error}</p>}
                </form>
            </div>
        </div>
    )
}

export default EditProfile;