import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Icon from '../Icon';

function Header() {
    const { userEmail } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const res = await fetch(`http://localhost:8085/profiles/search?q=${query}`);
            if (res.ok) {
                const data = await res.json();
                setSearchResults(data);
            }
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-[#121212]/80 backdrop-blur-md border-b border-[#313030] z-50 flex items-center justify-between px-4 md:px-8">
            {/* Logo - No M Box, just Font */}
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                <Link to="/match" className="group">
                    <span className="text-xl md:text-2xl font-black tracking-tighter text-white group-hover:text-[#C0FF00] transition-colors">
                        MatchMe<span className="text-[#C0FF00]">.</span>
                    </span>
                </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 flex justify-center px-4 md:px-12 max-w-3xl" ref={searchRef}>
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Icon name="search-icon" size={16} className="text-[#adaaaa]" />
                    </div>
                    <input
                        type="text"
                        placeholder="Discover talent, interests, stacks..."
                        className="block w-full pl-11 pr-4 py-2.5 bg-[#1C1B1B] border border-[#313030] rounded-2xl text-sm text-white placeholder-[#5a6a6a] outline-none focus:border-[#C0FF00] focus:ring-1 focus:ring-[#C0FF00] transition-all"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => setShowResults(true)}
                    />
                </div>

                {/* Search Results Dropdown */}
                {showResults && (searchQuery.length >= 2) && (
                    <div className="absolute top-14 left-4 right-4 md:left-auto md:right-auto md:w-[450px] bg-[#1C1B1B] border border-[#313030] rounded-2xl shadow-2xl overflow-hidden z-[60] animate-fade-in">
                        {isSearching ? (
                            <div className="p-6 text-center text-[#adaaaa] text-sm font-mono tracking-widest uppercase">Initializing Search...</div>
                        ) : searchResults.length > 0 ? (
                            <div className="max-h-[70vh] md:max-h-[500px] overflow-y-auto">
                                {searchResults.map((user) => (
                                    <div 
                                        key={user.id}
                                        onClick={() => {
                                            navigate(`/match/${user.id}`);
                                            setShowResults(false);
                                            setSearchQuery('');
                                        }}
                                        className="flex items-center gap-4 p-4 hover:bg-[#252422] cursor-pointer transition-colors border-b border-[#313030] last:border-0 group"
                                    >
                                        <img 
                                            src={user.imageUrl || '/favicon.svg'} 
                                            alt={user.nickname}
                                            className="w-12 h-12 rounded-xl object-cover border border-[#313030] group-hover:border-[#C0FF00] transition-colors"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-black text-white truncate group-hover:text-[#C0FF00] transition-colors">{user.nickname}</p>
                                            <p className="text-xs text-[#5a6a6a] font-mono uppercase tracking-tighter truncate">{user.location || 'Professional'}</p>
                                        </div>
                                        <Icon name="view-profile-icon" size={16} className="text-[#adaaaa] group-hover:text-[#C0FF00]" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 text-center text-[#adaaaa] text-sm italic">No users found for your query.</div>
                        )}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                <Link to="/messages" className="p-2.5 text-[#adaaaa] hover:text-[#C0FF00] hover:bg-[#1C1B1B] rounded-xl transition-all hidden sm:flex">
                    <Icon name="message-icon" size={20} />
                </Link>
                <Link to="/me" className="flex items-center gap-3 p-1 pl-1 pr-4 bg-[#1C1B1B] border border-[#313030] hover:border-[#C0FF00] rounded-2xl transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-[#313030] overflow-hidden border border-[#313030] group-hover:border-[#C0FF00] transition-colors">
                        <img src="/favicon.svg" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <span className="hidden lg:block text-xs font-black uppercase tracking-widest text-[#adaaaa] group-hover:text-white transition-colors">{userEmail?.split('@')[0]}</span>
                </Link>
            </div>
        </header>
    );
}

export default Header;
