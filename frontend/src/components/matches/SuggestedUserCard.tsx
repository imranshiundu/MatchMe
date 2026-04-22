function SuggestedUserCard() {
    return (
        <div className={'grid place-items-center h-fit w-fit'}>
            <h1 className={'text-[#C0FF00] text-2xl mt-5 mb-5'}>suggested_user</h1>
            <section className={'grid place-items-center bg-[#1C1B1B] px-5 py-5 rounded-xl'}>
                <div className="h-60 w-60 bg-[#CCC5B9] border-2 border-[#C0FF00] mt-5 rounded-xl"/>
                <h2 className={'mt-2 text-2xl text-[#C0FF00]'}>User's Name</h2>
                <div className={'mr-auto'}>
                    <h3 className={'text-[#D8FF80] mt-1'}>about</h3>
                    <p className={'bg-[#313030] p-2 rounded-md'}>Their bio goes here</p>
                    <h3 className={'text-[#D8FF80] mt-1'}>common_interests</h3>
                    <div className={'bg-[#313030] p-2 rounded-md'}>common interests go here</div>
                </div>
            </section>
            <div className={'text-[#121212] mt-5'}>
                <button className={'bg-[#FAE44C] hover:bg-[#FFF2AB] p-2 rounded-md mr-3 cursor-pointer'}>skip</button>
                <button className={'bg-[#C0FF00] p-2 rounded-md hover:bg-[#D8FF80] ml-3 cursor-pointer'}>request</button>
            </div>
        </div>
    )
}

export default SuggestedUserCard;