function ViewProfile({
                         user,
                         buttonHandler,
                         buttonText,
                         showAllDetails,
                         userID,
                     }: {
    user: any;
    buttonHandler: (e: React.MouseEvent<HTMLButtonElement>) => void;
    buttonText: string;
    showAllDetails: boolean;
    userID?: string | number; // Optional
}) {
    console.log(user);
    return (
        <div className="p-4">
            <div className="max-w-4xl mx-auto bg-[#1C1B1B] border-2 border-[#313030] rounded-xl p-8">
                {/* Header Section */}
                <div className="flex items-start">
                    {/* Profile Picture */}
                    <img
                        className="h-40 w-40 bg-[#CCC5B9] rounded-xl"
                        src={`${user.imageUrl}`}
                        alt="Profile"
                    />

                    {/* User Info */}
                    <div className="ml-8 mt-2">
                        <h1 className="text-3xl font-bold">{user.nickname}</h1>
                        {showAllDetails && (<div className="mt-2 text-[#adaaaa] capitalize">
                            {user.age} • {user.gender} • {user.location}
                        </div>)}
                        <button
                            onClick={buttonHandler}
                            className={`mt-4 cursor-pointer px-4 py-2 text-black rounded-md transition-all ${buttonText === "Remove" ? "border-b-3 border-[#ff7a5a] bg-[#ff7351] hover:bg-[#ff9a82]" : "border-b-3 border-[#A2D800] bg-[#C0FF00] hover:bg-[#eaffb8]"}`}
                        >
                            {buttonText}
                        </button>
                    </div>
                </div>

                {/* Bio Section */}
                <section className="bg-[#121212] p-5 rounded-xl mt-6">
                    <h2 className="text-[#D8FF80] text-xl font-semibold mb-3">//about_me</h2>
                    <p>{user.bio}</p>
                </section>

                {/* Tech Stack and Looking For Section */}
                <div className="mt-8 flex flex-col md:flex-row gap-6">
                    {/* Tech Stack */}
                    <section className="bg-[#121212] p-5 rounded-xl">
                        <h2 className="text-[#D8FF80] text-xl font-semibold mb-3">//interests</h2>
                        <div className="flex flex-wrap gap-2">
                            {user.interest?.map((interest: string) => (
                                <span
                                    key={interest}
                                    className="px-3 py-1 bg-[#C0FF00] text-sm text-black rounded-xl"
                                >
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </section>
                    {showAllDetails && (
                        <section className="bg-[#121212] p-5 rounded-xl">
                            <h2 className="text-[#D8FF80] text-xl font-semibold mb-3">//looking_for</h2>
                            <div className="flex flex-wrap gap-2">
                                {user.lookingFor?.map((looking: string) => (
                                    <span
                                        key={looking}
                                        className="px-3 py-1 bg-[#C0FF00] text-sm text-black rounded-xl"
                                    >
                                        {looking}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewProfile;