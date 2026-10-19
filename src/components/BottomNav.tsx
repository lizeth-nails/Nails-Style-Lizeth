import React from 'react';
import { ActiveTab } from '../types/salon';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingAlertsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  pendingAlertsCount = 3
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe pointer-events-none">
      <div className="max-w-[430px] mx-auto px-4 pb-2 pointer-events-auto">
        <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-full shadow-[0_8px_30px_rgba(166,44,90,0.15)] px-3 h-16 flex items-center justify-around">
          {/* 1. Agenda */}
          <button
            onClick={() => onTabChange('agenda')}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-all gap-0.5 ${
              activeTab === 'agenda'
                ? 'text-[#a62c5a] font-bold scale-105'
                : 'text-[#564146] hover:text-[#23191d]'
            }`}
            aria-label="Ir a la Agenda semanal"
            aria-current={activeTab === 'agenda' ? 'page' : undefined}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                activeTab === 'agenda' ? 'material-symbols-fill' : ''
              }`}
            >
              calendar_today
            </span>
            <span className="text-[11px] font-semibold tracking-tight">Agenda</span>
          </button>

          {/* 2. Nueva Cita (Floating Elevated Action Button) */}
          <button
            onClick={() => onTabChange('nueva-cita')}
            className="flex flex-col items-center justify-center -translate-y-4 min-w-[56px] min-h-[44px] group transition-transform active:scale-95"
            aria-label="Agendar nueva cita"
            aria-current={activeTab === 'nueva-cita' ? 'page' : undefined}
          >
            <div
              className={`w-12 h-12 rounded-full bg-gradient-to-tr from-[#891345] to-[#a62c5a] flex items-center justify-center shadow-[0_8px_20px_rgba(166,44,90,0.38)] transition-all ${
                activeTab === 'nueva-cita'
                  ? 'ring-4 ring-[#ffd9e1] scale-110'
                  : 'group-hover:scale-105'
              }`}
            >
              <span className="material-symbols-outlined text-white text-[26px]">add</span>
            </div>
            <span
              className={`text-[11px] font-semibold mt-1 tracking-tight ${
                activeTab === 'nueva-cita' ? 'text-[#a62c5a]' : 'text-[#564146]'
              }`}
            >
              Nueva Cita
            </span>
          </button>

          {/* 3. Avisos / Recordatorios */}
          <button
            onClick={() => onTabChange('recordatorios')}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-all gap-0.5 relative ${
              activeTab === 'recordatorios'
                ? 'text-[#a62c5a] font-bold scale-105'
                : 'text-[#564146] hover:text-[#23191d]'
            }`}
            aria-label="Ver avisos y recordatorios inteligentes"
            aria-current={activeTab === 'recordatorios' ? 'page' : undefined}
          >
            <div className="relative flex items-center justify-center">
              <span
                className={`material-symbols-outlined text-[22px] ${
                  activeTab === 'recordatorios' ? 'material-symbols-fill' : ''
                }`}
              >
                notifications_active
              </span>
              {pendingAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#006b2e] shadow-[0_0_8px_rgba(0,107,46,0.7)]" />
              )}
            </div>
            <span className="text-[11px] font-semibold tracking-tight">Avisos</span>
          </button>

          {/* 4. Clientes */}
          <button
            onClick={() => onTabChange('clientes')}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-all gap-0.5 ${
              activeTab === 'clientes'
                ? 'text-[#a62c5a] font-bold scale-105'
                : 'text-[#564146] hover:text-[#23191d]'
            }`}
            aria-label="Directorio VIP de clientes y fichas"
            aria-current={activeTab === 'clientes' ? 'page' : undefined}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                activeTab === 'clientes' ? 'material-symbols-fill' : ''
              }`}
            >
              group
            </span>
            <span className="text-[11px] font-semibold tracking-tight">Clientes</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
