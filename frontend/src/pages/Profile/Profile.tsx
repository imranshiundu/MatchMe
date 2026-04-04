function Profile() {
    // Placeholder for dynamic data
    const user = {
        name: "John Programming",
        age: "30",
        gender: "Male",
        location: "Matrix",
        bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        interests: ["Music", "Hiking", "Photography", "Travel", "Cooking"],
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            {/* Header Section */}
            <section className="bg-[#252422] rounded-2xl p-5 mt-5">
                <div className="flex items-start">
                    {/* Profile Picture */}
                    <div className="h-40 w-40 bg-[#CCC5B9] border-2 border-[#EB5E28] rounded-full ml-5 mt-5" />

                    {/* User Info */}
                    <div className="ml-8 mt-5">
                        <h1 className="text-3xl font-bold">{user.name}</h1>
                        <div className="mt-4 space-y-2">
                            {/* User Info Fields */}
                            {[
                                { label: "Age", value: user.age },
                                { label: "Gender", value: user.gender },
                                { label: "Location", value: user.location },
                            ].map((field) => (
                                <div key={field.label}>
                                    <span className="font-semibold ">{field.label}:</span>
                                    <span className="ml-2 underline decoration-[#EB5E28]">
                    {field.value}
                  </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Bio and Interests Section */}
            <div className="flex gap-4 mt-5">
                {/* Biography */}
                <section className="bg-[#252422] rounded-2xl p-5 flex-2">
                    <h2 className="text-xl font-semibold mb-2">Bio</h2>
                    <p>{user.bio}</p>
                </section>

                {/* Interests */}
                <section className="bg-[#252422] rounded-2xl p-5 flex-1 ">
                    <h2 className="text-xl font-semibold mb-2">Interests</h2>
                    <div className="flex flex-wrap gap-2">
                        {user.interests.map((interest) => (
                            <span
                                key={interest}
                                className="px-3 py-1 bg-[#EB5E28] rounded-full text-sm"
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

export default Profile;