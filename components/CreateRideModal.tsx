import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { RideLevel, Ride, TerrainType } from '../types';
import { generateRideAI } from '../services/geminiService';

interface CreateRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (ride: Omit<Ride, 'id' | 'currentRiders' | 'routeImage' | 'groupId'>) => void;
  currentUser: string;
}

const CreateRideModal: React.FC<CreateRideModalProps> = ({ isOpen, onClose, onCreate, currentUser }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    distance: 120,
    elevation: 2500,
    level: RideLevel.C,
    terrain: 'Highway' as TerrainType,
    maxRiders: 15,
    marshallName: '',
    tailName: '',
    description: '',
  });

  if (!isOpen) return null;

  const handleGenerateAI = async () => {
    if (!formData.title) return;
    setLoading(true);
    const result = await generateRideAI(formData.title, formData.level, formData.distance, formData.elevation, formData.terrain);
    setFormData(prev => ({
      ...prev,
      description: result.description + (result.tips ? `\n\n💡 Tip: ${result.tips}` : '')
    }));
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      ...formData,
      minPoints: formData.level === RideLevel.A ? 2000 : formData.level === RideLevel.B ? 1500 : formData.level === RideLevel.C ? 800 : 0,
      leaderName: currentUser,
      marshallName: formData.marshallName || undefined,
      tailName: formData.tailName || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl w-full max-w-lg border border-slate-700 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Post a New Ride</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="create-ride-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Ride Title</label>
              <input
                type="text"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g. Sunday Canyon Carver"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">KSU Time</label>
                <input
                  type="time"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Distance (mi)</label>
                <input
                  type="number"
                  min="1"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.distance}
                  onChange={e => setFormData({ ...formData, distance: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Elevation (ft)</label>
                <input
                  type="number"
                  min="0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.elevation}
                  onChange={e => setFormData({ ...formData, elevation: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Riding Pace</label>
                <select
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.level}
                  onChange={e => setFormData({ ...formData, level: e.target.value as RideLevel })}
                >
                  <option value={RideLevel.A}>Level A (Sport/Aggr.)</option>
                  <option value={RideLevel.B}>Level B (Sport Touring)</option>
                  <option value={RideLevel.C}>Level C (Cruiser)</option>
                  <option value={RideLevel.D}>Level D (Relaxed)</option>
                </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Terrain</label>
                  <select
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.terrain}
                    onChange={e => setFormData({ ...formData, terrain: e.target.value as TerrainType })}
                  >
                    <option value="Urban">Urban</option>
                    <option value="Highway">Highway</option>
                    <option value="Mountains">Mountains/Canyons</option>
                    <option value="Trail">Trail/Offroad</option>
                    <option value="Beach">Beach/Coastal</option>
                  </select>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Road Captain</label>
                  <div className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-slate-400 text-sm italic">
                    {currentUser}
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Max Bikes</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.maxRiders}
                    onChange={e => setFormData({ ...formData, maxRiders: Number(e.target.value) })}
                  />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Marshall (Optional)</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-slate-600"
                    placeholder="Name"
                    value={formData.marshallName}
                    onChange={e => setFormData({ ...formData, marshallName: e.target.value })}
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Sweep/Tail (Optional)</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-slate-600"
                    placeholder="Name"
                    value={formData.tailName}
                    onChange={e => setFormData({ ...formData, tailName: e.target.value })}
                  />
               </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-300">Ride Description</label>
                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={loading || !formData.title}
                  className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  Auto-Write with AI
                </button>
              </div>
              <textarea
                required
                rows={4}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Describe the route, stops, road conditions..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-sm font-medium">Cancel</button>
          <button 
            type="submit" 
            form="create-ride-form"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-900/20 text-sm"
          >
            Post Ride
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRideModal;