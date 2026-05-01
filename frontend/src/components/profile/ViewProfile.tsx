import Icon from "../Icon";

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
                        <h1 className="text-3xl font-bold text-[#C0FF00]">{user.nickname}</h1>
                        {showAllDetails && (<div className="mt-2 text-[#adaaaa] capitalize">
                            {user.age} • {user.gender} • {user.location}
                        </div>)}
                        <button
                            onClick={buttonHandler}
                            className={`mt-4 cursor-pointer px-4 py-2 text-[#121212] rounded-lg ${buttonText === "Remove" ? "border-b-3 border-[#E62721] bg-[#FF3B30] hover:border-b-0 hover:border-t-3 hover:border-[#1c1b1b] hover:bg-[#E62721]" : "border-b-3 border-[#8BBA00] bg-[#C0FF00] hover:border-b-0 hover:border-t-3 hover:border-[#1c1b1b] hover:bg-[#A2D800]"}`}
                        >
                            {buttonText === "Edit Profile" && <Icon name={'edit-icon'}/>}
                            {buttonText === "Remove" && <Icon name={'remove-icon'}/>}
                            {buttonText === "Connect" && <Icon name={'connect-icon'}/>}
                        </button>
                    </div>
                </div>

                {/* Bio Section */}
                <section className="bg-[#121212] p-5 rounded-xl mt-6">
                    <h2 className="text-[#C0FF00] text-xl font-semibold mb-3">//about_me</h2>
                    <p className={'text-[#D8FF80]'}>{user.bio}</p>
                </section>

                {/* Tech Stack and Looking For Section */}
                <div className="mt-8 flex flex-col md:flex-row gap-6">
                    {/* Tech Stack */}
                    <section className="bg-[#121212] p-5 rounded-xl">
                        <h2 className="text-[#C0FF00] text-xl font-semibold mb-3">//interests</h2>
                        <div className="flex flex-wrap gap-2">
                            {user.interest?.map((interest: string) => (
                                <span
                                    key={interest}
                                    className="px-3 py-1 bg-[#252422] text-sm text-[#D8FF80] rounded-full"
                                >
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </section>
                    {showAllDetails && (
                        <section className="bg-[#121212] p-5 rounded-xl">
                            <h2 className="text-[#C0FF00] text-xl font-semibold mb-3">//looking_for</h2>
                            <div className="flex flex-wrap gap-2">
                                {user.lookingFor?.map((looking: string) => (
                                    <span
                                        key={looking}
                                        className="px-3 py-1 bg-[#252422] text-sm text-[#D8FF80] rounded-full"
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