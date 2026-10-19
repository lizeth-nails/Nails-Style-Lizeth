import { useState, useEffect, useCallback } from 'react';
import { ActiveTab, Client, Appointment, SmartReminder } from './types/salon';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { PinScreen } from './components/PinScreen';
import { AgendaScreen } from './components/AgendaScreen';
import { NuevaCitaScreen } from './components/NuevaCitaScreen';
import { AvisosScreen } from './components/AvisosScreen';
import { ClientesScreen } from './components/ClientesScreen';
import { WhatsAppPreviewModal } from './components/WhatsAppPreviewModal';
import { SupabaseModal } from './components/SupabaseModal';
import {
  getClients,
  getAppointments,
  getReminders,
  createAppointment,
  deleteAppointment,
  createOrUpdateClient,
  seedAllDataToSupabase
} from './lib/supabase';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('agenda');

  // Salon Data States (Direct from Supabase)
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reminders, setReminders] = useState<SmartReminder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [needsSqlInit, setNeedsSqlInit] = useState<boolean>(false);
  const [isAutoSeeding, setIsAutoSeeding] = useState<boolean>(false);
  const [selectedDateForNewAppt, setSelectedDateForNewAppt] = useState<string>('');

  // Modals
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);
  const [whatsAppModal, setWhatsAppModal] = useState<{
    isOpen: boolean;
    clientName: string;
    clientPhone: string;
    defaultMessage: string;
    serviceName?: string;
  }>({
    isOpen: false,
    clientName: '',
    clientPhone: '',
    defaultMessage: '',
    serviceName: ''
  });

  // Load Data on Startup directly from Supabase
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [clientRes, apptRes, remRes] = await Promise.all([
        getClients(),
        getAppointments(),
        getReminders()
      ]);

      if (clientRes.source === 'needs_sql' || apptRes.source === 'needs_sql') {
        setNeedsSqlInit(true);
      } else {
        setNeedsSqlInit(false);
      }

      setClients(clientRes.data);
      setAppointments(apptRes.data);
      setReminders(remRes.data);
    } catch (e) {
      console.warn('Error cargando datos desde Supabase:', e);
      setNeedsSqlInit(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Quick Seed directly into Supabase
  const handleQuickSeed = async () => {
    setIsAutoSeeding(true);
    const res = await seedAllDataToSupabase();
    setIsAutoSeeding(false);
    if (res.success) {
      setNeedsSqlInit(false);
      await loadData();
    } else {
      // Open modal so user can copy SQL
      setIsSupabaseModalOpen(true);
    }
  };

  // Appointment saving to Supabase
  const handleSaveAppointment = async (
    apptData: Partial<Appointment>,
    newClientData?: Partial<Client>
  ) => {
    if (newClientData) {
      const savedClient = await createOrUpdateClient(newClientData);
      setClients((prev) => [savedClient, ...prev.filter((c) => c.id !== savedClient.id)]);
      apptData.client_id = savedClient.id;
    }

    const created = await createAppointment(apptData);
    setAppointments((prev) => [...prev, created]);
    setActiveTab('agenda');
    return created;
  };

  // Appointment deletion from Supabase
  const handleDeleteAppointment = async (id: string) => {
    const success = await deleteAppointment(id);
    if (success) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    }
  };

  // Client saving to Supabase
  const handleSaveClient = async (clientData: Partial<Client>) => {
    const saved = await createOrUpdateClient(clientData);
    setClients((prev) => {
      const idx = prev.findIndex((c) => c.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    return saved;
  };

  // Direct Schedule from Client Directory
  const handleScheduleAppointmentForClient = () => {
    setActiveTab('nueva-cita');
  };

  // WhatsApp Trigger Helper
  const handleOpenWhatsAppModal = (
    clientName: string,
    phone: string,
    message: string,
    service?: string
  ) => {
    setWhatsAppModal({
      isOpen: true,
      clientName,
      clientPhone: phone,
      defaultMessage: message,
      serviceName: service
    });
  };

  // If locked with PIN (SCR-00)
  if (!isAuthenticated) {
    return <PinScreen onUnlock={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#fff8f8] text-[#23191d] flex flex-col font-sans selection:bg-[#ffd9e1] selection:text-[#a62c5a]">
      {/* Background ambient decorative blurs */}
      <div className="fixed -top-24 -left-20 w-80 h-80 bg-[#ffd9e1]/50 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed top-1/2 -right-24 w-80 h-80 bg-[#fec97b]/30 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed -bottom-24 left-1/4 w-96 h-96 bg-[#f6e3e9]/60 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Fixed Sticky Header */}
      <Header
        onOpenSupabaseConfig={() => setIsSupabaseModalOpen(true)}
        onLockPin={() => setIsAuthenticated(false)}
        pendingAlertsCount={reminders.length}
        onNavigateToAlerts={() => setActiveTab('recordatorios')}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-20 relative z-10">
        {/* Banner if tables need SQL execution in Supabase */}
        {needsSqlInit && (
          <div className="max-w-[430px] mx-auto px-4 pt-1 pb-2">
            <div className="bg-gradient-to-r from-[#fff0f3] to-[#fec97b]/40 border border-[#ffd9e1] rounded-3xl p-3.5 shadow-xs flex flex-col gap-2">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#a62c5a] text-[20px] shrink-0 mt-0.5">
                  database
                </span>
                <div className="flex flex-col">
                  <span className="text-[12px] font-bold text-[#23191d]">
                    Supabase conectado: Tablas pendientes en tu base de datos
                  </span>
                  <p className="text-[11px] text-[#564146] mt-0.5 leading-snug">
                    Tu proyecto <code className="text-[#a62c5a] font-mono">oliuhwirfnfatpfjuoox</code> está enlazado. Ejecuta el script SQL en Supabase o inicializa las 6 tablas con 1 clic.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={isAutoSeeding}
                  onClick={handleQuickSeed}
                  className="flex-1 h-9 rounded-full bg-[#a62c5a] hover:bg-[#891345] text-white text-[11px] font-bold shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">bolt</span>
                  <span>{isAutoSeeding ? 'Sembrando...' : 'Sembrar en Supabase (1 Clic)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSupabaseModalOpen(true)}
                  className="h-9 px-3 rounded-full bg-white border border-[#ffd9e1] text-[#7e5713] text-[11px] font-bold hover:bg-[#fff0f3] active:scale-95 transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">code</span>
                  <span>Ver SQL</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
            <div className="w-12 h-12 rounded-full border-3 border-[#ffd9e1] border-t-[#a62c5a] animate-spin" />
            <p className="text-[13px] font-semibold text-[#897176]">
              Consultando base de datos Supabase...
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'agenda' && (
              <AgendaScreen
                appointments={appointments}
                remindersCount={reminders.length}
                onOpenNewAppointment={(date?: string) => {
                  setSelectedDateForNewAppt(date || '');
                  setActiveTab('nueva-cita');
                }}
                onOpenWhatsAppModal={handleOpenWhatsAppModal}
                onDeleteAppointment={handleDeleteAppointment}
              />
            )}

            {activeTab === 'nueva-cita' && (
              <NuevaCitaScreen
                clients={clients}
                appointments={appointments}
                initialDate={selectedDateForNewAppt}
                onSaveAppointment={handleSaveAppointment}
                onCancel={() => setActiveTab('agenda')}
              />
            )}

            {activeTab === 'recordatorios' && (
              <AvisosScreen
                reminders={reminders}
                onOpenWhatsAppModal={handleOpenWhatsAppModal}
              />
            )}

            {activeTab === 'clientes' && (
              <ClientesScreen
                clients={clients}
                onSaveClient={handleSaveClient}
                onScheduleAppointmentForClient={handleScheduleAppointmentForClient}
                onOpenWhatsAppModal={handleOpenWhatsAppModal}
              />
            )}
          </>
        )}
      </main>

      {/* Fixed Frosted Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        pendingAlertsCount={reminders.length}
      />

      {/* WhatsApp Modal Sheet */}
      <WhatsAppPreviewModal
        isOpen={whatsAppModal.isOpen}
        onClose={() => setWhatsAppModal((prev) => ({ ...prev, isOpen: false }))}
        clientName={whatsAppModal.clientName}
        clientPhone={whatsAppModal.clientPhone}
        defaultMessage={whatsAppModal.defaultMessage}
        serviceName={whatsAppModal.serviceName}
      />

      {/* Supabase Connection & Schema Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConfigChanged={loadData}
      />
    </div>
  );
}
