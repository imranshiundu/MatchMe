function ViewProfile({user, editButton}) {
    return (
        <div className="p-4">
            <div className="max-w-4xl mx-auto bg-[#1C1B1B] rounded-xl p-8">
                {/* Header Section */}
                <div className="flex items-start">
                    {/* Profile Picture */}
                    <img
                        className="h-40 w-40 bg-[#CCC5B9] border-2 border-[#eaffb8] rounded-xl"
                        src={`${user.imageUrl}`}
                        alt="Profile"
                    />

                    {/* User Info */}
                    <div className="ml-8 mt-2">
                        <h1 className="text-3xl font-bold">{user.nickname}</h1>
                        <div className="mt-2 text-[#adaaaa]">
                            {user.age} • {user.gender} • {user.location}
                        </div>
                        <button
                            onClick={editButton}
                            className="mt-4 cursor-pointer bg-[#C0FF00] hover:bg-[#eaffb8] px-4 py-2 text-black rounded-md transition-all"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Tech Stack and Looking For Section */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tech Stack */}
                    <section className="bg-[#121212] p-5 rounded-xl">
                        <h2 className="text-[#C0FF00] text-xl font-semibold mb-3">//my_stack</h2>
                        <div className="flex flex-wrap gap-2">
                            {user.interest?.map((interest) => (
                                <span
                                    key={interest}
                                    className="px-3 py-1 bg-[#C0FF00] text-sm text-black rounded-xl"
                                >
                {interest}
              </span>
                            ))}
                        </div>
                    </section>

                    {/* Looking For */}
                    <section className="bg-[#121212] p-5 rounded-xl">
                        <h2 className="text-[#C0FF00] text-xl font-semibold mb-3">//looking_for</h2>
                        <div className="flex flex-wrap gap-2">
                            {user.lookingFor?.map((looking) => (
                                <span
                                    key={looking}
                                    className="px-3 py-1 bg-[#C0FF00] text-sm text-black rounded-xl"
                                >
                {looking}
              </span>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Bio Section */}
                <section className="bg-[#121212] p-5 rounded-xl mt-6">
                    <h2 className="text-[#C0FF00] text-xl font-semibold mb-3">//about_me</h2>
                    <p>{user.bio}</p>
                </section>
            </div>
        </div>
    )
}

export default ViewProfile;