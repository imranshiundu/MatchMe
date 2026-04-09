function ConnectionCard({connectionName, recentMessage, isOnline}) {
    return (
        <div className={'bg-[#313030] rounded-xl flex max-w-80 cursor-pointer hover:bg-[#474646] mt-3 transition-color duration-150'}>
            <div className={`h-12 w-12 bg-[#CCC5B9] border-3 ${isOnline ? "border-[#eaffb8]" : "border-[#ff7351]"} rounded-xl inline-block`}/>
            <div className={'flex flex-col flex-1 ml-3 min-w-0'}>
                <p className={'font-bold'}>{connectionName}</p>
                <p className={'text-gray-300 truncate'}>{recentMessage}</p>
            </div>
        </div>
    )
}

export default ConnectionCard;