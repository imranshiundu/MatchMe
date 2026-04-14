function ConnectionCard({connectionName, recentMessage, isOnline}) {
    return (
        <div className={'bg-[#313030] rounded-lg flex max-w-80 cursor-pointer hover:bg-[#474646] mt-3 transition-color duration-150'}>
            <div className={`h-12 w-12 bg-[#CCC5B9] border-3 ${isOnline ? "border-[#eaffb8]" : "border-[#ff7351]"} rounded-lg inline-block`}/>
            <div className={'flex flex-col flex-1 ml-2 mr-2 min-w-0 gap-1'}>
                <p className={''}>{connectionName}</p>
                <p className={'text-[#adaaaa] text-xs truncate'}>{recentMessage}</p>
            </div>
        </div>
    )
}

export default ConnectionCard;