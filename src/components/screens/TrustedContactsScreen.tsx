import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Users, 
  Trash2, 
  Phone, 
  Plus, 
  ShieldCheck, 
  BatteryMedium,
  Check,
  X
} from 'lucide-react';
import { ScreenId, TrustedContact } from '../../types';
import { MOCK_CONTACTS } from '../../data/mockData';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Switch } from '../ui/Switch';

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

  const toggleContactSharing = (id: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isLiveSharing: !c.isLiveSharing } : c))
    );
  };

  const removeContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

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
    <div className="relative h-full flex flex-col justify-between bg-white dark:bg-black text-black dark:text-white select-none transition-colors overflow-y-auto no-scrollbar p-4 pb-20">
      <div>
        {/* Header */}
        <div className="pt-1 flex items-center justify-between mb-3">
          <button
            id="btn-contacts-back"
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
            Guardian Network
          </span>
          <button
            id="btn-add-contact-open"
            type="button"
            onClick={() => setShowAddModal(true)}
            className="p-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black transition-colors cursor-pointer"
            title="Add Contact"
            aria-label="Add New Contact"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <div className="mb-3">
          <h1 className="text-base font-black tracking-tight text-black dark:text-white">
            Trusted Contacts
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Guardians who receive automated check-in notifications and live route updates.
          </p>
        </div>

        {/* Global Live Location Toggle Card */}
        <Card variant="subtle" padding="sm" className="mb-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-black dark:text-white">Share Live Journey</div>
              <div className="text-[10px] text-neutral-500">Transmit real-time telemetry to guardians</div>
            </div>
            <Switch
              id="switch-journey-share"
              checked={isJourneyShared}
              onChange={setIsJourneyShared}
            />
          </div>
        </Card>

        {/* Contact List */}
        <div className="space-y-2">
          {contacts.map((contact) => (
            <Card key={contact.id} variant="default" padding="sm" className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center font-black text-xs text-black dark:text-white">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-black dark:text-white">{contact.name}</h3>
                    <div className="text-[10px] text-neutral-500 flex items-center gap-1.5">
                      <span>{contact.relation}</span>
                      <span>•</span>
                      <span>{contact.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${contact.phone}`}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                    title={`Call ${contact.name}`}
                    aria-label={`Call ${contact.name}`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => removeContact(contact.id)}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                    title="Remove Contact"
                    aria-label={`Remove ${contact.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Status and individual sharing switch */}
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 text-neutral-500">
                  <BatteryMedium className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Battery {contact.batteryLevel}%</span>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{contact.status}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">Telemetry</span>
                  <Switch
                    checked={contact.isLiveSharing}
                    onChange={() => toggleContactSharing(contact.id)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Contact Modal Dialog (Bounded) */}
      {showAddModal && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xs rounded-2xl bg-white dark:bg-black text-black dark:text-white p-4 border border-neutral-300 dark:border-neutral-800 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
                Add Guardian Contact
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-neutral-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-2.5">
              <Input
                label="Full Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                required
              />

              <Input
                label="Relationship"
                value={newRelation}
                onChange={(e) => setNewRelation(e.target.value)}
                placeholder="e.g. Sister / Mother / Roommate"
              />

              <Input
                label="Phone Number"
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                required
              />

              <div className="pt-2 flex gap-2">
                <Button type="submit" variant="primary" fullWidth size="md">
                  Save Contact
                </Button>
                <Button type="button" variant="outline" size="md" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
