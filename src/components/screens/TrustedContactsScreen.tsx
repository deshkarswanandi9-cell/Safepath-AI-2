import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Users, 
  UserPlus, 
  Trash2, 
  Share2, 
  Phone, 
  Radio, 
  BatteryMedium, 
  CheckCircle2, 
  Plus, 
  ShieldCheck,
  X
} from 'lucide-react';
import { ScreenId, TrustedContact } from '../../types';
import { MOCK_CONTACTS } from '../../data/mockData';

interface TrustedContactsScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const TrustedContactsScreen: React.FC<TrustedContactsScreenProps> = ({ onNavigate }) => {
  const [contacts, setContacts] = useState<TrustedContact[]>(MOCK_CONTACTS);
  const [isJourneyShared, setIsJourneyShared] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Toggle individual contact live location sharing
  const toggleContactSharing = (id: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isLiveSharing: !c.isLiveSharing } : c))
    );
  };

  // Remove contact
  const removeContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  // Add contact
  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;
    const newEntry: TrustedContact = {
      id: `c_${Date.now()}`,
      name: newName,
      relation: newRelation || 'Friend',
      phone: newPhone,
      isLiveSharing: true,
      batteryLevel: 90,
      status: 'Active guardian'
    };
    setContacts([...contacts, newEntry]);
    setNewName('');
    setNewRelation('');
    setNewPhone('');
    setShowAddModal(false);
  };

  return (
    <div className="relative min-h-[640px] h-full flex flex-col justify-between bg-[#F8FAFC] overflow-y-auto no-scrollbar p-4 pb-28">
      {/* Top Header */}
      <div>
        <div className="pt-2 flex items-center justify-between mb-4">
          <button
            id="btn-contacts-back"
            onClick={() => onNavigate('dashboard')}
            className="p-2 rounded-2xl bg-white shadow-sm border border-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Guardian Network</span>
          </div>
          <button
            id="btn-add-contact-open"
            onClick={() => setShowAddModal(true)}
            className="p-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors"
            title="Add Contact"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <div className="mb-4">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Trusted Contacts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            People who receive automated check-in notifications and live route updates.
          </p>
        </div>

        {/* Global Share Journey & Live Location Card */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/20 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Radio className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-white">Share Journey Globally</h3>
                <p className="text-[10px] text-blue-100 mt-0.5">
                  Streams coordinates during night transit
                </p>
              </div>
            </div>

            {/* Live Location Toggle */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="toggle-global-share"
                type="checkbox"
                checked={isJourneyShared}
                onChange={(e) => setIsJourneyShared(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-blue-400/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-400"></div>
            </label>
          </div>
        </div>

        {/* Trusted Contact List (Mother, Friend, Sister - Prompt Requirement) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Verified Guardians ({contacts.length})
            </span>
            <span className="text-[11px] font-bold text-blue-600">SMS + Push Alert</span>
          </div>

          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-3.5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:border-slate-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-100 to-blue-100 text-purple-700 flex items-center justify-center font-black text-sm border border-purple-200">
                  {contact.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-extrabold text-slate-900">{contact.name}</h4>
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[9px] font-bold">
                      {contact.relation}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">{contact.phone}</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <BatteryMedium className="w-3 h-3 text-emerald-500" />
                      {contact.batteryLevel}%
                    </span>
                    <span>•</span>
                    <span className="text-emerald-600 font-medium">{contact.status}</span>
                  </div>
                </div>
              </div>

              {/* Contact Actions: Live Location Toggle & Call/Remove */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleContactSharing(contact.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-colors ${
                    contact.isLiveSharing
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                  title="Toggle Live Sharing"
                >
                  {contact.isLiveSharing ? 'Live ON' : 'Paused'}
                </button>

                <a
                  href={`tel:${contact.phone}`}
                  className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                  title="Call Contact"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => removeContact(contact.id)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Remove Contact"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xs rounded-3xl bg-white p-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-slate-900">Add Trusted Contact</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Partner, Roommate"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Relation</label>
                <input
                  type="text"
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value)}
                  placeholder="e.g. Guardian, Colleague"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Phone Number</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Journey Action Button */}
      <div className="pt-4">
        <button
          id="btn-share-journey-cta"
          onClick={() => alert('Live trip link sent to Mother, Friend, and Sister via SMS and WhatsApp.')}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-xl shadow-blue-500/25 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Broadcast Journey Link to Guardians</span>
        </button>
      </div>
    </div>
  );
};
