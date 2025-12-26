import React, { useState } from 'react';
import { X, Hash, Plus, Users } from 'lucide-react';
import { Group } from '../types';

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinByCode: (code: string) => void;
  onCreateGroup: (name: string, description: string, isPrivate: boolean) => void;
  error?: string;
}

const JoinGroupModal: React.FC<JoinGroupModalProps> = ({ isOpen, onClose, onJoinByCode, onCreateGroup, error }) => {
  const [activeTab, setActiveTab] = useState<'JOIN' | 'CREATE'>('JOIN');
  const [code, setCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl overflow-hidden">
        
        <div className="flex border-b border-slate-700">
            <button 
                className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'JOIN' ? 'bg-slate-800 text-white border-b-2 border-blue-500' : 'bg-slate-900/50 text-slate-400 hover:text-slate-200'}`}
                onClick={() => setActiveTab('JOIN')}
            >
                Join with Code
            </button>
            <button 
                className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'CREATE' ? 'bg-slate-800 text-white border-b-2 border-blue-500' : 'bg-slate-900/50 text-slate-400 hover:text-slate-200'}`}
                onClick={() => setActiveTab('CREATE')}
            >
                Create Group
            </button>
        </div>

        <div className="p-6">
            {activeTab === 'JOIN' ? (
                <div className="space-y-4">
                    <p className="text-slate-400 text-sm">Enter the 6-character code provided by a group admin to join a private group.</p>
                    <div>
                        <div className="relative">
                            <Hash className="absolute left-3 top-3 text-slate-500" size={18} />
                            <input 
                                type="text" 
                                placeholder="ENTER CODE" 
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white font-mono uppercase tracking-widest focus:ring-2 focus:ring-blue-500 outline-none"
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                            />
                        </div>
                        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                    </div>
                    <button 
                        onClick={() => onJoinByCode(code)}
                        disabled={code.length < 3}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                    >
                        Join Group
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Group Name</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. Weekend Warriors"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
                        <textarea 
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            rows={3}
                            placeholder="What do you ride? Where do you go?"
                            value={newDesc}
                            onChange={(e) => setNewDesc(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                        <input 
                            type="checkbox" 
                            id="isPrivate" 
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="isPrivate" className="text-sm text-slate-300 cursor-pointer select-none">
                            Private Group (Require Code)
                        </label>
                    </div>
                    <button 
                        onClick={() => onCreateGroup(newName, newDesc, isPrivate)}
                        disabled={!newName}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                    >
                        <Plus size={16} /> Create New Group
                    </button>
                </div>
            )}
        </div>
        
        <div className="bg-slate-900/50 px-6 py-4 flex justify-center border-t border-slate-700">
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-sm font-medium">Cancel</button>
        </div>

      </div>
    </div>
  );
};

export default JoinGroupModal;