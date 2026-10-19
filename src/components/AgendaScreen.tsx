import React, { useState, useEffect, useMemo } from 'react';
import { Appointment } from '../types/salon';
import { TRENDS_SHOWCASE, generateAppointmentMessage } from '../lib/constants';

interface AgendaScreenProps {
  appointments: Appointment[];
  remindersCount?: number;
  onOpenNewAppointment: (date?: string) => void;
  onOpenWhatsAppModal: (clientName: string, phone: string, message: string, service?: string) => void;
  onDeleteAppointment: (id: string) => void;
}

// Helper to get local date in YYYY-MM-DD
export const getLocalIsoDate = (d: Date = new Date()): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Helper to normalize any date string to YYYY-MM-DD
const normalizeDateStr = (dateStr?: string): string => {
  if (!dateStr) return '';
  const trimmed = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return trimmed.substring(0, 10);
  }
  if (/^\d{2}-\d{2}-\d{4}/.test(trimmed)) {
    const [d, m, y] = trimmed.split('-');
    return `${y}-${m}-${d}`;
  }
  if (/^\d{2}\/\d{2}\/\d{4}/.test(trimmed)) {
    const [d, m, y] = trimmed.split('/');
    return `${y}-${m}-${d}`;
  }
  return trimmed;
};

// Helper to calculate Monday for a reference date with a week offset
const getMondayOfWeek = (refDate: Date, weekOffset: number = 0): Date => {
  const d = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate());
  d.setDate(d.getDate() + weekOffset * 7);
  const day = d.getDay(); // 0 is Sunday, 1 is Monday...
  const diff = day === 0 ? -6 : 1 - day; // Lunes como inicio
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const FULL_DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const FULL_MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const AgendaScreen: React.FC<AgendaScreenProps> = ({
  appointments,
  remindersCount = 10,
  onOpenNewAppointment,
  onOpenWhatsAppModal,
  onDeleteAppointment
}) => {
  // Current real date
  const todayIso = useMemo(() => getLocalIsoDate(), []);

  // Week offset from current week (0 = this week, -1 = last week, +1 = next week)
  const [weekOffset, setWeekOffset] = useState<number>(0);

  // Selected date ISO (always defaults to today on initial open)
  const [selectedFullDate, setSelectedFullDate] = useState<string>(todayIso);

  // Build the 7 days of the active week
  const weekDays = useMemo(() => {
    const monday = getMondayOfWeek(new Date(), weekOffset);
    return DAY_NAMES.map((name, idx) => {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + idx);
      const fullDate = getLocalIsoDate(dayDate);
      const isToday = fullDate === todayIso;
      return {
        name,
        fullName: FULL_DAY_NAMES[idx],
        day: dayDate.getDate(),
        month: MONTH_NAMES[dayDate.getMonth()],
        fullMonth: FULL_MONTH_NAMES[dayDate.getMonth()],
        year: dayDate.getFullYear(),
        fullDate,
        isToday,
        dateObj: dayDate
      };
    });
  }, [weekOffset, todayIso]);

  // Ensure that on initial load / opening, today's date is located and selected
  useEffect(() => {
    // Reset to current week (offset 0) and today
    setWeekOffset(0);
    setSelectedFullDate(todayIso);
  }, [todayIso]);

  // Find active selected day from weekDays (fallback to first day if outside week)
  const selectedDayIndex = useMemo(() => {
    const idx = weekDays.findIndex((d) => d.fullDate === selectedFullDate);
    return idx >= 0 ? idx : 0;
  }, [weekDays, selectedFullDate]);

  const currentSelectedDate = weekDays[selectedDayIndex] || weekDays[0];

  // Quick jump back to today
  const handleGoToToday = () => {
    setWeekOffset(0);
    setSelectedFullDate(todayIso);
  };

  // Step to previous day (or week if at Monday)
  const handlePrevDay = () => {
    if (selectedDayIndex > 0) {
      setSelectedFullDate(weekDays[selectedDayIndex - 1].fullDate);
    } else {
      // Move to previous week and select Sunday
      setWeekOffset((prev) => prev - 1);
      const prevMonday = getMondayOfWeek(new Date(), weekOffset - 1);
      const prevSunday = new Date(prevMonday);
      prevSunday.setDate(prevMonday.getDate() + 6);
      setSelectedFullDate(getLocalIsoDate(prevSunday));
    }
  };

  // Step to next day (or week if at Sunday)
  const handleNextDay = () => {
    if (selectedDayIndex < 6) {
      setSelectedFullDate(weekDays[selectedDayIndex + 1].fullDate);
    } else {
      // Move to next week and select Monday
      setWeekOffset((prev) => prev + 1);
      const nextMonday = getMondayOfWeek(new Date(), weekOffset + 1);
      setSelectedFullDate(getLocalIsoDate(nextMonday));
    }
  };

  // Filter appointments for the currently selected date
  const dayAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const normDate = normalizeDateStr(a.date);
      // Match exact date or if appt has no date and this day is today
      return normDate === currentSelectedDate.fullDate || (!normDate && currentSelectedDate.isToday);
    });
  }, [appointments, currentSelectedDate]);

  // Count appointments for each day in current week for dot badges
  const appointmentCountsByDate = useMemo(() => {
    const counts: Record<string, number> = {};
    appointments.forEach((a) => {
      const norm = normalizeDateStr(a.date);
      if (norm) {
        counts[norm] = (counts[norm] || 0) + 1;
      }
    });
    return counts;
  }, [appointments]);

  const handleReminderClick = (appt: Appointment) => {
    const defaultMsg = generateAppointmentMessage(
      appt.client_name,
      appt.client_gender,
      appt.service_name,
      appt.time,
      currentSelectedDate.isToday ? 'hoy' : `el ${currentSelectedDate.day} de ${currentSelectedDate.month}`
    );
    onOpenWhatsAppModal(appt.client_name, appt.client_phone, defaultMsg, appt.service_name);
  };

  // Determine month header title
  const monthHeaderTitle = useMemo(() => {
    if (weekDays.length === 0) return '';
    const firstDay = weekDays[0];
    const lastDay = weekDays[6];
    if (firstDay.month === lastDay.month) {
      return `${firstDay.fullMonth} ${firstDay.year}`;
    }
    return `${firstDay.month} - ${lastDay.month} ${lastDay.year}`;
  }, [weekDays]);

  return (
    <div className="flex flex-col w-full max-w-[430px] mx-auto px-4 space-y-4 pb-28 pt-2">
      {/* Weekly Calendar Strip Header */}
      <section className="flex flex-col bg-white/85 backdrop-blur-xl rounded-3xl p-4 border border-white/80 shadow-[0_4px_20px_rgba(224,90,135,0.06)]">
        {/* Month Navigation Title & Today Quick Button */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={handlePrevDay}
            className="w-9 h-9 rounded-full bg-[#fce9ee] flex items-center justify-center text-[#564146] active:scale-90 hover:bg-[#ffd9e1] transition-all"
            aria-label="Día anterior"
            title="Día anterior"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>

          <div className="flex flex-col items-center">
            <span className="text-[11px] font-semibold text-[#897176] uppercase tracking-wider">
              {monthHeaderTitle}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="material-symbols-outlined text-[#a62c5a] text-[18px] material-symbols-fill">
                calendar_month
              </span>
              <h2 className="text-[15px] font-bold text-[#23191d]">
                {currentSelectedDate.isToday
                  ? `Hoy, ${currentSelectedDate.day} ${currentSelectedDate.month}`
                  : `${currentSelectedDate.fullName}, ${currentSelectedDate.day} ${currentSelectedDate.month}`}
              </h2>
              {currentSelectedDate.isToday ? (
                <span className="px-2 py-0.5 rounded-full bg-[#e6f7ec] text-[#00873c] text-[10px] font-bold border border-[#b2e5c4] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00873c] animate-pulse" />
                  HOY
                </span>
              ) : (
                <button
                  onClick={handleGoToToday}
                  className="px-2 py-0.5 rounded-full bg-[#a62c5a] hover:bg-[#891345] text-white text-[10px] font-bold shadow-xs active:scale-95 transition-all flex items-center gap-0.5"
                  title="Volver al día actual"
                >
                  <span className="material-symbols-outlined text-[11px]">my_location</span>
                  <span>Ir a Hoy</span>
                </button>
              )}
            </div>
          </div>

          <button
            onClick={handleNextDay}
            className="w-9 h-9 rounded-full bg-[#fce9ee] flex items-center justify-center text-[#564146] active:scale-90 hover:bg-[#ffd9e1] transition-all"
            aria-label="Día siguiente"
            title="Día siguiente"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>

        {/* Days of the week row */}
        <div className="grid grid-cols-7 gap-1 text-center" role="tablist" aria-label="Días de la semana">
          {weekDays.map((item) => {
            const isSelected = item.fullDate === currentSelectedDate.fullDate;
            const apptsCount = appointmentCountsByDate[item.fullDate] || 0;

            return (
              <button
                key={item.fullDate}
                onClick={() => setSelectedFullDate(item.fullDate)}
                className={`relative flex flex-col items-center py-2 px-0.5 rounded-2xl transition-all ${
                  isSelected
                    ? 'bg-[#ffd9e1] border-2 border-[#a62c5a]/40 shadow-[0_4px_14px_rgba(166,44,90,0.22)]'
                    : 'hover:bg-[#fff0f3] text-[#564146] border border-transparent'
                }`}
                role="tab"
                aria-selected={isSelected}
                title={`${item.fullName}, ${item.day} de ${item.fullMonth}${item.isToday ? ' (Hoy)' : ''}`}
              >
                {/* Indicator tag for TODAY */}
                {item.isToday && (
                  <span className="text-[8px] font-extrabold text-[#a62c5a] tracking-tight leading-none mb-0.5 bg-white/80 px-1 py-0.5 rounded-full border border-[#ffd9e1]">
                    HOY
                  </span>
                )}

                <span
                  className={`text-[11px] font-semibold mb-1 ${
                    isSelected ? 'text-[#a62c5a] font-bold' : item.isToday ? 'text-[#a62c5a] font-bold' : 'text-[#897176]'
                  }`}
                >
                  {item.name}
                </span>

                <span
                  className={`text-[13px] font-bold w-7 h-7 flex items-center justify-center rounded-full transition-all ${
                    isSelected
                      ? 'bg-[#a62c5a] text-white shadow-sm scale-105'
                      : item.isToday
                      ? 'bg-[#ffe4eb] text-[#a62c5a] font-extrabold ring-1 ring-[#a62c5a]'
                      : 'text-[#23191d]'
                  }`}
                >
                  {item.day}
                </span>

                {/* Dot / badge for appointments on this day */}
                <div className="h-2 flex items-center justify-center mt-1">
                  {apptsCount > 0 ? (
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-[#a62c5a]' : 'bg-[#c64673]'
                      }`}
                      title={`${apptsCount} cita(s)`}
                    />
                  ) : (
                    <span className="w-1.5 h-1.5 opacity-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Quick Salon Stats & Day Highlights */}
      <section className="grid grid-cols-2 gap-3">
        {/* Stat 1: Citas */}
        <div className="bg-white/85 backdrop-blur-xl p-3.5 rounded-3xl border border-white/80 shadow-[0_4px_20px_rgba(224,90,135,0.06)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#ffd9e1] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#a62c5a] text-[22px]">
              event_available
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[17px] font-bold text-[#23191d] leading-tight">
              {dayAppointments.length} Citas
            </span>
            <span className="text-[11px] font-medium text-[#897176] truncate">
              {currentSelectedDate.isToday ? 'Programadas hoy' : `El ${currentSelectedDate.day} de ${currentSelectedDate.month}`}
            </span>
          </div>
        </div>

        {/* Stat 2: Avisos */}
        <div className="bg-white/85 backdrop-blur-xl p-3.5 rounded-3xl border border-white/80 shadow-[0_4px_20px_rgba(224,90,135,0.06)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#fec97b]/50 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#78520e] text-[22px]">
              notifications_active
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[17px] font-bold text-[#23191d] leading-tight">
              {remindersCount} Avisos
            </span>
            <span className="text-[11px] font-medium text-[#897176] truncate">
              Por despachar
            </span>
          </div>
        </div>
      </section>

      {/* Glassmorphic Banner / Smart Reminder Preview */}
      <section className="bg-gradient-to-r from-[#fff0f3] to-[#ffd9e1]/40 backdrop-blur-xl p-3.5 rounded-3xl border border-white/90 shadow-[0_6px_22px_rgba(166,44,90,0.09)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#a62c5a] flex items-center justify-center shrink-0 animate-pulse text-white shadow-xs">
            <span className="material-symbols-outlined text-[18px]">notifications</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-bold text-[#23191d] truncate">
              Recordatorio listo: {dayAppointments[0]?.client_name || 'María C.'}
            </span>
            <span className="text-[11px] text-[#564146] truncate">
              {dayAppointments[0]
                ? `${dayAppointments[0].service_name} a las ${dayAppointments[0].time}`
                : 'Semipermanente a las 10:00 AM'}
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            const targetAppt = dayAppointments[0] || appointments[0];
            if (targetAppt) {
              handleReminderClick(targetAppt);
            }
          }}
          className="px-3 py-1.5 rounded-full bg-[#a62c5a] text-white text-[11px] font-bold shrink-0 active:scale-95 transition-transform flex items-center gap-1 shadow-xs hover:bg-[#891345]"
          aria-label="Ver detalle de recordatorio listo"
        >
          <span>Ver</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </section>

      {/* Daily Timeline Schedule */}
      <section className="flex flex-col space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[17px] font-bold text-[#23191d] flex items-center gap-1.5">
              <span>Horarios del Día</span>
              {currentSelectedDate.isToday && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#00873c] animate-pulse" title="Día actual en curso" />
              )}
            </h3>
            {currentSelectedDate.isToday && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e6f7ec] text-[#00873c] border border-[#b2e5c4]">
                Hoy
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold text-[#897176]">
            {currentSelectedDate.name}, {currentSelectedDate.day} {currentSelectedDate.month}.
          </span>
        </div>

        {dayAppointments.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 text-center border border-white flex flex-col items-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#fff0f3] flex items-center justify-center text-[#a62c5a] mb-2">
              <span className="material-symbols-outlined text-[28px]">event_available</span>
            </div>
            <p className="text-[14px] font-bold text-[#23191d]">
              No hay citas programadas para {currentSelectedDate.isToday ? 'hoy' : `${currentSelectedDate.fullName.toLowerCase()} ${currentSelectedDate.day} de ${currentSelectedDate.month}`}
            </p>
            <p className="text-[12px] text-[#897176] mt-1 mb-3">
              Todos los turnos de este día están disponibles para agendar.
            </p>
            <button
              onClick={() => onOpenNewAppointment(currentSelectedDate.fullDate)}
              className="px-4 py-2 rounded-full bg-[#a62c5a] hover:bg-[#891345] text-white text-[12px] font-semibold shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px]">add</span>
              <span>+ Agendar Cita para este día</span>
            </button>
          </div>
        ) : (
          dayAppointments.map((appt) => {
            // Accent bar color based on gender/service
            const accentBorderColor =
              appt.client_gender === 'male'
                ? 'bg-[#7e5713]'
                : appt.service_id === 'semi'
                ? 'bg-[#00873c]'
                : 'bg-[#a62c5a]';

            return (
              <article
                key={appt.id}
                className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 border border-white/90 shadow-[0_4px_20px_rgba(224,90,135,0.07)] flex flex-col space-y-3 relative overflow-hidden transition-all hover:shadow-md"
              >
                {/* Lateral accent strip */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentBorderColor}`} />

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* Hour avatar */}
                    <div className="w-11 h-11 rounded-full bg-[#fff0f3] flex items-center justify-center shrink-0 shadow-inner border border-[#ffd9e1]">
                      <span className="text-[17px] font-bold text-[#a62c5a]">
                        {appt.hour_badge || appt.time.split(':')[0]}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[15px] font-bold text-[#23191d]">
                          {appt.client_name}
                        </span>
                        {appt.client_gender === 'female' ? (
                          <span
                            className="w-5 h-5 rounded-full bg-[#ffd9e1] flex items-center justify-center text-[#891345] text-[11px] font-bold"
                            title="Cliente Femenino"
                          >
                            ♀
                          </span>
                        ) : (
                          <span
                            className="w-5 h-5 rounded-full bg-[#fec97b] flex items-center justify-center text-[#78520e] text-[11px] font-bold"
                            title="Cliente Masculino"
                          >
                            ♂
                          </span>
                        )}
                      </div>
                      <span className="text-[12px] text-[#564146] font-medium">
                        {appt.service_name}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#fff0f3] text-[#23191d] text-[11px] font-bold flex items-center gap-1 border border-[#ffd9e1]">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            appt.client_gender === 'male' ? 'bg-[#7e5713]' : 'bg-[#00873c]'
                          }`}
                        />
                        {appt.id}
                      </span>
                      {/* Delete button option */}
                      <button
                        onClick={() => onDeleteAppointment(appt.id)}
                        className="w-6 h-6 rounded-full hover:bg-red-50 text-[#897176] hover:text-[#ba1a1a] flex items-center justify-center transition-colors"
                        title="Eliminar cita"
                        aria-label={`Eliminar cita ${appt.id}`}
                      >
                        <span className="material-symbols-outlined text-[15px]">close</span>
                      </button>
                    </div>
                    <span className="text-[11px] font-bold text-[#897176] mt-1">
                      {appt.time}
                    </span>
                  </div>
                </div>

                {/* Sub info & WhatsApp Trigger */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-[#564146] text-[12px]">
                    <span className="material-symbols-outlined text-[16px] text-[#7e5713]">
                      {appt.notes ? 'notes' : 'schedule'}
                    </span>
                    <span className="truncate max-w-[150px]">
                      {appt.notes || `Duración: ${appt.duration_text || '1h'}`}
                    </span>
                  </div>

                  <button
                    onClick={() => handleReminderClick(appt)}
                    className="h-10 px-4 rounded-full bg-[#006b2e] hover:bg-[#00873c] text-white text-[12px] font-bold flex items-center gap-1.5 shadow-[0_4px_14px_rgba(0,107,46,0.25)] active:scale-95 transition-all"
                    aria-label={`Enviar aviso de WhatsApp a ${appt.client_name}`}
                  >
                    <span className="material-symbols-outlined text-[17px]">chat</span>
                    <span>Enviar WhatsApp</span>
                  </button>
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* Showcase Gallery Card: Tendencias de la Semana */}
      <section className="bg-white/80 backdrop-blur-xl p-4 rounded-3xl border border-white/80 shadow-[0_4px_20px_rgba(224,90,135,0.06)] flex flex-col space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#7e5713] text-[20px]">
              auto_awesome
            </span>
            <h4 className="text-[17px] font-bold text-[#23191d]">Tendencias de la Semana</h4>
          </div>
          <span className="text-[11px] font-bold text-[#a62c5a] uppercase tracking-wider">
            Inspiración
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          {TRENDS_SHOWCASE.map((item) => (
            <div
              key={item.title}
              className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#fff0f3] border border-white shadow-xs group cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2">
                <span className="text-[11px] font-bold text-white tracking-wide">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
