
   import React, { useState } from 'react';
import { MessageSquare, Calendar, CheckCircle2, Clock, Sparkles, Send, BellRing } from 'lucide-react';
import { SmartReminder } from '../types/salon';
import { SPECIAL_DATE_CAMPAIGNS, buildWhatsAppLink } from '../lib/constants';

interface AvisosScreenProps {
  reminders: SmartReminder[];
  onOpenWhatsAppModal?: (clientName: string, phone: string, message: string, service?: string) => void;
}

export const AvisosScreen: React.FC<AvisosScreenProps> = ({
  reminders,
  onOpenWhatsAppModal
}) => {
  const [activeTab, setActiveTab] = useState<'ciclos' | 'especiales'>('ciclos');
  const [sentIds, setSentIds] = useState<Record<string, boolean>>({});

  const handleSendReminder = (reminder: SmartReminder) => {
    setSentIds((prev) => ({ ...prev, [reminder.id]: true }));
    if (onOpenWhatsAppModal) {
      onOpenWhatsAppModal(
        reminder.client_name,
        reminder.client_phone,
        reminder.whatsapp_message,
        reminder.service_name
      );
    } else {
      window.open(buildWhatsAppLink(reminder.client_phone, reminder.whatsapp_message), '_blank');
    }
  };

  return (
    <div className="max-w-[430px] mx-auto px-4 space-y-5 pb-28 pt-2">
      {/* Encabezado con Tabs */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 shadow-[0_4px_20px_rgba(224,90,135,0.06)] border border-pink-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-pink-50 rounded-2xl text-[#a62c5a]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-[#23191d] text-[16px]">Avisos Inteligentes</h2>
              <p className="text-xs text-[#897176]">Recordatorios automáticos según cada servicio</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#ffd9e1] text-[#a62c5a] text-xs font-bold">
            {reminders.length}
          </span>
        </div>

        {/* Botones de Cambio de Pestaña */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#fff8f8] rounded-2xl border border-pink-100/60">
          <button
            onClick={() => setActiveTab('ciclos')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ciclos'
                ? 'bg-[#a62c5a] text-white shadow-sm'
                : 'text-[#564146] hover:text-[#23191d]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Mantenimiento ({reminders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('especiales')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'especiales'
                ? 'bg-[#a62c5a] text-white shadow-sm'
                : 'text-[#564146] hover:text-[#23191d]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Fechas Especiales</span>
          </button>
        </div>
      </div>

      {/* Pestaña 1: Ciclos de Mantenimiento Reales */}
      {activeTab === 'ciclos' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-[#897176] uppercase tracking-wider">
              Clientas listas para recordar ({reminders.length})
            </span>
          </div>

          {reminders.length === 0 ? (
            <div className="bg-white/90 rounded-3xl p-8 text-center border border-pink-100 shadow-xs space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#23191d] text-sm">¡Todo al día!</h3>
              <p className="text-xs text-[#897176] leading-relaxed">
                Aún no hay clientas que hayan cumplido los días de ciclo desde su última cita registrada.
              </p>
            </div>
          ) : (
            reminders.map((reminder) => {
              const isSent = !!sentIds[reminder.id];

              return (
                <div
                  key={reminder.id}
                  className={`bg-white/95 rounded-3xl p-4 shadow-[0_4px_18px_rgba(224,90,135,0.06)] border transition-all space-y-3 ${
                    isSent ? 'border-emerald-200 opacity-85' : 'border-pink-100 hover:border-pink-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#ffd9e1] text-[#a62c5a] font-bold flex items-center justify-center text-sm shrink-0">
                        {reminder.client_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#23191d] text-sm">{reminder.client_name}</h3>
                        <p className="text-xs text-[#564146] font-medium">
                          {reminder.service_name} · Ciclo de {reminder.cycle_days} días
                        </p>
                        <p className="text-[11px] text-[#897176]">
                          Última cita: {reminder.appointment_date}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                        reminder.is_urgent
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      Hace {reminder.days_elapsed} días
                    </span>
                  </div>

                  <div className="bg-[#fff8f8] rounded-2xl p-3 text-xs text-[#564146] italic border border-pink-100/70">
                    "{reminder.whatsapp_message}"
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#897176]">
                      Fecha ideal: <strong className="text-[#23191d]">{reminder.target_date}</strong>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleSendReminder(reminder)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-full transition-all shadow-xs active:scale-95 ${
                        isSent
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-[#00873c] text-white hover:bg-[#006e30]'
                      }`}
                    >
                      {isSent ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Enviado · Reenviar</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Enviar WhatsApp</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Pestaña 2: Lista Completa de Fechas Especiales Colombia */}
      {activeTab === 'especiales' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-[#897176] uppercase tracking-wider">
              Fechas Especiales Colombia ({SPECIAL_DATE_CAMPAIGNS.length})
            </span>
            <span className="text-[11px] text-[#a62c5a] bg-[#ffd9e1] px-2.5 py-0.5 rounded-full font-bold">
              8 Días Antes
            </span>
          </div>

          <div className="grid gap-4">
            {SPECIAL_DATE_CAMPAIGNS.map((campaign) => {
              const isReadyToNotify = campaign.days_left <= 8;

              return (
                <div
                  key={campaign.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-pink-100 hover:border-pink-200 transition-all"
                >
                  <div className="relative h-28 w-full overflow-hidden">
                    <img
                      src={campaign.banner_url}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-gray-900 shadow-sm">
                        {campaign.tag}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-bold text-base leading-tight">{campaign.title}</h3>
                      <p className="text-[11px] text-gray-200">{campaign.banner_edition}</p>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <p className="text-xs text-gray-600">{campaign.subtitle}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar className="w-4 h-4 text-[#a62c5a]" />
                        <span>Ventana de aviso: 8 Días Antes</span>
                      </div>

                      {isReadyToNotify ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                          <BellRing className="w-3.5 h-3.5" />
                          ¡Campaña Activa!
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
                          Programada
                        </span>
                      )}
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={() => {
                          const message = `¡Hola! ✨ En Nails & Style Lizeth Jhoana nos preparamos para ${campaign.title}. ¡Separa tu cita con anticipación y luce impecable! 💅💖`;
                          window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#a62c5a] hover:bg-[#891345] text-white text-xs font-bold rounded-full transition-all shadow-xs"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Difundir Campaña por WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
