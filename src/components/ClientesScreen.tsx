import React, { useState } from 'react';
import { Client, Gender } from '../types/salon';
import { buildWhatsAppLink } from '../lib/constants';

interface ClientesScreenProps {
  clients: Client[];
  onSaveClient: (client: Partial<Client>) => Promise<Client>;
  onScheduleAppointmentForClient: (client: Client) => void;
  onOpenWhatsAppModal: (clientName: string, phone: string, message: string, service?: string) => void;
}

export const ClientesScreen: React.FC<ClientesScreenProps> = ({
  clients,
  onSaveClient,
  onScheduleAppointmentForClient,
  onOpenWhatsAppModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'female' | 'male' | 'allergies'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formGender, setFormGender] = useState<Gender>('female');
  const [formNotes, setFormNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const openNewModal = () => {
    setEditingClient(null);
    setFormName('');
    setFormPhone('');
    setFormGender('female');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setFormName(client.name);
    setFormPhone(client.phone.replace('+57', '').trim());
    setFormGender(client.gender);
    setFormNotes(client.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setIsSaving(true);
    try {
      const fullPhone = formPhone.startsWith('+') ? formPhone : `+57 ${formPhone.trim()}`;
      await onSaveClient({
        id: editingClient?.id,
        name: formName.trim(),
        gender: formGender,
        phone: fullPhone,
        notes: formNotes.trim(),
        has_allergies: formNotes.toLowerCase().includes('alergia')
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      (c.notes && c.notes.toLowerCase().includes(q));

    if (!matchesQuery) return false;

    if (filterType === 'female') return c.gender === 'female';
    if (filterType === 'male') return c.gender === 'male';
    if (filterType === 'allergies') {
      return c.has_allergies || (c.notes && c.notes.toLowerCase().includes('alergia'));
    }
    return true;
  });

  const femaleCount = clients.filter((c) => c.gender === 'female').length;
  const maleCount = clients.filter((c) => c.gender === 'male').length;
  const allergiesCount = clients.filter(
    (c) => c.has_allergies || (c.notes && c.notes.toLowerCase().includes('alergia'))
  ).length;

  return (
    <div className="flex flex-col w-full max-w-[430px] mx-auto px-4 pb-28 pt-2 space-y-4">
      {/* Screen Title & Mini Stats Summary */}
      <div className="flex items-end justify-between pt-1">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7e5713] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#a62c5a] inline-block animate-pulse" />
            Directorio VIP
          </span>
          <h2 className="text-[22px] font-extrabold text-[#23191d] tracking-tight">
            Clientes &amp; Fichas
          </h2>
        </div>
        <div className="flex items-center gap-1.5 bg-[#fff0f3] px-3 py-1.5 rounded-full border border-[#ffd9e1] shadow-xs">
          <span className="material-symbols-outlined text-[17px] text-[#006b2e] material-symbols-fill">
            spa
          </span>
          <span className="text-[12px] font-bold text-[#23191d]">{clients.length} Registrados</span>
        </div>
      </div>

      {/* Quick Search Bar */}
      <div className="relative w-full">
        <div className="flex items-center bg-white/90 backdrop-blur-md rounded-full border border-white/90 shadow-xs px-4 py-2.5 focus-within:shadow-[0_4px_20px_rgba(166,44,90,0.15)] focus-within:bg-white transition-all">
          <span className="material-symbols-outlined text-[#897176] text-[20px] mr-2">
            search
          </span>
          <input
            type="text"
            id="client-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, teléfono o nota..."
            className="w-full bg-transparent border-none outline-none text-[13px] text-[#23191d] placeholder:text-[#897176]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#897176] hover:text-[#a62c5a] p-1"
              aria-label="Limpiar búsqueda"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips Horizontal Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setFilterType('all')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all active:scale-95 border ${
            filterType === 'all'
              ? 'bg-[#a62c5a] text-white border-[#a62c5a] shadow-[0_4px_12px_rgba(166,44,90,0.25)]'
              : 'bg-white text-[#564146] border-white shadow-xs hover:bg-[#fff0f3]'
          }`}
        >
          <span>Todos</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              filterType === 'all' ? 'bg-white/20 text-white' : 'bg-[#fff0f3] text-[#a62c5a]'
            }`}
          >
            {clients.length}
          </span>
        </button>

        <button
          onClick={() => setFilterType('female')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all active:scale-95 border ${
            filterType === 'female'
              ? 'bg-[#a62c5a] text-white border-[#a62c5a] shadow-[0_4px_12px_rgba(166,44,90,0.25)]'
              : 'bg-white text-[#564146] border-white shadow-xs hover:bg-[#fff0f3]'
          }`}
        >
          <span className="text-[#a62c5a] font-bold">♀</span>
          <span>Mujeres</span>
          <span className="bg-[#fff0f3] text-[#564146] px-1.5 py-0.2 rounded-full text-[10px]">
            {femaleCount}
          </span>
        </button>

        <button
          onClick={() => setFilterType('male')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all active:scale-95 border ${
            filterType === 'male'
              ? 'bg-[#7e5713] text-white border-[#7e5713] shadow-[0_4px_12px_rgba(126,87,19,0.25)]'
              : 'bg-white text-[#564146] border-white shadow-xs hover:bg-[#fff0f3]'
          }`}
        >
          <span className="text-[#7e5713] font-bold">♂</span>
          <span>Hombres</span>
          <span className="bg-[#fff0f3] text-[#564146] px-1.5 py-0.2 rounded-full text-[10px]">
            {maleCount}
          </span>
        </button>

        <button
          onClick={() => setFilterType('allergies')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all active:scale-95 border ${
            filterType === 'allergies'
              ? 'bg-[#a62c5a] text-white border-[#a62c5a] shadow-[0_4px_12px_rgba(166,44,90,0.25)]'
              : 'bg-white text-[#564146] border-white shadow-xs hover:bg-[#fff0f3]'
          }`}
        >
          <span className="material-symbols-outlined text-[15px] text-[#006b2e]">
            medical_information
          </span>
          <span>Con Alergias/Notas</span>
          <span className="bg-[#fec97b]/50 text-[#78520e] px-1.5 py-0.2 rounded-full text-[10px]">
            {allergiesCount}
          </span>
        </button>
      </div>

      {/* Directory Cards List */}
      <div className="flex flex-col gap-3">
        {filteredClients.length === 0 ? (
          <div className="bg-white/80 rounded-3xl p-6 text-center border border-white flex flex-col items-center">
            <span className="material-symbols-outlined text-[36px] text-[#897176] mb-2">
              person_search
            </span>
            <p className="text-[14px] font-bold text-[#23191d]">No se encontraron clientes</p>
            <p className="text-[12px] text-[#897176] mt-1 mb-3">
              Prueba buscando con otro término o agrega una nueva ficha VIP.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
              }}
              className="px-4 py-2 rounded-full bg-[#fff0f3] text-[#a62c5a] text-[12px] font-bold"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          filteredClients.map((client) => {
            const isMale = client.gender === 'male';
            const hasAllergies =
              client.has_allergies || (client.notes && client.notes.toLowerCase().includes('alergia'));

            return (
              <article
                key={client.id}
                className="bg-white/90 backdrop-blur-md rounded-3xl p-4 border border-white/90 shadow-[0_6px_22px_rgba(166,44,90,0.06)] flex flex-col gap-3 transition-transform active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#ffd9e1] shrink-0 shadow-inner border border-white">
                      <img
                        src={
                          client.avatar_url ||
                          (isMale
                            ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvVXUcV0SDQdiVjFAE1hasw8115EKJCc9THwhnsZeIj69SvKA2P82l8CLjtQc-rtrK_3zvM_6DTHsmjuzu99g_Kigfo18nzJy7doRM2l0n8LiEyPzFXZklRAW6Ti9Tvdo3-59goZkmcGamEnXoOxn7qDvjF3tjT98eS18G_RY23kv7LFLsaxC_2bRphJqh3PCxc74JxB-LA-nM_nSTs-ZTWvbzyg5HGbvL7_dMZFXO6ZY_3kEOM0w'
                            : 'https://lh3.googleusercontent.com/aida-public/AB6AXuCusAhcY-OatDXFXqXzGeThUWMblIJySXU2Wl96s7CALot2SiaKTKoJAdl1cQNOIGL3YR9lgDY2EeGlKugPBvaipBB8StJmu-0uRth9PIxhis8RQMn_p9uLafP-4RXChDmq3HTulOG1FTZIIu_0KbXSf4Pw2hMwBzTLpVOebNUdEAbIM6FXdTlb3OLDoOoZXrjtKWsJupodLfDLeu71TGxs78AN68LjRxt-tTTJDvrq5kWQFIj4SI0')
                        }
                        alt={client.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[16px] font-bold text-[#23191d] truncate">
                          {client.name}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isMale
                              ? 'bg-[#fec97b]/50 text-[#78520e]'
                              : 'bg-[#ffd9e1] text-[#891345]'
                          }`}
                        >
                          <span>{isMale ? '♂' : '♀'}</span>
                          <span>{isMale ? 'Masculino' : 'Femenino'}</span>
                        </span>
                      </div>
                      <p className="text-[12px] text-[#564146] flex items-center gap-1 mt-0.5 font-medium">
                        <span className="material-symbols-outlined text-[15px] text-[#7e5713]">
                          phone_iphone
                        </span>
                        <span>{client.phone}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {/* WhatsApp */}
                    <button
                      onClick={() => {
                        const msg = isMale
                          ? `Estimado ${client.name}, le saludamos de Nails & Style Lizeth Jhoana ✨`
                          : `¡Hola ${client.name}! Te saludamos de Nails & Style Lizeth Jhoana 💅✨`;
                        onOpenWhatsAppModal(client.name, client.phone, msg);
                      }}
                      className="w-9 h-9 rounded-full bg-[#006b2e]/10 text-[#006b2e] hover:bg-[#006b2e] hover:text-white flex items-center justify-center transition-all shadow-xs active:scale-95"
                      title="Enviar WhatsApp"
                      aria-label={`Enviar WhatsApp a ${client.name}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                    </button>

                    {/* Schedule */}
                    <button
                      onClick={() => onScheduleAppointmentForClient(client)}
                      className="w-9 h-9 rounded-full bg-[#fff0f3] text-[#a62c5a] hover:bg-[#a62c5a] hover:text-white flex items-center justify-center transition-all shadow-xs active:scale-95 border border-[#ffd9e1]"
                      title="Agendar Cita"
                      aria-label={`Agendar cita para ${client.name}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">event_available</span>
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(client)}
                      className="w-9 h-9 rounded-full bg-[#fff0f3] text-[#564146] hover:bg-[#ffd9e1] flex items-center justify-center transition-all active:scale-95 border border-[#ffd9e1]"
                      title="Editar Ficha"
                      aria-label={`Editar ficha de ${client.name}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                  </div>
                </div>

                {/* Service History */}
                <div className="bg-[#fff0f3]/70 rounded-2xl px-3 py-2 flex items-center justify-between border border-[#ffd9e1]/70">
                  <div className="flex items-center gap-1.5 text-[#564146] text-[11px]">
                    <span className="material-symbols-outlined text-[16px] text-[#a62c5a]">
                      history
                    </span>
                    <span>
                      Último:{' '}
                      <strong className="text-[#23191d]">
                        {client.last_service_date || '22-09-2026'}
                      </strong>
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-[11px] font-bold text-[#a62c5a] shadow-2xs border border-[#ffd9e1]">
                    {client.last_service_name || 'Semipermanente'}
                  </span>
                </div>

                {/* Clinical Notes / Allergies / Preferences */}
                {client.notes && (
                  <div
                    className={`rounded-2xl p-2.5 flex items-start gap-2 border ${
                      hasAllergies
                        ? 'bg-[#ffdad6]/40 border-[#ffdad6]'
                        : 'bg-[#fff0f3]/40 border-[#ffd9e1]'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] shrink-0 mt-0.5 ${
                        hasAllergies ? 'text-[#ba1a1a]' : 'text-[#7e5713]'
                      }`}
                    >
                      {hasAllergies ? 'warning' : 'content_cut'}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span
                        className={`text-[11px] font-bold ${
                          hasAllergies ? 'text-[#ba1a1a]' : 'text-[#7e5713]'
                        }`}
                      >
                        {hasAllergies ? 'Nota clínica & estilo:' : 'Preferencia de servicio:'}
                      </span>
                      <p className="text-[12px] text-[#23191d] leading-snug mt-0.5">
                        {client.notes}
                      </p>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* Floating CTA Trigger */}
      <div className="pt-2 flex justify-center">
        <button
          type="button"
          onClick={openNewModal}
          className="w-full max-w-xs flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#a62c5a] via-[#c64673] to-[#7e5713] text-white text-[14px] font-bold shadow-[0_10px_26px_rgba(166,44,90,0.32)] active:scale-98 hover:brightness-105 transition-all"
        >
          <span className="material-symbols-outlined text-[22px]">person_add</span>
          <span>+ Nuevo Cliente VIP</span>
        </button>
      </div>

      {/* Modal Sheet: Registro / Edición de Cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#23191d]/40 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white p-5 flex flex-col gap-4 max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-bottom">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#ffd9e1] flex items-center justify-center text-[#a62c5a]">
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#23191d]">
                    {editingClient ? 'Editar Ficha de Cliente' : 'Registrar Cliente VIP'}
                  </h3>
                  <span className="text-[11px] text-[#897176]">
                    Sincronización con base de datos
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#fff0f3] flex items-center justify-center text-[#564146]"
                aria-label="Cerrar modal"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#564146] mb-1 block">
                  Nombre Completo
                </label>
                <div className="flex items-center bg-[#fff0f3] border border-[#ffd9e1] rounded-2xl px-3 py-2.5">
                  <span className="material-symbols-outlined text-[#a62c5a] text-[18px] mr-2">
                    person
                  </span>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ej. Carolina Mendoza"
                    className="w-full bg-transparent border-none outline-none text-[13px] text-[#23191d]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#564146] mb-1 block">
                  Teléfono / WhatsApp Móvil
                </label>
                <div className="flex items-center bg-[#fff0f3] border border-[#ffd9e1] rounded-2xl px-3 py-2.5">
                  <span className="material-symbols-outlined text-[#006b2e] text-[18px] mr-2">
                    chat
                  </span>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="300 000 0000"
                    className="w-full bg-transparent border-none outline-none text-[13px] text-[#23191d]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#564146] mb-1 block">
                  Tratamiento por Género (WhatsApp TRD)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormGender('female')}
                    className={`p-2.5 rounded-2xl text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all border ${
                      formGender === 'female'
                        ? 'bg-[#a62c5a] text-white border-[#a62c5a] shadow-xs'
                        : 'bg-[#fff0f3] text-[#564146] border-[#ffd9e1]'
                    }`}
                  >
                    <span>♀</span>
                    <span>Femenino</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormGender('male')}
                    className={`p-2.5 rounded-2xl text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all border ${
                      formGender === 'male'
                        ? 'bg-[#7e5713] text-white border-[#7e5713] shadow-xs'
                        : 'bg-[#fff0f3] text-[#564146] border-[#ffd9e1]'
                    }`}
                  >
                    <span>♂</span>
                    <span>Masculino</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#564146] mb-1 block">
                  Notas de Alergias &amp; Preferencias de Estilo
                </label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Alergia a químicos, esmaltado preferido, tono de piel, etc."
                  className="w-full p-3 bg-[#fff0f3] border border-[#ffd9e1] rounded-2xl text-[12px] text-[#23191d] outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-full text-[13px] font-semibold text-[#564146] hover:bg-[#fff0f3]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-full bg-[#a62c5a] hover:bg-[#891345] text-white text-[13px] font-bold shadow-[0_4px_16px_rgba(166,44,90,0.3)] flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[17px]">check</span>
                  <span>{isSaving ? 'Guardando...' : 'Guardar Ficha'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
