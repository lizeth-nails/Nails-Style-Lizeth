import React, { useState } from 'react';
import { MessageSquare, Calendar, CheckCircle2, Clock, Sparkles, Send, BellRing } from 'lucide-react';
import { SMART_REMINDERS_DATA, SPECIAL_DATE_CAMPAIGNS, buildWhatsAppLink } from '../lib/constants';

export const AvisosScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ciclos' | 'especiales'>('ciclos');

  return (
    <div className="space-y-6 pb-24">
      {/* Encabezado con Tabs */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-pink-50 rounded-xl text-pink-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Avisos Inteligentes</h2>
              <p className="text-xs text-gray-500">Gestión de recordatorios y campañas automáticas</p>
            </div>
          </div>
        </div>

        {/* Botones de Cambio de Pestaña */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-50 rounded-xl">
          <button
            onClick={() => setActiveTab('ciclos')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'ciclos'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Ciclos Mantenimiento</span>
          </button>

          <button
            onClick={() => setActiveTab('especiales')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'especiales'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Fechas Especiales</span>
          </button>
        </div>
      </div>

      {/* Pestaña 1: Ciclos de Mantenimiento */}
      {activeTab === 'ciclos' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pendientes de Mantenimiento ({SMART_REMINDERS_DATA.length})
            </span>
          </div>

          {SMART_REMINDERS_DATA.map((reminder) => (
            <div
              key={reminder.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-pink-200 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={reminder.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={reminder.client_name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-100"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{reminder.client_name}</h3>
                    <p className="text-xs text-gray-500">{reminder.service_name}</p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                    reminder.is_urgent
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'bg-amber-50 text-amber-600 border border-amber-200'
                  }`}
                >
                  {reminder.days_elapsed} días transcurridos
                </span>
              </div>

              <div className="bg-pink-50/50 rounded-xl p-3 text-xs text-gray-700 italic border border-pink-100/50">
                "{reminder.whatsapp_message}"
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-gray-400">
                  Próximo ciclo: <strong className="text-gray-600">{reminder.target_date}</strong>
                </span>

                <a
                  href={buildWhatsAppLink(reminder.client_phone, reminder.whatsapp_message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-xl hover:bg-emerald-600 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pestaña 2: Lista Completa de Fechas Especiales Colombia */}
      {activeTab === 'especiales' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Calendario de Fechas Especiales Colombia ({SPECIAL_DATE_CAMPAIGNS.length})
            </span>
            <span className="text-[11px] text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full font-medium">
              Notificaciones 8 Días Antes
            </span>
          </div>

          <div className="grid gap-4">
            {SPECIAL_DATE_CAMPAIGNS.map((campaign) => {
              const isReadyToNotify = campaign.days_left <= 8;

              return (
                <div
                  key={campaign.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:border-pink-200 transition-all"
                >
                  {/* Banner superior de la campaña */}
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

                  {/* Cuerpo de la tarjeta */}
                  <div className="p-4 space-y-3">
                    <p className="text-xs text-gray-600">{campaign.subtitle}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar className="w-4 h-4 text-pink-500" />
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

                    {/* Botón de envío masivo/campaña de WhatsApp */}
                    <div className="pt-1">
                      <button
                        onClick={() => {
                          const message = `¡Hola! ✨ En Nails & Style Lizeth Jhoana nos preparamos para ${campaign.title}. ¡Separa tu cita con anticipación y luce impecable! 💅💖`;
                          window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-medium rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-sm"
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
