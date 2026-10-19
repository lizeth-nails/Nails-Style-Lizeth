import React, { useState } from 'react';
import { SmartReminder } from '../types/salon';
import { SPECIAL_DATE_CAMPAIGNS } from '../lib/constants';

interface AvisosScreenProps {
  reminders: SmartReminder[];
  onOpenWhatsAppModal: (clientName: string, phone: string, message: string, service?: string) => void;
}

export const AvisosScreen: React.FC<AvisosScreenProps> = ({
  reminders,
  onOpenWhatsAppModal
}) => {
  const [activeTab, setActiveTab] = useState<'ciclos' | 'fechas' | 'promos'>('ciclos');
  const [promoText, setPromoText] = useState(
    '✨ ¡Promoción Flash en Nails & Style Lizeth Jhoana! 💅 Reserva hoy tu manicure semipermanente y recibe gratis exfoliación con parafina y diseño básico. ¡Escríbenos para asegurar tu cupo!'
  );

  return (
    <div className="flex flex-col w-full max-w-[430px] mx-auto px-4 pb-28 pt-2">
      {/* Dynamic Top Bar & Metric Overview */}
      <div className="flex items-center justify-between mb-3 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#7e5713] text-[20px] material-symbols-fill">
            auto_awesome
          </span>
          <h2 className="text-[18px] font-bold text-[#23191d]">Avisos Inteligentes</h2>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fec97b]/40 text-[#78520e] text-[11px] font-bold shadow-xs backdrop-blur-md border border-[#fec97b]/60">
          <span className="w-2 h-2 rounded-full bg-[#00873c] animate-pulse" />
          <span>{reminders.length} Pendientes Hoy</span>
        </span>
      </div>

      {/* Quick Filter Navigation (Glassmorphic Pills) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setActiveTab('ciclos')}
          className={`px-4 py-2 rounded-full text-[12px] font-bold shadow-xs transition-all whitespace-nowrap flex items-center gap-1.5 active:scale-95 border ${
            activeTab === 'ciclos'
              ? 'bg-[#a62c5a] text-white border-[#a62c5a] shadow-[0_4px_12px_rgba(166,44,90,0.3)]'
              : 'bg-white/80 text-[#564146] border-white hover:bg-white'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">sync</span>
          <span>Ciclos (15/25 Días)</span>
        </button>

        <button
          onClick={() => setActiveTab('fechas')}
          className={`px-4 py-2 rounded-full text-[12px] font-bold shadow-xs transition-all whitespace-nowrap flex items-center gap-1.5 active:scale-95 border ${
            activeTab === 'fechas'
              ? 'bg-[#a62c5a] text-white border-[#a62c5a] shadow-[0_4px_12px_rgba(166,44,90,0.3)]'
              : 'bg-white/80 text-[#564146] border-white hover:bg-white'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">celebration</span>
          <span>Fechas Especiales</span>
        </button>

        <button
          onClick={() => setActiveTab('promos')}
          className={`px-4 py-2 rounded-full text-[12px] font-bold shadow-xs transition-all whitespace-nowrap flex items-center gap-1.5 active:scale-95 border ${
            activeTab === 'promos'
              ? 'bg-[#a62c5a] text-white border-[#a62c5a] shadow-[0_4px_12px_rgba(166,44,90,0.3)]'
              : 'bg-white/80 text-[#564146] border-white hover:bg-white'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">campaign</span>
          <span>Promociones</span>
        </button>
      </div>

      {/* Tab 1: Ciclos de Mantenimiento */}
      {(activeTab === 'ciclos' || activeTab === 'fechas') && (
        <div className="flex flex-col gap-4 mt-2">
          {activeTab === 'ciclos' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#a62c5a] text-[18px]">
                    schedule
                  </span>
                  <span className="text-[14px] font-bold text-[#23191d]">
                    Ciclos de Mantenimiento
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#897176]">
                  {reminders.length} listas para enviar
                </span>
              </div>

              {reminders.map((rem) => {
                const isMale = rem.client_gender === 'male';
                return (
                  <div
                    key={rem.id}
                    className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-4 border border-white/90 shadow-[0_6px_22px_rgba(166,44,90,0.07)] flex flex-col gap-3 transition-transform active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={rem.avatar_url}
                            alt={rem.client_name}
                            className="w-12 h-12 rounded-full object-cover shadow-xs border border-white"
                            onError={(e) => {
                              e.currentTarget.src = isMale
                                ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuArfAV0tN-HH_nmvywF89CzGzvEeCbjXRM6NTcmy3uko8QwL2gl_RG1PbrkcOU6pOjiv7_MAkqQTJ_Fz2GgmlATeneH8r37An1oAa4xdrCGzsTaODf0sv6VbW-A1MdbMhugqqSZxWHIKMcUrjHgbxQl7QmCNtiKEKaWTm5nIx_hPFtMG2TXtR_PYaWvM90LDCQf4F6LNIuTyVFWTfC6f2IfSi-qLOMh8BrQ7YQgMjRCmWlHftZ3lBQ'
                                : 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSeeURk99t7AkWKZbkX9nZ7tZsnFfpAFBPm7l-RCrKVIG6dGC9Ujq28SznzstvVvQ-78zv86aetD26RuaI9PB5c7Os--40I7n1vxnF_9dbyApqJyymsgvlh3ASUPxQIiP_ISs2XeEYgibewmncODtkBlIbkwZROaBR_FXrGpbrAbX-EJtVtmQRV1Qk2K-dxK4VssW7yCbX2dxGIu3LgCJ_iu5CUzcUI05patEz84KwkFKfHce6PGg';
                            }}
                          />
                          <span
                            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shadow-xs text-white ${
                              isMale ? 'bg-[#7e5713]' : 'bg-[#a62c5a]'
                            }`}
                          >
                            {isMale ? '♂' : '♀'}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-[16px] font-bold text-[#23191d]">
                              {rem.client_name}
                            </h3>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isMale
                                  ? 'bg-[#fec97b]/50 text-[#78520e]'
                                  : 'bg-[#ffd9e1] text-[#891345]'
                              }`}
                            >
                              {rem.cycle_days} días
                            </span>
                          </div>
                          <span className="text-[12px] text-[#897176] font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px] text-[#7e5713]">
                              {isMale ? 'verified' : 'brush'}
                            </span>
                            {rem.service_name}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                          rem.is_urgent
                            ? 'bg-[#fec97b] text-[#78520e]'
                            : 'bg-[#fff0f3] text-[#a62c5a]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {rem.is_urgent ? 'timer' : 'event_repeat'}
                        </span>
                        {rem.is_urgent ? 'Urgente' : 'Hoy'}
                      </span>
                    </div>

                    {/* Custom Template Bubble */}
                    <div className="bg-[#fff0f3]/70 border border-[#ffd9e1] rounded-2xl p-3 text-[#564146] text-[12px] leading-relaxed">
                      <p className="line-clamp-2 italic">"{rem.whatsapp_message}"</p>
                    </div>

                    {/* Direct WhatsApp Action Button */}
                    <button
                      type="button"
                      onClick={() =>
                        onOpenWhatsAppModal(
                          rem.client_name,
                          rem.client_phone,
                          rem.whatsapp_message,
                          rem.service_name
                        )
                      }
                      className="w-full h-12 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center gap-2 text-[14px] font-bold shadow-[0_6px_18px_rgba(37,211,102,0.35)] active:scale-98 transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                      <span>Enviar por WhatsApp</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Section 2: Alertas de Fechas Especiales (8 Días Antes) */}
          <div className="flex flex-col gap-3 pt-1">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#7e5713] text-[18px]">
                  volunteer_activism
                </span>
                <span className="text-[14px] font-bold text-[#23191d]">
                  Fechas Especiales (8 Días Antes)
                </span>
              </div>
              <span className="text-[11px] text-[#7e5713] font-bold">Campaña Activa</span>
            </div>

            {/* Campaign Card 1: Día de la Madre */}
            {SPECIAL_DATE_CAMPAIGNS.filter((c) => c.is_active).map((camp) => (
              <div
                key={camp.id}
                className="relative overflow-hidden bg-gradient-to-br from-[#ffd9e1]/60 via-[#fff0f3] to-white rounded-3xl p-4 border border-[#ffd9e1] shadow-[0_8px_25px_rgba(166,44,90,0.08)] flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#a62c5a]/10 flex items-center justify-center text-[#a62c5a] shadow-inner">
                      <span className="material-symbols-outlined text-[24px] material-symbols-fill">
                        card_giftcard
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-[16px] font-bold text-[#23191d]">{camp.title}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-[#a62c5a] text-white text-[10px] font-bold">
                          {camp.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#897176]">{camp.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Festive Banner */}
                <div className="relative w-full h-24 rounded-2xl overflow-hidden shadow-xs">
                  <img
                    src={camp.banner_url}
                    alt={camp.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center px-4">
                    <div className="text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#fec97b]">
                        {camp.banner_edition}
                      </span>
                      <p className="text-[16px] font-bold leading-tight">
                        {camp.banner_headline}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 rounded-2xl p-2.5 text-[#564146] text-[12px] border border-[#ffd9e1]">
                  <p className="line-clamp-2 italic">"{camp.sample_message}"</p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onOpenWhatsAppModal(
                      'Lista de Clientes VIP',
                      '+57 300 000 0000',
                      camp.sample_message,
                      camp.title
                    )
                  }
                  className="w-full h-12 rounded-full bg-[#a62c5a] hover:bg-[#891345] text-white flex items-center justify-center gap-2 text-[14px] font-bold shadow-[0_6px_20px_rgba(166,44,90,0.3)] active:scale-98 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>Enviar a Clientes (WhatsApp)</span>
                </button>
              </div>
            ))}

            {/* Quick Calendar Cue for upcoming Amor y Amistad */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 border border-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#7e5713]/15 flex items-center justify-center text-[#7e5713]">
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-[#23191d]">
                    Próxima Fecha: Amor y Amistad
                  </span>
                  <span className="text-[11px] text-[#897176]">
                    Alerta programada para el 12 de Septiembre
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#897176] text-[18px]">
                lock_clock
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Promociones */}
      {activeTab === 'promos' && (
        <div className="flex flex-col gap-3 mt-2">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 border border-white/90 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#a62c5a]">
              <span className="material-symbols-outlined text-[22px]">campaign</span>
              <h3 className="text-[16px] font-bold text-[#23191d]">
                Difusión de Promociones WhatsApp
              </h3>
            </div>
            <p className="text-[12px] text-[#564146] leading-relaxed">
              Redacta ofertas especiales, combos de temporada o descuentos exclusivos y envíalos directamente a tus clientes registrados en WhatsApp.
            </p>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#897176] uppercase">
                Texto del Mensaje Promocional
              </label>
              <textarea
                rows={4}
                value={promoText}
                onChange={(e) => setPromoText(e.target.value)}
                className="w-full p-3 bg-[#fff0f3] border border-[#ffd9e1] rounded-2xl text-[13px] text-[#23191d] focus:outline-none focus:bg-white resize-none leading-relaxed"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                onOpenWhatsAppModal(
                  'Clientes Seleccionados',
                  '+57 300 000 0000',
                  promoText,
                  'Promoción Especial'
                )
              }
              className="w-full h-12 rounded-full bg-[#006b2e] hover:bg-[#00873c] text-white flex items-center justify-center gap-2 text-[14px] font-bold shadow-[0_6px_18px_rgba(0,107,46,0.25)] active:scale-98 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Lanzar Promoción vía WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
