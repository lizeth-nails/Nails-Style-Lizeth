import React, { useState, useEffect } from 'react';
import { Client, ServiceItem, Appointment, Gender } from '../types/salon';
import { SERVICES, buildWhatsAppLink } from '../lib/constants';
import { supabase } from '../lib/supabase';

interface NuevaCitaScreenProps {
  clients: Client[];
  appointments?: Appointment[];
  initialDate?: string;
  onSaveAppointment: (appt: Partial<Appointment>, newClientData?: Partial<Client>) => Promise<Appointment>;
  onCancel: () => void;
}

const getTodayIso = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const formatDisplayDateSpanish = (isoDate: string): string => {
  if (!isoDate) return '';
  try {
    const parts = isoDate.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      const dateObj = new Date(y, m - 1, d);
      const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const todayIso = getTodayIso();
      const isToday = isoDate === todayIso;
      return `${isToday ? 'Hoy - ' : ''}${days[dateObj.getDay()], d} ${months[dateObj.getMonth()]} ${y}`;
    }
    return isoDate;
  } catch {
    return isoDate;
  }
};

const MORNING_SLOTS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'
];

const AFTERNOON_SLOTS = [
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM'
];

const EVENING_SLOTS = [
  '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
  '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM'
];

const ALL_DAY_SLOTS = [...MORNING_SLOTS, ...AFTERNOON_SLOTS, ...EVENING_SLOTS];

type DayPeriodFilter = 'todos' | 'manana' | 'tarde' | 'noche' | 'personalizado';

export const NuevaCitaScreen: React.FC<NuevaCitaScreenProps> = ({
  clients: initialClients = [],
  appointments = [],
  initialDate,
  onSaveAppointment,
  onCancel
}) => {
  const [clientsList, setClientsList] = useState<Client[]>(initialClients);
  const [selectedClientId, setSelectedClientId] = useState<string>('custom');
  const [isQuickClientOpen, setIsQuickClientOpen] = useState<boolean>(true);

  // Quick Client form fields
  const [clientName, setClientName] = useState('');
  const [clientGender, setClientGender] = useState<Gender>('female');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');

  // Cargar clientes directamente desde Supabase al abrir la pantalla para asegurar sincronización en tiempo real
  useEffect(() => {
    const fetchSupabaseClients = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          // Combinamos los props y los de Supabase sin duplicados
          setClientsList(data);
        }
      } catch (err) {
        console.error('Error al sincronizar clientes en nueva cita:', err);
      }
    };
    fetchSupabaseClients();
  }, []);

  // Service Selection
  const [selectedServiceId, setSelectedServiceId] = useState<'semi' | 'trad' | 'care'>('semi');

  // Date and Time selection
  const [selectedDate, setSelectedDate] = useState(() => initialDate || getTodayIso());

  React.useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
    }
  }, [initialDate]);

  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [periodFilter, setPeriodFilter] = useState<DayPeriodFilter>('todos');
  const [isAllDayUnfolded, setIsAllDayUnfolded] = useState(true);

  // Check if a time slot is already booked for the selected date
  const getSlotBookingInfo = (slotTime: string) => {
    if (!appointments || appointments.length === 0) return null;
    return appointments.find(
      (a) =>
        a.date === selectedDate &&
        a.time.trim().toLowerCase() === slotTime.trim().toLowerCase() &&
        a.status !== 'cancelled'
    );
  };

  const getTimePeriodInfo = (timeStr: string) => {
    if (timeStr.includes('AM')) {
      return { label: 'Mañana', icon: 'light_mode', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    }
    const hour = parseInt(timeStr.split(':')[0], 10);
    if (hour === 12 || (hour >= 1 && hour < 5)) {
      return { label: 'Tarde', icon: 'sunny', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    }
    return { label: 'Noche', icon: 'bedtime', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
  };

  const [isSaving, setIsSaving] = useState(false);

  const currentService: ServiceItem =
    SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];

  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    try {
      const parts = startTime.trim().split(' ');
      if (parts.length < 2) return '';
      const [hStr, mStr] = parts[0].split(':');
      let h = parseInt(hStr, 10);
      const m = parseInt(mStr, 10);
      const period = parts[1];
      if (period === 'PM' && h < 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;

      const totalMinutes = h * 60 + m + durationMinutes;
      let endH = Math.floor(totalMinutes / 60) % 24;
      const endM = totalMinutes % 60;
      const endPeriod = endH >= 12 ? 'PM' : 'AM';
      endH = endH % 12;
      if (endH === 0) endH = 12;
      const endHFormatted = endH < 10 ? `0${endH}` : `${endH}`;
      const endMFormatted = endM < 10 ? `0${endM}` : `${endM}`;
      return `${endHFormatted}:${endMFormatted} ${endPeriod}`;
    } catch {
      return '';
    }
  };

  const displayName = clientName.trim() || 'Cliente';
  const firstName = displayName.split(' ')[0];
  const dynamicMessage =
    clientGender === 'female'
      ? `"¡Hola ${firstName}! ✨ Te recordamos tu cita de ${currentService.name} el ${selectedDate} a las ${selectedTime} en Nails & Style Lizeth Jhoana. ¡Te esperamos para consentirte! 💅💖"`
      : `"¡Hola ${firstName}! ✂️ Te recordamos tu cita de ${currentService.name} el ${selectedDate} a las ${selectedTime} en Nails & Style Lizeth Jhoana. ¡Te esperamos para atenderte! 💈✨"`;

  const handleClientSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedClientId(val);
    if (val !== 'custom') {
      const found = clientsList.find((c) => c.id === val);
      if (found) {
        setClientName(found.name);
        setClientGender(found.gender);
        setClientPhone(found.phone.replace('+57', '').trim());
        setClientNotes(found.notes || '');
      }
    }
  };

  const handleSaveOnly = async () => {
    if (!clientName.trim()) {
      alert('Por favor introduce el nombre del cliente');
      return;
    }
    setIsSaving(true);
    try {
      const fullPhone = clientPhone.startsWith('+') ? clientPhone : `+57 ${clientPhone.trim()}`;
      await onSaveAppointment(
        {
          client_name: clientName,
          client_gender: clientGender,
          client_phone: fullPhone,
          service_id: currentService.id,
          service_name: currentService.name,
          service_price: currentService.price_cop,
          date: selectedDate,
          time: selectedTime,
          duration_text: currentService.duration_text,
          notes: clientNotes,
          status: 'confirmed'
        },
        selectedClientId === 'custom'
          ? {
              name: clientName,
              gender: clientGender,
              phone: fullPhone,
              notes: clientNotes,
              has_allergies: clientNotes.toLowerCase().includes('alergia')
            }
          : undefined
      );

      onCancel();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[430px] mx-auto px-4 pb-28 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between py-2 mb-2">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onCancel}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#23191d] shadow-xs active:scale-95 transition-transform border border-white"
            title="Regresar a Agenda"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] font-bold text-[#23191d]">Nueva Cita</span>
              <span className="px-2 py-0.5 rounded-full bg-[#ffd9e1] text-[#891345] text-[10px] font-bold">
                SCR-02
              </span>
            </div>
            <span className="text-[12px] text-[#897176]">Agendamiento y Registro Rápido</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* 1. SECCIÓN CLIENTE */}
        <section className="bg-white/85 backdrop-blur-xl rounded-3xl p-4 border border-white/90 shadow-[0_4px_20px_rgba(224,90,135,0.06)] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#a62c5a]">
              <span className="material-symbols-outlined text-[20px]">person_pin</span>
              <h2 className="text-[15px] font-bold text-[#23191d]">Información de Cliente</h2>
            </div>
            <span className="text-[11px] text-[#7e5713] font-bold uppercase tracking-wider">
              Paso 1 de 3
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#564146]">
              Seleccionar Cliente Registrado
            </label>
            <div className="relative">
              <select
                value={selectedClientId}
                onChange={handleClientSelectChange}
                className="w-full h-12 pl-10 pr-9 bg-[#fff0f3]/70 border border-[#ffd9e1] rounded-2xl text-[13px] text-[#23191d] focus:outline-none focus:bg-white transition-colors appearance-none shadow-xs font-medium"
              >
                <option value="custom">Buscar o seleccionar otro cliente...</option>
                {clientsList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute left-3 top-3 text-[20px] text-[#a62c5a] pointer-events-none">
                search
              </span>
              <span className="material-symbols-outlined absolute right-3 top-3 text-[20px] text-[#897176] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Formulario de Cliente Rápido */}
          <div className="p-3 bg-[#fff0f3]/50 rounded-2xl border border-[#ffd9e1]/70 flex flex-col gap-3 mt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#7e5713] font-bold uppercase tracking-wider">
                Datos del Cliente para la Cita
              </span>
              <span className="text-[11px] text-[#006b2e] font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                Sincronizado Supabase
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#564146]">Nombre y Apellido</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ej: Marcela Torres"
                className="w-full h-11 px-3 bg-white rounded-xl text-[13px] text-[#23191d] focus:outline-none border border-[#ffd9e1] shadow-xs font-medium"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#564146]">Género / Tratamiento</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setClientGender('female')}
                  className={`h-10 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1 ${
                    clientGender === 'female' ? 'bg-[#a62c5a] text-white' : 'bg-white text-[#564146] border border-[#ffd9e1]'
                  }`}
                >
                  Femenino (Ella ♀)
                </button>
                <button
                  type="button"
                  onClick={() => setClientGender('male')}
                  className={`h-10 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1 ${
                    clientGender === 'male' ? 'bg-[#7e5713] text-white' : 'bg-white text-[#564146] border border-[#ffd9e1]'
                  }`}
                >
                  Masculino (Él ♂)
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#564146]">WhatsApp Móvil</label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="315 789 4432"
                className="w-full h-11 px-3 bg-white border border-[#ffd9e1] rounded-xl text-[13px] text-[#23191d] focus:outline-none shadow-xs font-medium"
              />
            </div>
          </div>
        </section>

        {/* 2. SECCIÓN SERVICIO */}
        <section className="bg-white/85 backdrop-blur-xl rounded-3xl p-4 border border-white/90 shadow-[0_4px_20px_rgba(224,90,135,0.06)] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#a62c5a]">
              <span className="material-symbols-outlined text-[20px]">spa</span>
              <h2 className="text-[15px] font-bold text-[#23191d]">Servicio del Catálogo</h2>
            </div>
            <span className="text-[11px] text-[#7e5713] font-bold uppercase tracking-wider">
              Paso 2 de 3
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {SERVICES.map((srv) => {
              const isSelected = selectedServiceId === srv.id;
              return (
                <div
                  key={srv.id}
                  onClick={() => setSelectedServiceId(srv.id)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-[#c64673] text-white border-[#a62c5a] shadow-md'
                      : 'bg-[#fff0f3]/70 hover:bg-[#fff0f3] text-[#23191d] border-[#ffd9e1]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold">{srv.name}</span>
                    <span className="text-[14px] font-bold">{srv.price_formatted}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. SECCIÓN FECHA Y HORA */}
        <section className="bg-white/85 backdrop-blur-xl rounded-3xl p-4 border border-white/90 shadow-[0_4px_20px_rgba(224,90,135,0.06)] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#a62c5a]">
              <span className="material-symbols-outlined text-[20px]">calendar_clock</span>
              <h2 className="text-[15px] font-bold text-[#23191d]">Fecha y Hora</h2>
            </div>
            <span className="text-[11px] text-[#7e5713] font-bold uppercase tracking-wider">
              Paso 3 de 3
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-semibold text-[#564146]">Fecha de la Cita</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#ffd9e1] rounded-xl text-[13px] font-medium"
            />

            <label className="text-[12px] font-semibold text-[#564146] mt-2">Hora de la Sesión</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#ffd9e1] rounded-xl text-[13px] font-medium"
            >
              {ALL_DAY_SLOTS.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Botón de Guardar */}
        <button
          type="button"
          disabled={isSaving}
          onClick={handleSaveOnly}
          className="w-full py-3.5 bg-gradient-to-r from-[#a62c5a] to-[#c64673] text-white font-bold rounded-2xl shadow-md hover:opacity-95 transition-all text-sm uppercase tracking-wider"
        >
          {isSaving ? 'Guardando Cita...' : 'Confirmar y Guardar Cita'}
        </button>
      </div>
    </div>
  );
};
    
