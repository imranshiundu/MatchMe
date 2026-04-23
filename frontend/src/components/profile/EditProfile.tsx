import type {serverAuthResponse} from "../../types/loginFormData";
import {useState} from 'react';

function EditProfile({userDetails, viewChange}) {
    const [error, setError] = useState<string>('');
    const [inputFields, setInputFields] = useState<object>({
        nickname: userDetails.nickname,
        interest: userDetails.interest,
        bio: userDetails.bio,
        age: userDetails.age,
        gender: userDetails.gender,
        lookingFor: userDetails.lookingFor,
        location: userDetails.location
    })

    const handleChange = (field, value) => {
        setInputFields(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:8085/me/editProfile',
                {
                    method: 'PATCH',
                    body: JSON.stringify(inputFields),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization" : `Bearer ${localStorage.getItem('token')}`
                    },
                    credentials: "include"
                })
            if (!response.ok) {
                const error = await response.json() as { message: string };
                throw new Error(error.message || 'Update failed');
            }
            console.log('Save successful');
            viewChange();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred.');
        }
    }
    // TODO add upload pfp
    // TODO style page
    return (
        <>
            <h1 className={'font-bold text-2xl underline decoration-[#eaffb8]'}>Edit Profile</h1>
            <img className="h-40 w-40 bg-[#CCC5B9] border-2 border-[#eaffb8] ml-5 mt-5 rounded-xl" src={`${userDetails.imageUrl}`} />
            <button className={'text-[#eaffb8]'}>[CHANGE_PICTURE]</button>

            <form onSubmit={handleSubmit}>
                <p>full_name</p>
                <input
                    type={"text"}
                    name={'nickname'}
                    value={inputFields.nickname}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    className={'bg-gray-700'}></input>

                <p>age</p>
                <input
                    type={'number'}
                    name={'age'}
                    value={inputFields.age}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    className={'bg-gray-700'}></input>

                <p>gender</p>
                <select
                    name={'gender'}
                    value={inputFields.gender}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    className={'bg-gray-700'}>
                    <option value={'male'}>male</option>
                    <option value={'female'}>female</option>
                    <option value={'other'}>other</option>
                </select>

                <p>location</p>
                <input
                    type={"text"}
                    name={'location'}
                    value={inputFields.location}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    className={'bg-gray-700'}></input>

                <p>user_bio</p>
                <input
                    type={"text"}
                    name={'bio'}
                    value={inputFields.bio}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    className={'bg-gray-700'}></input>

                <p>tech_stack</p>
                <button className={'text-[#eaffb8]'}>[insert_tag]</button>

                <p>Interest tags will go here...</p>
                <button
                    type={'submit'}
                    className={'mt-4 cursor-pointer bg-[#C0FF00] hover:bg-[#eaffb8] px-1 py-1 text-black rounded-xl'}>
                    Save Changes
                </button>
            </form>
            <button onClick={viewChange}
                    className={'mt-4 cursor-pointer bg-[#C0FF00] hover:bg-[#eaffb8] px-1 py-1 text-black rounded-xl'}>
                    Cancel
            </button>
        </>
    )
}

export default EditProfile;