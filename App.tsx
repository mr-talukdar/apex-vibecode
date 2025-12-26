import React, { useState, useMemo } from 'react';
import { Plus, Trophy, Zap, Filter, Map, Gauge, Users, ChevronLeft, Search, LogIn, ArrowRight } from 'lucide-react';
import RideCard from './components/RideCard';
import CreateRideModal from './components/CreateRideModal';
import GroupCard from './components/GroupCard';
import JoinGroupModal from './components/JoinGroupModal';
import { Ride, RideLevel, User, TerrainType, Group } from './types';

// --- MOCK DATA ---
const INITIAL_GROUPS: Group[] = [
    {
        id: 'g1',
        name: 'SoCal Canyons',
        description: 'Dedicated to the twistiest roads in Southern California. Sport bikes preferred.',
        image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c3d?q=80&w=800&auto=format&fit=crop',
        code: 'CANYON',
        isPrivate: false,
        memberCount: 142,
        adminId: 'admin1'
    },
    {
        id: 'g2',
        name: 'Midnight Runners',
        description: 'Late night highway runs. Fast pace. Private group only.',
        image: 'https://images.unsplash.com/photo-1625043484555-47841a75023e?q=80&w=800&auto=format&fit=crop',
        code: 'NIGHT1',
        isPrivate: true,
        memberCount: 24,
        adminId: 'admin2'
    },
    {
        id: 'g3',
        name: 'Weekend Cruisers',
        description: 'Chill rides, coffee stops, good vibes. All skill levels welcome.',
        image: 'https://images.unsplash.com/photo-1558980664-2506fca6bfc2?q=80&w=800&auto=format&fit=crop',
        code: 'COFFEE',
        isPrivate: false,
        memberCount: 350,
        adminId: 'admin3'
    }
];

const INITIAL_RIDES: Ride[] = [
  {
    id: 'r1',
    groupId: 'g1',
    title: 'Mulholland Snake',
    description: 'Aggressive sport ride through the twisties. Full leathers required.',
    date: '2023-11-15',
    time: '07:00',
    distance: 45,
    elevation: 4500,
    level: RideLevel.A,
    terrain: 'Mountains',
    minPoints: 2000,
    maxRiders: 10,
    currentRiders: 8,
    leaderName: 'Sarah Speed',
    marshallName: 'Dave Ducati',
    tailName: 'Ben BMW'
  },
  {
    id: 'r2',
    groupId: 'g3',
    title: 'PCH Breakfast Run',
    description: 'Relaxed scenic ride along the coast. Open to all bike types.',
    date: '2023-11-18',
    time: '09:00',
    distance: 60,
    elevation: 500,
    level: RideLevel.C,
    terrain: 'Beach',
    minPoints: 800,
    maxRiders: 30,
    currentRiders: 22,
    leaderName: 'Mike Harley',
    tailName: 'Lucy Lane'
  },
  {
    id: 'r3',
    groupId: 'g2',
    title: 'Loop 405 Express',
    description: 'Fast paced highway run. Stagger formation strict.',
    date: '2023-11-22',
    time: '23:30',
    distance: 60,
    elevation: 200,
    level: RideLevel.A,
    terrain: 'Highway',
    minPoints: 1500,
    maxRiders: 15,
    currentRiders: 12,
    leaderName: 'Tom Turbo',
  }
];

const TERRAIN_FILTERS: TerrainType[] = ['Mountains', 'Highway', 'Trail', 'Beach', 'Urban'];

const App: React.FC = () => {
  // --- STATE ---
  const [user, setUser] = useState<User | null>(null); // Null if not logged in
  const [loginName, setLoginName] = useState('');

  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [rides, setRides] = useState<Ride[]>(INITIAL_RIDES);
  
  // Navigation State
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isRideModalOpen, setIsRideModalOpen] = useState(false);
  const [joinError, setJoinError] = useState('');
  
  // Filters
  const [filterLevel, setFilterLevel] = useState<RideLevel | 'ALL'>('ALL');
  const [filterTerrain, setFilterTerrain] = useState<TerrainType | 'ALL'>('ALL');

  // --- HANDLERS ---

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginName.trim()) return;
    setUser({
        id: `u-${Date.now()}`,
        name: loginName,
        points: 0,
        avatarUrl: `https://ui-avatars.com/api/?name=${loginName}&background=0D8ABC&color=fff`,
        joinedGroups: ['g3'], // Join public group by default
        joinedRides: [],
        requestedRides: []
    });
  };

  // Group Handlers
  const handleJoinByCode = (code: string) => {
    const group = groups.find(g => g.code === code);
    if (group) {
        if (user && !user.joinedGroups.includes(group.id)) {
            setUser({ ...user, joinedGroups: [...user.joinedGroups, group.id] });
            setGroups(prev => prev.map(g => g.id === group.id ? { ...g, memberCount: g.memberCount + 1} : g));
            setIsJoinModalOpen(false);
            setJoinError('');
            // Auto navigate to that group
            setActiveGroupId(group.id);
        } else {
             setJoinError('You are already a member.');
        }
    } else {
        setJoinError('Invalid Group Code');
    }
  };

  const handleCreateGroup = (name: string, description: string, isPrivate: boolean) => {
    const newGroup: Group = {
        id: `g-${Date.now()}`,
        name,
        description,
        isPrivate,
        code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        image: `https://picsum.photos/seed/${Date.now()}/800/300`,
        memberCount: 1,
        adminId: user!.id
    };
    setGroups([...groups, newGroup]);
    setUser(prev => prev ? ({ ...prev, joinedGroups: [...prev.joinedGroups, newGroup.id] }) : null);
    setIsJoinModalOpen(false);
  };

  const handlePublicJoin = (group: Group) => {
    if (user && !user.joinedGroups.includes(group.id)) {
        setUser({ ...user, joinedGroups: [...user.joinedGroups, group.id] });
        setGroups(prev => prev.map(g => g.id === group.id ? { ...g, memberCount: g.memberCount + 1} : g));
    }
  };

  // Ride Handlers (Scoped to Active Group)
  const handleCreateRide = (newRideData: Omit<Ride, 'id' | 'currentRiders' | 'routeImage' | 'groupId'>) => {
    if (!activeGroupId) return;
    
    const newRide: Ride = {
      ...newRideData,
      id: Math.random().toString(36).substr(2, 9),
      groupId: activeGroupId,
      currentRiders: 1, // Leader joins automatically
      routeImage: `https://picsum.photos/seed/${Math.random()}/800/300`
    };
    setRides([...rides, newRide]);
    setUser(prev => prev ? ({
        ...prev,
        joinedRides: [...prev.joinedRides, newRide.id]
    }) : null);
  };

  const handleJoinRide = (rideId: string) => {
    setRides(prev => prev.map(r => r.id === rideId ? { ...r, currentRiders: r.currentRiders + 1 } : r));
    setUser(prev => prev ? ({ ...prev, joinedRides: [...prev.joinedRides, rideId] }) : null);
  };

  const handleLeaveRide = (rideId: string) => {
    setRides(prev => prev.map(r => r.id === rideId ? { ...r, currentRiders: r.currentRiders - 1 } : r));
    setUser(prev => prev ? ({ ...prev, joinedRides: prev.joinedRides.filter(id => id !== rideId) }) : null);
  };

  const handleRequestRide = (rideId: string) => {
    setUser(prev => prev ? ({ ...prev, requestedRides: [...prev.requestedRides, rideId] }) : null);
  };

  // --- DERIVED STATE ---
  const activeGroup = useMemo(() => groups.find(g => g.id === activeGroupId), [groups, activeGroupId]);
  
  const activeGroupRides = useMemo(() => {
      if (!activeGroupId) return [];
      return rides.filter(r => r.groupId === activeGroupId).filter(ride => {
        const levelMatch = filterLevel === 'ALL' || ride.level === filterLevel;
        const terrainMatch = filterTerrain === 'ALL' || ride.terrain === filterTerrain;
        return levelMatch && terrainMatch;
      });
  }, [rides, activeGroupId, filterLevel, filterTerrain]);

  const userGroups = useMemo(() => {
      if (!user) return [];
      return groups.filter(g => user.joinedGroups.includes(g.id));
  }, [groups, user]);

  const otherGroups = useMemo(() => {
      if (!user) return groups;
      return groups.filter(g => !user.joinedGroups.includes(g.id));
  }, [groups, user]);


  // --- VIEW: LOGIN ---
  if (!user) {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
            
            <div className="relative z-10 w-full max-w-md bg-slate-800/80 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-tr from-blue-500 to-emerald-500 p-3 rounded-xl shadow-lg">
                        <Gauge className="text-white w-10 h-10" />
                    </div>
                </div>
                <h1 className="text-3xl font-extrabold text-center text-white mb-2">Ape<span className="text-blue-500">X</span></h1>
                <p className="text-slate-400 text-center mb-8">Join the elite motorcycling community.</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1 ml-1">Rider Name</label>
                        <input 
                            type="text" 
                            required
                            placeholder="Enter your handle" 
                            className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                            value={loginName}
                            onChange={(e) => setLoginName(e.target.value)}
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 transition-all active:scale-95 group"
                    >
                        Start Your Engine <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </div>
        </div>
    );
  }

  // --- VIEW: APP ---
  return (
    <div className="min-h-screen pb-20 bg-slate-950">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveGroupId(null)}>
            <div className="bg-gradient-to-tr from-blue-500 to-emerald-500 p-1.5 rounded-lg">
                <Gauge className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">Ape<span className="text-blue-500">X</span></h1>
          </div>

          <div className="flex items-center gap-4">
             {/* Simple XP Bar */}
             <div className="hidden md:block">
                 <div className="text-[10px] text-right text-slate-400 mb-1">{user.points} XP</div>
                 <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[60%]"></div>
                 </div>
             </div>
             
             <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                <span className="text-sm font-bold text-white hidden sm:block">{user.name}</span>
                <img src={user.avatarUrl} alt="Profile" className="w-9 h-9 rounded-full border border-slate-700 bg-slate-800" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW: GROUP DETAILS (RIDE LIST) */}
        {activeGroupId && activeGroup ? (
            <div className="animate-fadeIn">
                <button 
                    onClick={() => setActiveGroupId(null)}
                    className="flex items-center text-slate-400 hover:text-white mb-6 text-sm font-medium transition-colors"
                >
                    <ChevronLeft size={16} /> Back to Groups
                </button>

                {/* Group Header */}
                <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 mb-8 relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-20">
                         <img src={activeGroup.image} className="w-full h-full object-cover" alt="bg" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h2 className="text-3xl font-bold text-white">{activeGroup.name}</h2>
                                {activeGroup.isPrivate && <div className="bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded text-xs border border-amber-500/30">Private</div>}
                            </div>
                            <p className="text-slate-400 max-w-2xl">{activeGroup.description}</p>
                            <div className="flex items-center gap-4 mt-4 text-sm text-slate-500 font-mono">
                                <span>CODE: <span className="text-slate-300 select-all">{activeGroup.code}</span></span>
                                <span className="flex items-center gap-1"><Users size={14} /> {activeGroup.memberCount} Riders</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsRideModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap"
                        >
                            <Plus size={20} /> New Ride
                        </button>
                    </div>
                </div>

                {/* Ride Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="bg-slate-900 p-1 rounded-lg flex items-center border border-slate-800 overflow-x-auto">
                        <button onClick={() => setFilterLevel('ALL')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${filterLevel === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>All Levels</button>
                        {(Object.keys(RideLevel) as Array<keyof typeof RideLevel>).map(l => (
                             <button key={l} onClick={() => setFilterLevel(l as RideLevel)} className={`px-4 py-2 rounded-md text-sm font-medium transition-all w-16 ${filterLevel === l ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>{l}</button>
                        ))}
                    </div>
                    <div className="bg-slate-900 p-1 rounded-lg flex items-center border border-slate-800 overflow-x-auto">
                        <button onClick={() => setFilterTerrain('ALL')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${filterTerrain === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>Any Terrain</button>
                        {TERRAIN_FILTERS.map(t => (
                             <button key={t} onClick={() => setFilterTerrain(t)} className={`px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${filterTerrain === t ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>{t}</button>
                        ))}
                    </div>
                </div>

                {/* Ride Grid */}
                {activeGroupRides.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {activeGroupRides.map(ride => (
                            <RideCard 
                                key={ride.id} 
                                ride={ride} 
                                user={user} 
                                onJoin={handleJoinRide}
                                onLeave={handleLeaveRide}
                                onRequest={handleRequestRide}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/50">
                        <Map size={48} className="mx-auto text-slate-700 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-300">No scheduled rides</h3>
                        <p className="text-slate-500 mb-6">Be the first to lead a ride for this group!</p>
                        <button onClick={() => setIsRideModalOpen(true)} className="text-blue-500 hover:text-blue-400 text-sm font-medium">Create a Ride</button>
                    </div>
                )}
            </div>
        ) : (
            // VIEW: DASHBOARD (GROUP LIST)
            <div className="animate-fadeIn">
                 <div className="flex justify-between items-end mb-8">
                     <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Your Groups</h2>
                        <p className="text-slate-400 text-sm">Select a squad to view their rides.</p>
                     </div>
                     <button 
                        onClick={() => setIsJoinModalOpen(true)}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium border border-slate-700 flex items-center gap-2 transition-colors"
                     >
                        <Plus size={16} /> Join / Create
                     </button>
                 </div>

                 {userGroups.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {userGroups.map(group => (
                            <GroupCard 
                                key={group.id} 
                                group={group} 
                                user={user}
                                onOpen={(g) => setActiveGroupId(g.id)}
                                onJoin={() => {}} // Already joined
                            />
                        ))}
                    </div>
                 ) : (
                    <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 text-center mb-12">
                        <Users className="mx-auto text-slate-600 mb-3 w-12 h-12" />
                        <h3 className="text-white font-bold mb-2">You haven't joined any groups yet</h3>
                        <p className="text-slate-400 text-sm mb-4">Join a public group below or enter a code from a friend.</p>
                        <button onClick={() => setIsJoinModalOpen(true)} className="text-blue-400 hover:text-blue-300 text-sm">Have a code?</button>
                    </div>
                 )}

                 {/* Public Groups */}
                 {otherGroups.length > 0 && (
                     <>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Search size={18} className="text-slate-500" /> Browse Public Groups
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {otherGroups.map(group => (
                                <GroupCard 
                                    key={group.id} 
                                    group={group} 
                                    user={user}
                                    onOpen={(g) => setActiveGroupId(g.id)} // View preview (functionality simplified for mock)
                                    onJoin={handlePublicJoin}
                                />
                            ))}
                        </div>
                     </>
                 )}
            </div>
        )}

      </main>

      {/* MODALS */}
      <JoinGroupModal 
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoinByCode={handleJoinByCode}
        onCreateGroup={handleCreateGroup}
        error={joinError}
      />

      <CreateRideModal 
        isOpen={isRideModalOpen} 
        onClose={() => setIsRideModalOpen(false)} 
        onCreate={handleCreateRide}
        currentUser={user.name}
      />

    </div>
  );
};

export default App;