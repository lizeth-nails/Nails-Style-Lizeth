import React from 'react';
import { SALON_INFO } from '../lib/constants';
import { getStoredSupabaseConfig } from '../lib/supabase';

interface HeaderProps {
  onOpenSupabaseConfig: () => void;
  onLockPin: () => void;
  pendingAlertsCount?: number;
  onNavigateToAlerts?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSupabaseConfig,
  onLockPin,
  pendingAlertsCount = 3,
  onNavigateToAlerts
}) => {
  const { isConfigured } = getStoredSupabaseConfig();

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-[0_4px_20px_rgba(224,90,135,0.06)] pt-safe">
      <div className="max-w-[430px] mx-auto h-16 px-4 flex items-center justify-between">
        {/* Salon Brand Zone */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#fff0f3] flex items-center justify-center p-1 border border-[#ffd9e1] shadow-xs">
            <img
              src={SALON_INFO.logoUrl}
              alt="Logo Nails & Style"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback to crown icon
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-[#7e5713] uppercase tracking-wider leading-none">
              {SALON_INFO.brand}
            </span>
            <h1 className="text-[17px] font-bold text-[#23191d] leading-tight mt-0.5 tracking-tight">
              {SALON_INFO.name}
            </h1>
          </div>
        </div>

        {/* Action Controls & Supabase Status */}
        <div className="flex items-center gap-2">
          {/* Supabase status badge */}
          <button
            onClick={onOpenSupabaseConfig}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all active:scale-95 shadow-xs border ${
              isConfigured
                ? 'bg-[#f0fff4] text-[#006b2e] border-[#bbf7d0]'
                : 'bg-[#fff0f3] text-[#a62c5a] border-[#ffd9e1]'
            }`}
            title="Configuración de Base de Datos Supabase"
            aria-label="Abrir configuración de Supabase"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConfigured ? 'bg-[#00873c] animate-pulse' : 'bg-[#c64673]'
              }`}
            />
            <span className="truncate max-w-[85px]">
              {isConfigured ? 'Supabase' : 'Conectar BD'}
            </span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onNavigateToAlerts}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#564146] hover:text-[#a62c5a] hover:bg-[#fff0f3] transition-colors relative active:scale-95"
            aria-label="Ver avisos y recordatorios pendientes"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {pendingAlertsCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#a62c5a] ring-2 ring-white" />
            )}
          </button>

          {/* Profile / Lock Screen */}
          <button
            onClick={onLockPin}
            className="w-8 h-8 rounded-full bg-[#a62c5a] text-white flex items-center justify-center shadow-xs active:scale-95 hover:brightness-110 transition-transform"
            title="Bloquear sesión / Cambiar Administradora"
            aria-label="Bloquear acceso de administradora con PIN"
          >
            <span className="material-symbols-outlined text-[17px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
