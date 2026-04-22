import RequestCard from '../matches/RequestCard.tsx'
function IncomingRequests() {
    return (
        <>
            <h1 className='text-[#C0FF00] text-2xl mt-5 mb-5'>connection_requests</h1>
            <div className={'flex flex-col gap-4'}>
                <RequestCard connectionName={'test name'}/>
            </div>
        </>
    )
}

export default IncomingRequests