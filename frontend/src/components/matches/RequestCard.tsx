function RequestCard({connectionName}) {
    return (
        <div className={'bg-[#1c1b1b] rounded-lg flex items-center cursor-pointer'}>
            <div className={'h-12 w-12 bg-[#CCC5B9] border-2 border-[#FFFCF2] rounded-lg inline-block'}/>
            <p className={'mx-2 cursor-auto text-lg'}>{connectionName}</p>
            <button className={'text-[#FAE44C] hover:text-[#FFF2AB] hover:bg-[#313030] p-1 rounded-xl cursor-pointer'}>[reject]</button>
            <button className={'text-[#C0FF00] hover:text-[#D8FF80] hover:bg-[#313030] mr-2 p-1 rounded-xl cursor-pointer'}>[accept]</button>
        </div>
    )
}

export default RequestCard;