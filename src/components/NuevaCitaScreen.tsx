import React, { useState } from 'react';
import { Client, ServiceItem, Appointment, Gender } from '../types/salon';
import { SERVICES_CATALOG, buildWhatsAppLink } from '../lib/constants';

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
      return `${isToday ? 'Hoy - ' : ''}${days[dateObj.getDay()]}, ${d} ${months[dateObj.getMonth()]} ${y}`;
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
  clients,
  appointments = [],
  initialDate,
  onSaveAppointment,
  onCancel
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>('custom');
  const [isQuickClientOpen, setIsQuickClientOpen] = useState<boolean>(true);

  // Quick Client form fields
  const [clientName, setClientName] = useState('Marcela Torres');
  const [clientGender, setClientGender] = useState<Gender>('female');
  const [clientPhone, setClientPhone] = useState('315 789 4432');
  const [clientNotes, setClientNotes] = useState(
    'Uñas frágiles, prefiere tonos nude y francesa sutil. Alergia leve a removedores con fragancia artificial.'
  );

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

  // Custom Time Picker inputs
  const [customHour, setCustomHour] = useState('10');
  const [customMinute, setCustomMinute] = useState('00');
  const [customMeridian, setCustomMeridian] = useState<'AM' | 'PM'>('AM');
  const [customNativeTime, setCustomNativeTime] = useState('10:00');

  // Custom dynamically added slots by user
  const [customAddedSlots, setCustomAddedSlots] = useState<string[]>([]);

  // Helper converter between 24h and 12h AM/PM
  const convert24To12 = (time24: string): string => {
    if (!time24) return '10:00 AM';
    const [hStr, mStr] = time24.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr || '00';
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    const hFormatted = h < 10 ? `0${h}` : `${h}`;
    return `${hFormatted}:${m} ${period}`;
  };

  const handleApplyCustomTime = (time12: string) => {
    setSelectedTime(time12);
    if (!ALL_DAY_SLOTS.includes(time12) && !customAddedSlots.includes(time12)) {
      setCustomAddedSlots((prev) => [time12, ...prev]);
    }
  };

  const handleApplyCustomWheelTime = () => {
    const formatted = `${customHour}:${customMinute} ${customMeridian}`;
    handleApplyCustomTime(formatted);
  };

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

  // Helper to determine the period label and colors
  const getTimePeriodInfo = (timeStr: string) => {
    if (timeStr.includes('AM')) {
      return {
        label: 'Mañana',
        icon: 'light_mode',
        color: 'text-amber-700 bg-amber-50 border-amber-200'
      };
    }
    const hour = parseInt(timeStr.split(':')[0], 10);
    if (hour === 12 || (hour >= 1 && hour < 5)) {
      return {
        label: 'Tarde',
        icon: 'sunny',
        color: 'text-orange-700 bg-orange-50 border-orange-200'
      };
    }
    return {
      label: 'Noche',
      icon: 'bedtime',
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200'
    };
  };

  // Loading and Feedback
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: ''
  });

  const currentService: ServiceItem =
    SERVICES_CATALOG.find((s) => s.id === selectedServiceId) || SERVICES_CATALOG[0];

  // Calculate estimated end time of the appointment
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

  // Dynamic reminder date calculation
  const calculateCycleReminderDate = () => {
    try {
      const baseDate = new Date(selectedDate);
      baseDate.setDate(baseDate.getDate() + currentService.cycle_days);
      const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      return `${baseDate.getDate()} de ${months[baseDate.getMonth()]}, ${baseDate.getFullYear()}`;
    } catch {
      return '17 de Octubre, 2026';
    }
  };

  // Preview WhatsApp text
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
      const found = clients.find((c) => c.id === val);
      if (found) {
        setClientName(found.name);
        setClientGender(found.gender);
        setClientPhone(found.phone.replace('+57', '').trim());
        setClientNotes(found.notes);
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

      setShowToast({ visible: true, message: '¡Cita Guardada en Agenda con Éxito!' });
      setTimeout(() => {
        onCancel();
      }, 1200);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndNotifyWA = async () => {
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

      // Open WhatsApp with direct prefilled template
      const rawText = dynamicMessage.replace(/^"|"$/g, '');
      const waUrl = buildWhatsAppLink(fullPhone, rawText);
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      setShowToast({ visible: true, message: '¡Cita Guardada y Abriendo WhatsApp!' });
      setTimeout(() => {
        onCancel();
      }, 1200);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[430px] mx-auto px-4 pb-28 pt-2">
      {/* Sub-Header / Back & Title Action Bar */}
      <div className="flex items-center justify-between py-2 mb-2">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onCancel}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#23191d] shadow-xs active:scale-95 transition-transform border border-white"
            title="Regresar a Agenda"
            aria-label="Regresar a la agenda"
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

        <div className="w-9 h-9 rounded-full bg-[#fff0f3] border border-[#ffd9e1] flex items-center justify-center text-[#a62c5a] shadow-xs">
          <span className="material-symbols-outlined text-[19px]">auto_awesome</span>
        </div>
      </div>

      {/* Form Flow Container */}
      <div className="flex flex-col gap-4">
        {/* 1. SECCIÓN CLIENTE */}
        <section className="bg-white/85 backdrop-blur-xl rounded-3xl p-4 border border-white/90 shadow-[0_4px_20px_rgba(224,90,135,0.06)] flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#a62c5a]">
              <span className="material-symbols-outlined text-[20px]">person_pin</span>
              <h2 className="text-[15px] font-bold text-[#23191d]">Información de Cliente</h2>
            </div>
            <span className="text-[11px] text-[#7e5713] font-bold uppercase tracking-wider">
              Paso 1 de 3
            </span>
          </div>

          {/* Client Selection Dropdown */}
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
                {clients.map((c) => (
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

          {/* Quick Client Registration Toggle Button */}
          <button
            type="button"
            onClick={() => setIsQuickClientOpen(!isQuickClientOpen)}
            className="w-full py-2.5 px-4 rounded-full bg-[#fce9ee] hover:bg-[#ffd9e1] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-[#a62c5a] text-[13px] font-bold shadow-xs border border-[#ffd9e1]"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>+ Crear Cliente Rápido</span>
            <span
              className={`material-symbols-outlined text-[18px] text-[#564146] transition-transform ${
                isQuickClientOpen ? 'rotate-180' : 'rotate-0'
              }`}
            >
              keyboard_arrow_down
            </span>
          </button>

          {/* Expandable Subform: Registrar Cliente Rápido */}
          {isQuickClientOpen && (
            <div className="p-3 bg-[#fff0f3]/50 rounded-2xl border border-[#ffd9e1]/70 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#7e5713] font-bold uppercase tracking-wider">
                  Nuevo Perfil de Cliente
                </span>
                <span className="text-[11px] text-[#006b2e] font-semibold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  Sincronizado
                </span>
              </div>

              {/* Nombre Completo */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#564146]">
                  Nombre y Apellido
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej: Marcela Torres"
                    className="w-full h-11 px-3 bg-white rounded-xl text-[13px] text-[#23191d] focus:outline-none border border-[#ffd9e1] shadow-xs font-medium"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-3 text-[18px] text-[#00873c]">
                    check_circle
                  </span>
                </div>
              </div>

              {/* Tratamiento por género */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#564146]">
                  Tratamiento para Mensajes Personalizados
                </label>
                <div className="grid grid-cols-2 gap-2" role="radiogroup">
                  <button
                    type="button"
                    onClick={() => setClientGender('female')}
                    className={`h-11 rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all ${
                      clientGender === 'female'
                        ? 'bg-[#a62c5a] text-white shadow-[0_4px_12px_rgba(166,44,90,0.3)]'
                        : 'bg-white text-[#564146] border border-[#ffd9e1] hover:bg-[#fff0f3]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">female</span>
                    <span>Femenino (Ella ♀)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setClientGender('male')}
                    className={`h-11 rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all ${
                      clientGender === 'male'
                        ? 'bg-[#7e5713] text-white shadow-[0_4px_12px_rgba(126,87,19,0.3)]'
                        : 'bg-white text-[#564146] border border-[#ffd9e1] hover:bg-[#fff0f3]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">male</span>
                    <span>Masculino (Él ♂)</span>
                  </button>
                </div>
              </div>

              {/* WhatsApp Móvil */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#564146]">
                  WhatsApp Móvil
                </label>
                <div className="flex gap-2">
                  <div className="h-11 px-3 bg-white border border-[#ffd9e1] rounded-xl flex items-center justify-center text-[#564146] text-[13px] font-bold shadow-xs select-none">
                    🇨🇴 +57
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="315 789 4432"
                      className="w-full h-11 pl-3 pr-9 bg-white border border-[#ffd9e1] rounded-xl text-[13px] text-[#23191d] focus:outline-none shadow-xs font-medium"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-3 text-[18px] text-[#00873c]">
                      chat
                    </span>
                  </div>
                </div>
              </div>

              {/* Notas & Sensibilidad */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-[#564146]">
                    Notas &amp; Sensibilidad
                  </label>
                  <span className="text-[11px] font-bold text-[#a62c5a]">Importante</span>
                </div>
                <textarea
                  rows={2}
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="Uñas frágiles, prefiere tonos nude, cutícula sensible..."
                  className="w-full p-2.5 bg-white border border-[#ffd9e1] rounded-xl text-[12px] text-[#23191d] focus:outline-none shadow-xs resize-none leading-relaxed"
                />
              </div>
            </div>
          )}
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
            {SERVICES_CATALOG.map((srv) => {
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
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#a62c5a]/10 text-[#a62c5a]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">{srv.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold">{srv.name}</span>
                        <span
                          className={`text-[11px] ${
                            isSelected ? 'text-white/80' : 'text-[#897176]'
                          }`}
                        >
                          {srv.description}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`material-symbols-outlined text-[22px] ${
                        isSelected ? 'text-white' : 'text-[#ddbfc5]'
                      }`}
                    >
                      {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                  </div>

                  <div
                    className={`mt-2 pt-2 flex items-center justify-between px-3 py-1.5 rounded-xl ${
                      isSelected ? 'bg-black/15' : 'bg-white/60'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[12px]">
                      <span className="material-symbols-outlined text-[15px]">schedule</span>
                      <span className="font-semibold">{srv.duration_text}</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold">
                      <span className="text-[16px]">{srv.price_formatted}</span>
                      <span className="text-[10px] opacity-80 uppercase">COP</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. SECCIÓN FECHA Y HORARIO */}
        <section className="bg-white/85 backdrop-blur-xl rounded-3xl p-4 border border-white/90 shadow-[0_4px_20px_rgba(224,90,135,0.06)] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#a62c5a]">
              <span className="material-symbols-outlined text-[20px]">calendar_clock</span>
              <h2 className="text-[15px] font-bold text-[#23191d]">Fecha y Horario de Sesión</h2>
            </div>
            <span className="text-[11px] text-[#7e5713] font-bold uppercase tracking-wider">
              Paso 3 de 3
            </span>
          </div>

          {/* Date Picker Display */}
          <div className="p-3 bg-[#fff0f3]/70 rounded-2xl border border-[#ffd9e1] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#a62c5a]/15 text-[#a62c5a] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">event</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#897176] uppercase">
                  Fecha Seleccionada
                </span>
                <span className="text-[15px] font-bold text-[#23191d]">
                  {formatDisplayDateSpanish(selectedDate)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="px-3 py-1.5 rounded-full bg-white text-[#a62c5a] text-[11px] font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1 border border-[#ffd9e1]"
            >
              <span>{showDatePicker ? 'Listo' : 'Cambiar'}</span>
              <span className="material-symbols-outlined text-[14px]">edit_calendar</span>
            </button>
          </div>

          {showDatePicker && (
            <div className="p-2 bg-white rounded-2xl border border-[#ffd9e1]">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 text-[14px] text-[#23191d] outline-none"
              />
            </div>
          )}

          {/* Franjas Horarias y Despliegue de Horas del Día */}
          <div className="flex flex-col gap-3">
            {/* Banner de Turno Asignado Actual */}
            <div className="p-3.5 bg-gradient-to-br from-[#fff0f3] via-white to-[#ffd9e1]/40 rounded-2xl border border-[#ffd9e1] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#897176] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#a62c5a]">schedule</span>
                  Turno Asignado
                </span>
                {(() => {
                  const pInfo = getTimePeriodInfo(selectedTime);
                  return (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${pInfo.color}`}
                    >
                      <span className="material-symbols-outlined text-[12px]">{pInfo.icon}</span>
                      <span>{pInfo.label}</span>
                    </span>
                  );
                })()}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-[26px] font-black text-[#a62c5a] tracking-tight">
                    {selectedTime}
                  </span>
                  <span className="text-[12px] text-[#564146] font-medium">
                    (Finaliza aprox. {calculateEndTime(selectedTime, currentService.duration_minutes)})
                  </span>
                </div>
              </div>

              {/* Detección de Disponibilidad en Supabase */}
              {(() => {
                const booked = getSlotBookingInfo(selectedTime);
                if (booked) {
                  return (
                    <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2 text-[11px] text-amber-800">
                      <span className="material-symbols-outlined text-[16px] text-amber-600 shrink-0">
                        warning
                      </span>
                      <span>
                        Ya existe cita agendada a esta hora:{' '}
                        <strong>{booked.client_name}</strong> ({booked.service_name})
                      </span>
                    </div>
                  );
                }
                return (
                  <div className="p-1.5 bg-[#e8f5e9] rounded-xl border border-[#c8e6c9] flex items-center gap-1.5 text-[11px] text-[#2e7d32]">
                    <span className="material-symbols-outlined text-[15px] text-[#00873c] shrink-0">
                      check_circle
                    </span>
                    <span className="font-semibold">Horario disponible para el {selectedDate}</span>
                  </div>
                );
              })()}
            </div>

            {/* Cabecera del Desplegador de Horas */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#a62c5a]">
                  view_timeline
                </span>
                <span className="text-[13px] font-bold text-[#23191d]">
                  Horarios de la Jornada
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsAllDayUnfolded(!isAllDayUnfolded)}
                className="px-2.5 py-1 rounded-full bg-[#fff0f3] hover:bg-[#ffd9e1] border border-[#ffd9e1] text-[#a62c5a] text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {isAllDayUnfolded ? 'unfold_less' : 'unfold_more'}
                </span>
                <span>{isAllDayUnfolded ? 'Modo Compacto' : 'Desplegar Todo el Día'}</span>
              </button>
            </div>

            {/* Selector de Filtros por Período del Día */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              <button
                type="button"
                onClick={() => setPeriodFilter('todos')}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                  periodFilter === 'todos'
                    ? 'bg-[#a62c5a] text-white shadow-xs'
                    : 'bg-[#fff0f3] text-[#564146] hover:bg-[#ffd9e1]'
                }`}
              >
                <span>⚡ Todo el Día</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-black/15">
                  {ALL_DAY_SLOTS.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPeriodFilter('manana')}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                  periodFilter === 'manana'
                    ? 'bg-[#a62c5a] text-white shadow-xs'
                    : 'bg-[#fff0f3] text-[#564146] hover:bg-[#ffd9e1]'
                }`}
              >
                <span>☀️ Mañana</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-black/15">
                  {MORNING_SLOTS.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPeriodFilter('tarde')}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                  periodFilter === 'tarde'
                    ? 'bg-[#a62c5a] text-white shadow-xs'
                    : 'bg-[#fff0f3] text-[#564146] hover:bg-[#ffd9e1]'
                }`}
              >
                <span>🌤️ Tarde</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-black/15">
                  {AFTERNOON_SLOTS.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPeriodFilter('noche')}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                  periodFilter === 'noche'
                    ? 'bg-[#a62c5a] text-white shadow-xs'
                    : 'bg-[#fff0f3] text-[#564146] hover:bg-[#ffd9e1]'
                }`}
              >
                <span>🌙 Noche</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-black/15">
                  {EVENING_SLOTS.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPeriodFilter('personalizado')}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                  periodFilter === 'personalizado'
                    ? 'bg-[#a62c5a] text-white shadow-xs'
                    : 'bg-[#fec97b]/30 text-[#7e5713] border border-[#fec97b]/60 hover:bg-[#fec97b]/50'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">more_time</span>
                <span>Hora Exacta</span>
              </button>
            </div>

            {/* 1. Vista Desplegada: Grupos de Horas o Filtro Seleccionado */}
            {periodFilter !== 'personalizado' && (
              <div className="flex flex-col gap-3">
                {/* Si periodo es TODOS o MAÑANA */}
                {(periodFilter === 'todos' || periodFilter === 'manana') && (
                  <div className="flex flex-col gap-1.5">
                    {periodFilter === 'todos' && (
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">light_mode</span>
                          Mañana (08:00 AM - 11:30 AM)
                        </span>
                        <span className="text-[10px] text-[#897176]">
                          {MORNING_SLOTS.length} turnos
                        </span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      {(isAllDayUnfolded ? MORNING_SLOTS : MORNING_SLOTS.slice(0, 4)).map(
                        (slot) => {
                          const isSelected = selectedTime === slot;
                          const booked = getSlotBookingInfo(slot);
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedTime(slot)}
                              className={`h-12 rounded-2xl text-[13px] font-bold flex items-center justify-between px-3 transition-all active:scale-95 border ${
                                isSelected
                                  ? 'bg-[#a62c5a] text-white border-[#a62c5a] shadow-[0_4px_14px_rgba(166,44,90,0.3)]'
                                  : booked
                                  ? 'bg-amber-50/70 text-[#23191d] border-amber-300 hover:bg-amber-100'
                                  : 'bg-[#fff0f3]/70 text-[#23191d] border-[#ffd9e1] hover:bg-[#ffd9e1]'
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px]">
                                  {isSelected ? 'check_circle' : 'alarm'}
                                </span>
                                <span>{slot}</span>
                              </div>
                              {isSelected ? (
                                <span className="text-[10px] uppercase font-bold bg-white/20 px-1.5 py-0.5 rounded-md">
                                  Asignado
                                </span>
                              ) : booked ? (
                                <span className="text-[9px] font-bold text-amber-800 bg-amber-200/80 px-1.5 py-0.5 rounded-md">
                                  Ocupado
                                </span>
                              ) : (
                                <span className="w-2 h-2 rounded-full bg-[#00873c]" />
                              )}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {/* Si periodo es TODOS o TARDE */}
                {(periodFilter === 'todos' || periodFilter === 'tarde') && (
                  <div className="flex flex-col gap-1.5">
                    {periodFilter === 'todos' && (
                      <div className="flex items-center justify-between px-1 pt-1">
                        <span className="text-[11px] font-bold text-orange-800 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">sunny</span>
                          Tarde (12:00 PM - 04:30 PM)
                        </span>
                        <span className="text-[10px] text-[#897176]">
                          {AFTERNOON_SLOTS.length} turnos
                        </span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      {(isAllDayUnfolded ? AFTERNOON_SLOTS : AFTERNOON_SLOTS.slice(0, 4)).map(
                        (slot) => {
                          const isSelected = selectedTime === slot;
                          const booked = getSlotBookingInfo(slot);
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedTime(slot)}
                              className={`h-12 rounded-2xl text-[13px] font-bold flex items-center justify-between px-3 transition-all active:scale-95 border ${
                                isSelected
                                  ? 'bg-[#a62c5a] text-white border-[#a62c5a] shadow-[0_4px_14px_rgba(166,44,90,0.3)]'
                                  : booked
                                  ? 'bg-amber-50/70 text-[#23191d] border-amber-300 hover:bg-amber-100'
                                  : 'bg-[#fff0f3]/70 text-[#23191d] border-[#ffd9e1] hover:bg-[#ffd9e1]'
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px]">
                                  {isSelected ? 'check_circle' : 'alarm'}
                                </span>
                                <span>{slot}</span>
                              </div>
                              {isSelected ? (
                                <span className="text-[10px] uppercase font-bold bg-white/20 px-1.5 py-0.5 rounded-md">
                                  Asignado
                                </span>
                              ) : booked ? (
                                <span className="text-[9px] font-bold text-amber-800 bg-amber-200/80 px-1.5 py-0.5 rounded-md">
                                  Ocupado
                                </span>
                              ) : (
                                <span className="w-2 h-2 rounded-full bg-[#00873c]" />
                              )}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {/* Si periodo es TODOS o NOCHE */}
                {(periodFilter === 'todos' || periodFilter === 'noche') && (
                  <div className="flex flex-col gap-1.5">
                    {periodFilter === 'todos' && (
                      <div className="flex items-center justify-between px-1 pt-1">
                        <span className="text-[11px] font-bold text-indigo-800 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">bedtime</span>
                          Noche (05:00 PM - 08:30 PM)
                        </span>
                        <span className="text-[10px] text-[#897176]">
                          {EVENING_SLOTS.length} turnos
                        </span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      {(isAllDayUnfolded ? EVENING_SLOTS : EVENING_SLOTS.slice(0, 4)).map(
                        (slot) => {
                          const isSelected = selectedTime === slot;
                          const booked = getSlotBookingInfo(slot);
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedTime(slot)}
                              className={`h-12 rounded-2xl text-[13px] font-bold flex items-center justify-between px-3 transition-all active:scale-95 border ${
                                isSelected
                                  ? 'bg-[#a62c5a] text-white border-[#a62c5a] shadow-[0_4px_14px_rgba(166,44,90,0.3)]'
                                  : booked
                                  ? 'bg-amber-50/70 text-[#23191d] border-amber-300 hover:bg-amber-100'
                                  : 'bg-[#fff0f3]/70 text-[#23191d] border-[#ffd9e1] hover:bg-[#ffd9e1]'
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px]">
                                  {isSelected ? 'check_circle' : 'alarm'}
                                </span>
                                <span>{slot}</span>
                              </div>
                              {isSelected ? (
                                <span className="text-[10px] uppercase font-bold bg-white/20 px-1.5 py-0.5 rounded-md">
                                  Asignado
                                </span>
                              ) : booked ? (
                                <span className="text-[9px] font-bold text-amber-800 bg-amber-200/80 px-1.5 py-0.5 rounded-md">
                                  Ocupado
                                </span>
                              ) : (
                                <span className="w-2 h-2 rounded-full bg-[#00873c]" />
                              )}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {/* Turnos Personalizados Agregados */}
                {customAddedSlots.length > 0 && (
                  <div className="flex flex-col gap-1.5 pt-1">
                    <span className="text-[11px] font-bold text-[#a62c5a] px-1">
                      Horas Personalizadas Agregadas
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {customAddedSlots.map((cSlot) => {
                        const isSelected = selectedTime === cSlot;
                        return (
                          <button
                            key={cSlot}
                            type="button"
                            onClick={() => setSelectedTime(cSlot)}
                            className={`h-12 rounded-2xl text-[13px] font-bold flex items-center justify-between px-3 transition-all active:scale-95 border ${
                              isSelected
                                ? 'bg-[#a62c5a] text-white border-[#a62c5a] shadow-xs'
                                : 'bg-white text-[#23191d] border-[#ffd9e1] hover:bg-[#fff0f3]'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px]">more_time</span>
                              <span>{cSlot}</span>
                            </div>
                            <span className="text-[9px] font-bold text-[#7e5713] bg-[#fec97b]/30 px-1.5 py-0.5 rounded-md">
                              Extra
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. Selector de Hora Exacta / Personalizada */}
            {periodFilter === 'personalizado' && (
              <div className="p-4 bg-gradient-to-br from-white via-[#fff0f3]/70 to-white rounded-2xl border border-[#ffd9e1] shadow-xs flex flex-col gap-3.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#a62c5a]">
                    <span className="material-symbols-outlined text-[19px]">schedule</span>
                    <span className="text-[13px] font-bold text-[#23191d]">
                      Asignar Cualquier Hora del Día
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7e5713] bg-[#fec97b]/30 px-2 py-0.5 rounded-full">
                    Precisión Total
                  </span>
                </div>

                {/* Constructor Rápido de Hora */}
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold text-[#564146]">1. Selecciona la Hora:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['07', '08', '09', '10', '11', '12', '01', '02', '03', '04', '05', '06', '07', '08'].map(
                      (h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setCustomHour(h)}
                          className={`w-9 h-9 rounded-xl text-[12px] font-bold transition-all border ${
                            customHour === h
                              ? 'bg-[#a62c5a] text-white border-[#a62c5a] shadow-xs scale-105'
                              : 'bg-white text-[#23191d] border-[#ffd9e1] hover:bg-[#fff0f3]'
                          }`}
                        >
                          {h}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Minutos y AM/PM */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold text-[#564146]">2. Minutos:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['00', '15', '30', '45'].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setCustomMinute(m)}
                          className={`h-9 rounded-xl text-[12px] font-bold transition-all border ${
                            customMinute === m
                              ? 'bg-[#a62c5a] text-white border-[#a62c5a] shadow-xs'
                              : 'bg-white text-[#23191d] border-[#ffd9e1] hover:bg-[#fff0f3]'
                          }`}
                        >
                          :{m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold text-[#564146]">3. Período:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(['AM', 'PM'] as const).map((mer) => (
                        <button
                          key={mer}
                          type="button"
                          onClick={() => setCustomMeridian(mer)}
                          className={`h-9 rounded-xl text-[12px] font-bold transition-all border ${
                            customMeridian === mer
                              ? 'bg-[#a62c5a] text-white border-[#a62c5a] shadow-xs'
                              : 'bg-white text-[#23191d] border-[#ffd9e1] hover:bg-[#fff0f3]'
                          }`}
                        >
                          {mer}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Botón para Aplicar la Hora Seleccionada */}
                <button
                  type="button"
                  onClick={handleApplyCustomWheelTime}
                  className="w-full h-11 rounded-xl bg-[#a62c5a] hover:bg-[#891345] text-white text-[13px] font-bold shadow-xs active:scale-98 transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[17px]">check</span>
                  <span>
                    Asignar {customHour}:{customMinute} {customMeridian} como Turno
                  </span>
                </button>

                {/* Alternativa: Input Directo con Reloj Nativo */}
                <div className="pt-2 border-t border-[#ffd9e1] flex items-center gap-2">
                  <div className="flex-1 flex items-center bg-white border border-[#ffd9e1] rounded-xl px-2.5 py-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#7e5713] mr-1.5">
                      timer
                    </span>
                    <input
                      type="time"
                      value={customNativeTime}
                      onChange={(e) => {
                        setCustomNativeTime(e.target.value);
                        if (e.target.value) {
                          const conv = convert24To12(e.target.value);
                          handleApplyCustomTime(conv);
                        }
                      }}
                      className="w-full bg-transparent border-none outline-none text-[13px] font-bold text-[#23191d]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const conv = convert24To12(customNativeTime);
                      handleApplyCustomTime(conv);
                    }}
                    className="h-9 px-3 rounded-xl bg-[#fff0f3] border border-[#ffd9e1] text-[#a62c5a] text-[11px] font-bold hover:bg-[#ffd9e1]"
                  >
                    Usar
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 4. PREVISUALIZACIÓN DE ALERTA AUTOMÁTICA */}
        <section className="bg-gradient-to-r from-[#fff0f3] to-[#ffd9e1]/50 rounded-3xl p-4 border border-[#ffd9e1] shadow-xs flex flex-col gap-2.5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#006b2e]/15 text-[#006b2e] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">forward_to_inbox</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-[#23191d]">
                  Automatización de Ciclo (wa.me)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#006b2e] text-white text-[10px] font-bold">
                  +{currentService.cycle_days} Días
                </span>
              </div>
              <p className="text-[11px] text-[#564146] leading-snug">
                Cálculo automático: Se programará recordatorio el{' '}
                <strong className="text-[#23191d] font-bold">
                  {calculateCycleReminderDate()}
                </strong>{' '}
                adaptado para <span className="text-[#a62c5a] font-bold">{firstName}</span> vía WhatsApp.
              </p>
            </div>
          </div>

          {/* Bubble preview */}
          <div className="bg-white rounded-2xl p-3 shadow-xs border border-[#ffd9e1] flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] text-[#897176]">
              <span className="flex items-center gap-1 text-[#006b2e] font-bold">
                <span className="material-symbols-outlined text-[14px]">mark_chat_read</span>
                Vista previa de mensaje
              </span>
              <span className="font-semibold text-[#a62c5a]">
                {clientGender === 'female' ? 'Plantilla Femenina' : 'Plantilla Masculina'}
              </span>
            </div>
            <p className="text-[12px] text-[#23191d] italic bg-[#fff0f3]/60 p-2.5 rounded-xl leading-relaxed">
              {dynamicMessage}
            </p>
          </div>
        </section>

        {/* 5. ACCIONES PRINCIPALES INFERIORES */}
        <div className="flex flex-col gap-2.5 pt-1">
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveOnly}
            className="w-full h-14 rounded-full bg-[#a62c5a] hover:bg-[#891345] text-white text-[15px] font-bold flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(166,44,90,0.35)] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">calendar_add_on</span>
            <span>{isSaving ? 'Guardando en Base de Datos...' : 'Guardar Cita en Agenda'}</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveAndNotifyWA}
            className="w-full h-12 rounded-full bg-[#006b2e] hover:bg-[#00873c] text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-[0_6px_18px_rgba(0,107,46,0.25)] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            <span>Guardar y Notificar por WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 rounded-full text-[#897176] text-[12px] font-bold text-center hover:text-[#ba1a1a] transition-colors"
          >
            Cancelar y volver a la agenda
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {showToast.visible && (
        <div className="fixed bottom-24 inset-x-4 max-w-sm mx-auto bg-[#23191d] text-white p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom">
          <div className="w-8 h-8 rounded-full bg-[#00873c] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">check</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold">{showToast.message}</span>
            <span className="text-[11px] text-[#ffd9e1]">Sincronizado con Supabase</span>
          </div>
        </div>
      )}
    </div>
  );
};
