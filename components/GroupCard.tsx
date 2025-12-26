import React from 'react';
import { Users, Lock, Unlock, Hash, ChevronRight } from 'lucide-react';
import { Group, User } from '../types';

interface GroupCardProps {
  group: Group;
  user: User;
  onOpen: (group: Group) => void;
  onJoin: (group: Group) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, user, onOpen, onJoin }) => {
  const isMember = user.joinedGroups.includes(group.id);

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg hover:border-slate-600 transition-all duration-300 flex flex-col h-full group-hover">
      <div className="h-24 bg-slate-700 relative overflow-hidden">
        <img 
          src={group.image} 
          alt={group.name} 
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
        />
        <div className="absolute top-2 right-2">
            {group.isPrivate ? (
                <div className="bg-black/50 backdrop-blur-md p-1.5 rounded-full text-slate-300">
                    <Lock size={14} />
                </div>
            ) : (
                <div className="bg-emerald-500/20 backdrop-blur-md p-1.5 rounded-full text-emerald-400 border border-emerald-500/30">
                    <Unlock size={14} />
                </div>
            )}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-white mb-1">{group.name}</h3>
        <p className="text-xs text-slate-400 mb-4 line-clamp-2">{group.description}</p>
        
        <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-slate-400">
                <Users size={14} />
                <span>{group.memberCount} Members</span>
            </div>
            
            {isMember ? (
                <button 
                    onClick={() => onOpen(group)}
                    className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
                >
                    Open <ChevronRight size={12} />
                </button>
            ) : (
                <button 
                    onClick={() => onJoin(group)}
                    disabled={group.isPrivate}
                    className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                        group.isPrivate 
                        ? 'border-slate-700 text-slate-500 cursor-not-allowed bg-transparent' 
                        : 'bg-blue-600 hover:bg-blue-500 text-white border-transparent'
                    }`}
                >
                    {group.isPrivate ? 'Code Required' : 'Join Group'}
                </button>
            )}
        </div>
      </div>
      {/* Code Badge for reference */}
      <div className="px-4 py-2 bg-slate-900/50 border-t border-slate-700/50 flex justify-between items-center">
         <span className="text-[10px] text-slate-500 uppercase tracking-wider">Group Code</span>
         <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
            <Hash size={10} /> {group.code}
         </span>
      </div>
    </div>
  );
};

export default GroupCard;