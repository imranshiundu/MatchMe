import SuggestedUserCard from '../components/matches/SuggestedUserCard.tsx';
import IncomingRequests from '../components/matches/IncomingRequests.tsx';
import {useState} from 'react';

function Dashboard() {

    const [viewSuggestions, setViewSuggestions] = useState<boolean>(true);

    return (
        <div className={'grid place-items-center'}>
            {viewSuggestions ? <SuggestedUserCard/> : <IncomingRequests/>}

            <section className={'flex h-10 w-150 justify-evenly items-center bg-[#313030] text-[#adaaaa] rounded-t-xl text-xl fixed bottom-0'}>
                <button
                    onClick={() => setViewSuggestions(true)}
                    className={`${viewSuggestions ? 'bg-[#C0FF00] text-[#121212] px-4 rounded-xs':'hover:bg-[#474646] hover:border-[#C0FF00] border-b-3 border-transparent px-4 transition-all duration-150 rounded-xs'}`}>
                    suggestions
                </button>
                <button
                    onClick={() => setViewSuggestions(false)}
                    className={`${!viewSuggestions ? 'bg-[#C0FF00] text-[#121212] px-4 rounded-xs':'hover:bg-[#474646] hover:border-[#C0FF00] border-b-3 border-transparent px-4 transition-all duration-150 rounded-xs'}`}>
                    requests
                </button>
            </section>
        </div>
    )
}

export default Dashboard;