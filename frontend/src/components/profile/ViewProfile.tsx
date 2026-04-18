function ViewProfile({user, editButton}) {
    return (
        <div className="max-w-7xl mx-auto p-4">
            {/* Header Section */}
            <section className="p-5 mt-5">
                <div className="flex items-start">
                    {/* Profile Picture */}
                    <div className="h-40 w-40 bg-[#CCC5B9] border-2 border-[#eaffb8] ml-5 mt-5 rounded-xl" />

                    {/* User Info */}
                    <div className="ml-8 mt-5">
                        <h1 className="text-3xl font-bold">{user.name}</h1>
                        <div className="mt-4 space-y-2">
                            {/* User Info Fields */}
                            <div>{user.age} • {user.gender} • {user.location}</div>
                        </div>
                        <button
                            onClick={editButton}
                            className={'mt-4 cursor-pointer bg-[#C0FF00] hover:bg-[#eaffb8] px-1 py-1 text-black rounded-xl'}>Update Profile</button>
                    </div>
                </div>
            </section>

            {/* Bio and Interests Section */}
            <div className="flex gap-4 mt-5">
                {/* Biography */}
                <section className="bg-[#403D39] p-5 flex-2 rounded-xl">
                    <h2 className="text-[#C0FF00] text-xl font-semibold mb-2">about_me</h2>
                    <p>{user.bio}</p>
                </section>

                {/* Interests */}
                <section className="bg-[#403D39] p-5 flex-1 rounded-xl">
                    <h2 className="text-[#C0FF00] text-xl font-semibold mb-2">my_stack</h2>
                    <div className="flex flex-wrap gap-2">
                        {user.interests.map((interest) => (
                            <span
                                key={interest}
                                className="px-3 py-1 bg-[#eaffb8] text-sm text-black rounded-xl"
                            >
                {interest}
              </span>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default ViewProfile;