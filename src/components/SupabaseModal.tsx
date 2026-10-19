import React, { useState } from 'react';
import {
  getStoredSupabaseConfig,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  testConnection,
  getSupabaseSqlSchema,
  seedAllDataToSupabase
} from '../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onConfigChanged
}) => {
  const currentConfig = getStoredSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [key, setKey] = useState(currentConfig.key);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'guia' | 'sql' | 'tablas' | 'config'>('guia');

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!url || !key) {
      setTestResult({
        success: false,
        message: 'Por favor ingresa la URL de Supabase y el Anon Key.'
      });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    const result = await testConnection(url, key);
    setTestResult(result);
    setIsTesting(false);
  };

  const handleSave = () => {
    saveSupabaseCredentials(url, key);
    onConfigChanged();
    setTestResult({
      success: true,
      message: '¡Credenciales de Supabase guardadas y sincronizadas!'
    });
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const handleDisconnect = () => {
    clearSupabaseCredentials();
    setUrl('');
    setKey('');
    setTestResult(null);
    onConfigChanged();
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(getSupabaseSqlSchema());
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setTestResult(null);
    const res = await seedAllDataToSupabase();
    setIsSeeding(false);
    setTestResult({
      success: res.success,
      message: res.message
    });
    if (res.success) {
      onConfigChanged();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#23191d]/50 backdrop-blur-md">
      <div
        className="w-full max-w-[460px] bg-white/95 backdrop-blur-2xl rounded-3xl p-5 shadow-2xl border border-white flex flex-col gap-3.5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#00873c]/15 text-[#006b2e] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">database</span>
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#23191d]">Base de Datos Supabase</h3>
              <p className="text-[11px] text-[#006b2e] font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00873c] animate-pulse" />
                <span>oliuhwirfnfatpfjuoox.supabase.co</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#fff0f3] flex items-center justify-center text-[#564146] hover:bg-[#ffd9e1]"
            aria-label="Cerrar modal"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-4 gap-1 bg-[#fff0f3] p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('guia')}
            className={`py-1.5 text-[11px] font-bold rounded-xl transition-all ${
              activeTab === 'guia'
                ? 'bg-white text-[#a62c5a] shadow-xs'
                : 'text-[#564146] hover:text-[#23191d]'
            }`}
          >
            Paso a Paso
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sql')}
            className={`py-1.5 text-[11px] font-bold rounded-xl transition-all ${
              activeTab === 'sql'
                ? 'bg-white text-[#a62c5a] shadow-xs'
                : 'text-[#564146] hover:text-[#23191d]'
            }`}
          >
            Script SQL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tablas')}
            className={`py-1.5 text-[11px] font-bold rounded-xl transition-all ${
              activeTab === 'tablas'
                ? 'bg-white text-[#a62c5a] shadow-xs'
                : 'text-[#564146] hover:text-[#23191d]'
            }`}
          >
            Tablas (6)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('config')}
            className={`py-1.5 text-[11px] font-bold rounded-xl transition-all ${
              activeTab === 'config'
                ? 'bg-white text-[#a62c5a] shadow-xs'
                : 'text-[#564146] hover:text-[#23191d]'
            }`}
          >
            API Key
          </button>
        </div>

        {/* TAB 1: GUÍA PASO A PASO */}
        {activeTab === 'guia' && (
          <div className="flex flex-col gap-3">
            <div className="bg-[#fff0f3] border border-[#ffd9e1] rounded-2xl p-3 text-[12px] text-[#23191d] leading-relaxed">
              <span className="font-bold text-[#a62c5a] block mb-1">
                ¿Cómo integrar tu base de datos en Supabase?
              </span>
              Sigue estos 4 sencillos pasos para que tu proyecto en Supabase tenga todas las tablas y datos creados:
            </div>

            <ol className="flex flex-col gap-2 text-[12px] text-[#564146]">
              <li className="flex items-start gap-2 bg-white rounded-2xl p-2.5 border border-[#ffd9e1] shadow-2xs">
                <span className="w-5 h-5 rounded-full bg-[#a62c5a] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-[#23191d]">Abre el panel de Supabase:</strong>
                  <p className="mt-0.5">
                    Ingresa a tu proyecto en{' '}
                    <a
                      href="https://supabase.com/dashboard/project/oliuhwirfnfatpfjuoox/sql"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#a62c5a] font-bold underline"
                    >
                      supabase.com/dashboard/project/oliuhwirfnfatpfjuoox
                    </a>
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-2 bg-white rounded-2xl p-2.5 border border-[#ffd9e1] shadow-2xs">
                <span className="w-5 h-5 rounded-full bg-[#a62c5a] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-[#23191d]">Entra al SQL Editor:</strong>
                  <p className="mt-0.5">
                    En el menú lateral izquierdo de Supabase, haz clic en el ícono <strong>SQL Editor</strong> (o "New query").
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-2 bg-white rounded-2xl p-2.5 border border-[#ffd9e1] shadow-2xs">
                <span className="w-5 h-5 rounded-full bg-[#a62c5a] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-[#23191d]">Copia y Pega el Script SQL:</strong>
                  <p className="mt-0.5">
                    Haz clic en el botón de abajo <strong>"Copiar Script SQL Completo"</strong> y pégalo en el editor de Supabase.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-2 bg-white rounded-2xl p-2.5 border border-[#ffd9e1] shadow-2xs">
                <span className="w-5 h-5 rounded-full bg-[#00873c] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <strong className="text-[#23191d]">Haz clic en "Run" (Ejecutar):</strong>
                  <p className="mt-0.5">
                    Supabase creará las 6 tablas con RLS y sembrará automáticamente todos los registros.
                  </p>
                </div>
              </li>
            </ol>

            {/* Quick Actions */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopySql}
                className={`h-12 rounded-full font-bold text-[13px] flex items-center justify-center gap-2 active:scale-95 transition-all ${
                  copiedSql
                    ? 'bg-[#00873c] text-white shadow-sm'
                    : 'bg-[#a62c5a] text-white shadow-[0_4px_14px_rgba(166,44,90,0.3)]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {copiedSql ? 'check' : 'content_copy'}
                </span>
                <span>{copiedSql ? '¡SQL Copiado al Portapapeles!' : 'Copiar Script SQL Completo'}</span>
              </button>

              <button
                type="button"
                disabled={isSeeding}
                onClick={handleSeedDatabase}
                className="h-11 rounded-full bg-[#006b2e] hover:bg-[#00873c] text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(0,107,46,0.25)] active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>{isSeeding ? 'Sembrando en Supabase...' : '⚡ Sembrar Tablas en Supabase (1 Clic)'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SCRIPT SQL COMPLETO */}
        {activeTab === 'sql' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-[#23191d]">
                Script DDL &amp; DML Completo (PostgreSQL)
              </span>
              <button
                type="button"
                onClick={handleCopySql}
                className="text-[11px] font-bold text-[#a62c5a] flex items-center gap-1 hover:underline"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copiedSql ? 'check' : 'content_copy'}
                </span>
                <span>{copiedSql ? '¡Copiado!' : 'Copiar todo'}</span>
              </button>
            </div>

            <div className="relative bg-[#23191d] text-[#fff8f8] rounded-2xl p-3 font-mono text-[11px] max-h-[260px] overflow-y-auto leading-relaxed border border-[#382d31]">
              <pre className="whitespace-pre-wrap">{getSupabaseSqlSchema()}</pre>
            </div>

            <button
              type="button"
              onClick={handleCopySql}
              className={`h-11 rounded-full font-bold text-[13px] flex items-center justify-center gap-2 active:scale-95 transition-all ${
                copiedSql
                  ? 'bg-[#00873c] text-white shadow-sm'
                  : 'bg-[#a62c5a] text-white shadow-[0_4px_14px_rgba(166,44,90,0.3)]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {copiedSql ? 'check' : 'content_copy'}
              </span>
              <span>{copiedSql ? '¡SQL Copiado!' : 'Copiar Script SQL'}</span>
            </button>
          </div>
        )}

        {/* TAB 3: RESUMEN DE TODAS LAS TABLAS & REGISTROS */}
        {activeTab === 'tablas' && (
          <div className="flex flex-col gap-2.5 text-[12px] max-h-[300px] overflow-y-auto pr-1">
            <div className="p-3 bg-[#fff0f3] rounded-2xl border border-[#ffd9e1]">
              <span className="font-bold text-[#a62c5a] block">1. Tabla: services (3 registros)</span>
              <span className="text-[11px] text-[#564146] block mt-0.5">
                Columnas: id, name, duration_minutes, duration_text, price_cop, price_formatted, cycle_days, description, icon.
              </span>
              <span className="text-[11px] text-[#006b2e] font-semibold mt-1 block">
                • Mani & Pedi Semipermanente ($45.000 / 25 días)
                <br />• Manicure y Pedicura Tradicional ($28.000 / 15 días)
                <br />• Retiro, Fortalecimiento y Spa ($20.000 / 20 días)
              </span>
            </div>

            <div className="p-3 bg-[#fff0f3] rounded-2xl border border-[#ffd9e1]">
              <span className="font-bold text-[#a62c5a] block">2. Tabla: clients (10 registros VIP)</span>
              <span className="text-[11px] text-[#564146] block mt-0.5">
                Columnas: id, name, gender, phone, notes, has_allergies, last_service_date, last_service_name, avatar_url.
              </span>
              <span className="text-[11px] text-[#006b2e] font-semibold mt-1 block">
                • María C. (+57 310 456 7890) - Alergia látex
                <br />• José L. (+57 312 890 1234) - Cuidado tradicional
                <br />• Laura Valentina (+57 315 222 3344) - Acrílicas
                <br />• David Gómez (+57 320 111 8899) - Pedicura Spa
                <br />• Carlos R., Sofía G., Laura M., Marcela Torres, Andrés Felipe, Camila Rivas
              </span>
            </div>

            <div className="p-3 bg-[#fff0f3] rounded-2xl border border-[#ffd9e1]">
              <span className="font-bold text-[#a62c5a] block">3. Tabla: appointments (10 citas en agenda)</span>
              <span className="text-[11px] text-[#564146] block mt-0.5">
                Columnas: id, numeric_id, client_id, client_name, client_gender, client_phone, service_id, service_name, service_price, date, time, status.
              </span>
              <span className="text-[11px] text-[#006b2e] font-semibold mt-1 block">
                • #145: María C. (10:00 AM)
                <br />• #146: Carlos R. (11:30 AM)
                <br />• #147: Sofía G. (02:00 PM)
                <br />• #148: Laura M. (04:30 PM)
                <br />• #149: Marcela Torres (06:00 PM)
                <br />• #150: José L. (09:30 AM)
                <br />• #151: Laura Valentina (11:00 AM)
                <br />• #152: David Gómez (03:00 PM)
                <br />• #153: Andrés Felipe (10:30 AM)
                <br />• #154: Camila Rivas (02:30 PM)
              </span>
            </div>

            <div className="p-3 bg-[#fff0f3] rounded-2xl border border-[#ffd9e1]">
              <span className="font-bold text-[#a62c5a] block">4. Tabla: reminders (10 recordatorios calculados)</span>
              <span className="text-[11px] text-[#564146] block mt-0.5">
                Columnas: id, client_id, client_name, client_gender, service_name, cycle_days, days_elapsed, whatsapp_message.
              </span>
              <span className="text-[11px] text-[#006b2e] font-semibold mt-1 block">
                • r1..r10: María C., José L., Marcela Torres, Laura Valentina, David Gómez, Carlos R., Sofía G., Laura M., Andrés Felipe, Camila Rivas.
              </span>
            </div>

            <div className="p-3 bg-[#fff0f3] rounded-2xl border border-[#ffd9e1]">
              <span className="font-bold text-[#a62c5a] block">5. Tabla: special_dates (2 campañas)</span>
              <span className="text-[11px] text-[#564146] block mt-0.5">
                • Día de la Madre (Faltan 8 días)
                <br />• Amor y Amistad (Programada 12 Septiembre)
              </span>
            </div>

            <div className="p-3 bg-[#fff0f3] rounded-2xl border border-[#ffd9e1]">
              <span className="font-bold text-[#a62c5a] block">6. Tabla: trends (2 inspiraciones)</span>
              <span className="text-[11px] text-[#564146] block mt-0.5">
                • Rose Gold Nude
                <br />• Glazed Pearl
              </span>
            </div>
          </div>
        )}

        {/* TAB 4: CONFIGURACIÓN / API KEY */}
        {activeTab === 'config' && (
          <div className="flex flex-col gap-3">
            <p className="text-[12px] text-[#564146] leading-relaxed">
              Credenciales activas conectadas directamente a tu proyecto Supabase:
            </p>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#897176] uppercase">
                Project URL
              </label>
              <div className="flex items-center bg-[#fff0f3]/70 border border-[#ffd9e1] rounded-2xl px-3 py-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#a62c5a] mr-2">
                  link
                </span>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-[12px] text-[#23191d]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#897176] uppercase">
                API Key (Publishable / Anon)
              </label>
              <div className="flex items-center bg-[#fff0f3]/70 border border-[#ffd9e1] rounded-2xl px-3 py-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#7e5713] mr-2">
                  key
                </span>
                <input
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-[12px] text-[#23191d]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleTest}
                disabled={isTesting}
                className="flex-1 h-11 rounded-full bg-[#f6e3e9] text-[#a62c5a] font-semibold text-[13px] active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">sync</span>
                <span>{isTesting ? 'Probando...' : 'Probar Conexión'}</span>
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 h-11 rounded-full bg-[#a62c5a] text-white font-semibold text-[13px] shadow-[0_4px_14px_rgba(166,44,90,0.3)] active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">save</span>
                <span>Guardar</span>
              </button>
            </div>

            {currentConfig.isConfigured && (
              <button
                type="button"
                onClick={handleDisconnect}
                className="py-1 text-[11px] font-semibold text-[#897176] hover:text-[#ba1a1a] transition-colors text-center"
              >
                Restablecer a valores por defecto
              </button>
            )}
          </div>
        )}

        {/* Test or Seeding Result message */}
        {testResult && (
          <div
            className={`p-3 rounded-2xl text-[12px] flex items-start gap-2 ${
              testResult.success
                ? 'bg-[#f0fff4] text-[#006b2e] border border-[#bbf7d0]'
                : 'bg-[#fff0f3] text-[#ba1a1a] border border-[#ffdad6]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
              {testResult.success ? 'check_circle' : 'error'}
            </span>
            <p className="leading-snug">{testResult.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};
