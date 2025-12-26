import React from 'react';
import { Calendar, Clock, Mountain, TrendingUp, Users, Lock, CheckCircle, Waves, Building2, Trees, Route, Hand, Crown, Shield, Flag, Gauge } from 'lucide-react';
import { Ride, User, LEVEL_CONFIG, TerrainType } from '../types';

interface RideCardProps {
  ride: Ride;
  user: User;
  onJoin: (rideId: string) => void;
  onLeave: (rideId: string) => void;
  onRequest: (rideId: string) => void;
}

const RideCard: React.FC<RideCardProps> = ({ ride, user, onJoin, onLeave, onRequest }) => {
  const config = LEVEL_CONFIG[ride.level];
  const isJoined = user.joinedRides.includes(ride.id);
  const isRequested = user.requestedRides.includes(ride.id);
  const canJoin = user.points >= ride.minPoints;
  const isFull = ride.currentRiders >= ride.maxRiders;

  const handleAction = () => {
    if (isJoined) {
      onLeave(ride.id);
    } else if (canJoin && !isFull) {
      onJoin(ride.id);
    } else if (!canJoin && !isRequested) {
      onRequest(ride.id);
    }
  };

  const TerrainIcon = ({ type }: { type: TerrainType }) => {
    switch (type) {
      case 'Mountains': return <Mountain size={14} className="text-slate-400" />;
      case 'Beach': return <Waves size={14} className="text-slate-400" />;
      case 'Urban': return <Building2 size={14} className="text-slate-400" />;
      case 'Trail': return <Trees size={14} className="text-slate-400" />;
      default: return <Route size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg hover:border-slate-600 transition-all duration-300 flex flex-col h-full group">
      {/* Header Image Area */}
      <div className="h-32 bg-slate-700 relative overflow-hidden">
        <img 
          src={ride.routeImage || `https://picsum.photos/seed/${ride.id}/800/300`} 
          alt="Route" 
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${config.color} ${config.bg} ${config.border} backdrop-blur-md`}>
            {config.label}
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
             <h3 className="text-xl font-bold text-white drop-shadow-md truncate max-w-[280px]">{ride.title}</h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col">
        
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-1 text-sm text-slate-400">
             <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-500" />
                <span>{ride.date}</span>
             </div>
             <div className="flex items-center gap-2">
                <Clock size={14} className="text-slate-500" />
                <span>KSU {ride.time}</span>
             </div>
          </div>
          <div className="text-right">
             <div className="text-2xl font-bold text-white">{ride.distance}<span className="text-sm font-normal text-slate-400 ml-1">mi</span></div>
             <div className="text-xs text-slate-400 flex items-center justify-end gap-1">
               <TerrainIcon type={ride.terrain} /> {ride.terrain}
             </div>
          </div>
        </div>

        {/* Support Team Section */}
        <div className="flex flex-wrap gap-2 mb-4 text-xs">
           <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-700/50 rounded border border-slate-700 text-slate-300" title="Road Captain">
              <Crown size={12} className="text-yellow-500" /> 
              <span className="truncate max-w-[80px]">{ride.leaderName}</span>
           </div>
           {ride.marshallName && (
             <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-700/50 rounded border border-slate-700 text-slate-300" title="Marshall">
                <Shield size={12} className="text-blue-400" />
                <span className="truncate max-w-[80px]">{ride.marshallName}</span>
             </div>
           )}
           {ride.tailName && (
             <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-700/50 rounded border border-slate-700 text-slate-300" title="Sweep/Tail">
                <Flag size={12} className="text-orange-400" />
                <span className="truncate max-w-[80px]">{ride.tailName}</span>
             </div>
           )}
        </div>

        <p className="text-sm text-slate-300 mb-6 line-clamp-3 leading-relaxed">
          {ride.description}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-700/50">
            <div className="flex items-center justify-between mb-4 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1"><Users size={14}/> {ride.currentRiders}/{ride.maxRiders} Bikes</span>
                <span className="flex items-center gap-1"><Gauge size={14}/> {config.avgSpeed}</span>
            </div>

            <button
                onClick={handleAction}
                disabled={(!isJoined && !canJoin && isRequested) || (!isJoined && canJoin && isFull)}
                className={`w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all
                  ${isJoined 
                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20' 
                    : !canJoin
                      ? isRequested 
                        ? 'bg-amber-500/10 text-amber-500 cursor-not-allowed border border-amber-500/20'
                        : 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/20'
                      : isFull
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                  }
                `}
            >
                {isJoined ? (
                    <>
                        <CheckCircle size={16} /> Leave Ride
                    </>
                ) : !canJoin ? (
                    isRequested ? (
                      <>
                        <Clock size={16} /> Request Pending
                      </>
                    ) : (
                      <>
                        <Hand size={16} /> Request Entry
                      </>
                    )
                ) : isFull ? (
                    'Ride Full'
                ) : (
                    'Join Ride'
                )}
            </button>
            {!canJoin && !isJoined && !isRequested && (
               <p className="text-center text-xs text-amber-500/80 mt-2">
                 Requires {ride.minPoints} XP • Request to join
               </p>
            )}
        </div>
      </div>
    </div>
  );
};

export default RideCard;