function EditProfile({user, viewChange}) {
    // TODO use user data to prepopulate input field values
    // TODO add change handler
    // TODO add server update
    // TODO style page
    return (
        <>
            <h1 className={'font-bold text-2xl underline decoration-[#eaffb8]'}>Edit Profile</h1>
            <div className="h-35 w-35 bg-[#CCC5B9]"/>
            <button className={'text-[#eaffb8]'}>[CHANGE_PICTURE]</button>
            <p>full_name</p>
            <input type={"text"} className={'bg-gray-700'}></input>
            <p>birth_date</p>
            <input type={"text"} className={'bg-gray-700'}></input>
            <p>gender</p>
            <input type={"text"} className={'bg-gray-700'}></input>
            <p>location</p>
            <input type={"text"} className={'bg-gray-700'}></input>
            <p>user_description</p>
            <input type={"text"} className={'bg-gray-700'}></input>
            <p>tech_stack</p>
            <button className={'text-[#eaffb8]'}>[insert_tag]</button>
            <p>Interest tags will go here...</p>
            <button onClick={viewChange} className={'mt-4 cursor-pointer bg-[#C0FF00] hover:bg-[#eaffb8] px-1 py-1 text-black rounded-xl'}>Cancel</button>
        </>
    )
}

export default EditProfile;