import {useState, useEffect, useRef} from 'react';
import {useAuth} from "../../hooks/useAuth";
import AccountSettings from "./AccountSettings";

type EditableProfile = {
    nickname: string;
    interest: string[];
    bio: string;
    age: number | null;
    gender: string;
    lookingFor: string[];
    location: string;
    imageUrl: string;
};

type EditProfileFormState = {
    nickname: string;
    interest: string[];
    bio: string;
    age: number | '';
    gender: string;
    lookingFor: string[];
    location: string;
};

type EditProfileProps = {
    userDetails: EditableProfile;
    viewChange: () => void;
    needsRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

function EditProfile({ userDetails, viewChange, needsRefresh }: EditProfileProps) {
    const {token} = useAuth();
    const [error, setError] = useState<string>('');

    const [inputFields, setInputFields] = useState<EditProfileFormState>({
        nickname: userDetails.nickname,
        interest: userDetails.interest,
        bio: userDetails.bio,
        age: userDetails.age ?? '',
        gender: userDetails.gender,
        lookingFor: userDetails.lookingFor,
        location: userDetails.location
    });

    const interestsList = ['Full-Stack', 'Front-End', 'Back-End', 'Cyber-Security', 'Vibe Coding', 'Open Source', 'Linux'];
    const [selectedInterests, setSelectedInterests] = useState<string[]>(userDetails.interest);
    const toggleInterests = (interest: string) => {
        const newInterests = selectedInterests.includes(interest) ? selectedInterests.filter(item => item !== interest) : [...selectedInterests, interest];
        setSelectedInterests(newInterests);
        handleChange('interest', newInterests);
    };

    const lookingForList = ['Co-Founder', 'Pair-Programmer', 'Reviewer', 'Teammate'];
    const [selectedLookingFor, setSelectedLookingFor] = useState<string[]>(userDetails.lookingFor);
    const toggleLookingFor = (looking: string) => {
        const newLookingFors = selectedLookingFor.includes(looking) ? selectedLookingFor.filter(item => item !== looking) : [...selectedLookingFor, looking];
        setSelectedLookingFor(newLookingFors);
        handleChange('lookingFor', newLookingFors);
    };

    const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
    const [removeProfilePicture, setRemoveProfilePicture] = useState<boolean>(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setNewProfilePicture(file);
    };

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileRemoval = () => {
        setPreviewUrl("https://res.cloudinary.com/ddvukican/image/upload/v1775725641/default-profile-image.jpg");
        setRemoveProfilePicture(true);
    };


    const handleChange = <K extends keyof EditProfileFormState>(field: K, value: EditProfileFormState[K]) => {
        setInputFields(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8085/me/editProfile',
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        ...inputFields,
                        age: inputFields.age === '' ? null : inputFields.age
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    credentials: "include"
                })
            if (!response.ok) {
                const error = await response.json() as { message: string };
                throw new Error(error.message || 'Update failed');
            }
            if (newProfilePicture) {
                const formData = new FormData();
                formData.append('file', newProfilePicture);
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

            if (removeProfilePicture) {
                const removePicture = await fetch('http://localhost:8085/profile/remove-image',
                    {
                        method: "DELETE",
                        headers: {"Authorization": `Bearer ${token}`}
                    });
                if (!removePicture.ok) {
                    const error = await response.json() as { message: string };
                    throw new Error(error.message || 'Image removal failed');
                }
            }
            console.log('Save successful');
            needsRefresh(true);
            viewChange();

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred.');
        }
    };

    return (
        <div className="grid place-items-center p-4">
            <div className="border-2 border-[#313030] bg-[#1C1B1B] w-full max-w-2xl px-10 py-8 rounded-xl">
                <h1 className="text-2xl py-2 text-[#C0FF00] font-bold text-center">EDIT_PROFILE</h1>
                <p className="bg-[#403d39] border-1 border-[#F5F867] rounded-lg text-sm p-2 text-[#F5F867] text-center">
                    //Matching algorithm requires complete profile data
                </p>
                <div className="flex flex-col items-center">
                    <img
                        className="h-50 w-50 bg-[#CCC5B9] rounded-xl mt-4"
                        src={previewUrl ?? userDetails.imageUrl}
                        alt="Profile"
                    />
                    <div className={'flex gap-3'}>
                        <button
                            type="button"
                            onClick={() => handleFileRemoval()}
                            className="mt-4 cursor-pointer px-4 py-2 rounded-md bg-[#403D39] text-[#121212] hover:bg-[#313030] hover:text-[#1c1b1b] transition-all"
                        >
                            remove
                        </button>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-4 cursor-pointer px-4 py-2 rounded-md bg-[#C0FF00] text-[#141F00] hover:bg-[#D8FF80] hover:text-[#384E00] transition-all"
                        >
                            upload
                        </button>
                    </div>
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
                        onChange={(e) => handleChange('nickname', e.target.value)}
                        className="bg-[#121212] placeholder-[#adaaaa] text-[#C0FF00] p-2 outline-none rounded-md"
                        placeholder="e.g. John Doe"
                    />

                    <p className="text-[#adaaaa] mt-2">//enter <span className="text-[#D8FF80]">age</span></p>
                    <input
                        type="number"
                        name="age"
                        value={inputFields.age}
                        onChange={(e) => handleChange('age', e.target.value === '' ? '' : Number(e.target.value))}
                        className="bg-[#121212] placeholder-[#adaaaa] text-[#C0FF00] p-2 outline-none rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="e.g. 25"
                    />

                    <p className="text-[#adaaaa] mt-2">//select <span className="text-[#D8FF80]">gender</span></p>
                    <select
                        name="gender"
                        value={inputFields.gender ?? ""}
                        onChange={(e) => handleChange('gender', e.target.value)}
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
                        onChange={(e) => handleChange('location', e.target.value)}
                        className="bg-[#121212] placeholder-[#adaaaa] text-[#C0FF00] p-2 outline-none rounded-md"
                        placeholder="e.g. Tallinn"
                    />

                    <p className="text-[#adaaaa] mt-2">//enter <span className="text-[#D8FF80]">user_bio</span></p>
                    <textarea
                        name="bio"
                        value={inputFields.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
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
                                className={`cursor-pointer px-3 py-1 rounded-xl text-sm text-black transition-colors ${
                                    selectedInterests.includes(interest) ? "bg-[#C0FF00] text-[#141F00] hover:bg-[#D8FF80] hover:text-[#384E00] transition-all" : "bg-[#403D39] text-[#121212] hover:bg-[#6B6562] hover:text-[#1c1b1b] transition-all"
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
                                className={`cursor-pointer px-3 py-1 rounded-xl text-sm text-black transition-colors ${
                                    selectedLookingFor.includes(looking) ? "bg-[#C0FF00] text-[#141F00] hover:bg-[#D8FF80] hover:text-[#384E00] transition-all" : "bg-[#403D39] text-[#121212] hover:bg-[#6B6562] hover:text-[#1c1b1b] transition-all"
                                }`}
                            >
                                {looking}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            type="button"
                            onClick={viewChange}
                            className="flex-1 cursor-pointer p-2 rounded-md bg-[#403D39] text-[#121212] hover:bg-[#313030] hover:text-[#1c1b1b] transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 cursor-pointer p-2 rounded-md bg-[#C0FF00] text-[#141F00] hover:bg-[#D8FF80] hover:text-[#384E00] transition-all"
                        >
                            Save Changes
                        </button>
                    </div>
                    {error && <p className={'bg-[#121212] text-[#ff7351] border-1 p-2 rounded-sm mt-5'}>
                        {error}</p>}
                </form>
            </div>
            <AccountSettings />
        </div>
    );
}

export default EditProfile;
