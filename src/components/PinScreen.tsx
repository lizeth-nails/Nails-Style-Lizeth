import React, { useState } from 'react';
import { SALON_INFO } from '../lib/constants';

interface PinScreenProps {
  onUnlock: () => void;
}

export const PinScreen: React.FC<PinScreenProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;
    setErrorMessage(null);
    const updated = [...pin, digit];
    setPin(updated);

    if (updated.length === 4) {
      const enteredCode = updated.join('');
      if (enteredCode === SALON_INFO.defaultPin || enteredCode === SALON_INFO.quickPinAlt) {
        setIsSuccess(true);
        setTimeout(() => {
          onUnlock();
        }, 500);
      } else {
        // Shake error
        setIsShaking(true);
        setErrorMessage('PIN Incorrecto. Introduce la clave de salón.');
        setTimeout(() => {
          setIsShaking(false);
          setPin([]);
        }, 600);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setErrorMessage(null);
      setPin(pin.slice(0, -1));
    }
  };

  const handleBiometricAuth = () => {
    setPin(['2', '0', '2', '6']);
    setIsSuccess(true);
    setTimeout(() => {
      onUnlock();
    }, 450);
  };

  return (
    <div className="relative min-h-screen bg-[#fff8f8] flex flex-col justify-between overflow-hidden select-none px-4 pt-safe pb-safe">
      {/* Ambient Atmospheric Glows for Frosted Glass Effect */}
      <div className="absolute -top-16 -left-12 w-64 h-64 bg-[#ffd9e1] opacity-70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-72 h-72 bg-[#fec97b] opacity-40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-80 h-80 bg-[#f6e3e9] opacity-70 rounded-full blur-3xl pointer-events-none" />

      {/* Main Centered Mobile Frame */}
      <div className="w-full max-w-[400px] mx-auto flex-1 flex flex-col justify-between py-6 relative z-10">
        {/* Salon Identity Branding Card */}
        <div className="flex flex-col items-center text-center mt-2">
          {/* Emblem Graphic */}
          <div className="relative flex items-center justify-center mb-3">
            <div className="w-20 h-20 rounded-full bg-[#fff0f3] border-2 border-white/80 shadow-md flex items-center justify-center p-2 backdrop-blur-md">
              <img
                src={SALON_INFO.crownLogoUrl}
                alt="Emblema Nails & Style Lizeth Jhoana"
                className="w-16 h-16 object-contain drop-shadow-sm"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-white text-[#a62c5a] rounded-full p-1 shadow-xs flex items-center justify-center">
              <span className="material-symbols-outlined text-[14px]">spa</span>
            </span>
          </div>

          <h1 className="text-[26px] font-extrabold text-[#23191d] tracking-tight leading-tight flex items-center gap-1.5">
            <span>Nails</span> <span className="text-[#7e5713]">&amp;</span> <span>Style</span>
          </h1>
          <span className="text-[#a62c5a] font-semibold text-[19px] italic tracking-wide -mt-0.5">
            Lizeth Jhoana
          </span>

          <div className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-[#564146] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#a62c5a] animate-pulse" />
            <span className="text-[10px] font-bold tracking-wider uppercase">
              {SALON_INFO.role}
            </span>
          </div>
        </div>

        {/* Frosted PIN Input Module */}
        <div className="w-full bg-white/80 backdrop-blur-xl border border-white/90 rounded-3xl shadow-[0_8px_30px_rgba(166,44,90,0.08)] p-6 flex flex-col items-center my-4">
          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#564146] mb-3">
            <span className="material-symbols-outlined text-[16px] text-[#7e5713]">lock</span>
            <span>Ingresa tu código de 4 dígitos</span>
          </div>

          {/* 4 PIN Dots Indicator */}
          <div
            className={`flex items-center justify-center gap-5 my-2 transition-transform duration-200 ${
              isShaking ? 'translate-x-3 text-red-500' : ''
            }`}
          >
            {[0, 1, 2, 3].map((index) => {
              const filled = index < pin.length;
              return (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    isSuccess
                      ? 'bg-[#00873c] scale-125 shadow-[0_0_12px_rgba(0,135,60,0.5)]'
                      : filled
                      ? 'bg-[#a62c5a] scale-125 shadow-[0_0_10px_rgba(166,44,90,0.4)]'
                      : 'border-2 border-[#a62c5a] bg-transparent'
                  }`}
                />
              );
            })}
          </div>

          {/* Interactive Status Label */}
          <div className="h-6 mt-3 flex items-center justify-center text-center">
            {isSuccess ? (
              <span className="text-[12px] font-bold text-[#006b2e] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                PIN Correcto · Accediendo a la Agenda...
              </span>
            ) : errorMessage ? (
              <span className="text-[12px] font-bold text-[#ba1a1a] flex items-center gap-1 animate-pulse">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                {errorMessage}
              </span>
            ) : (
              <span className="text-[12px] text-[#897176] font-medium">
                Introduce tu clave de salón (PIN demo: <strong>2026</strong> o <strong>1234</strong>)
              </span>
            )}
          </div>
        </div>

        {/* Numeric PIN Keypad */}
        <div className="w-full max-w-[340px] mx-auto grid grid-cols-3 gap-3 my-2">
          {[
            { num: '1', sub: ' ' },
            { num: '2', sub: 'ABC' },
            { num: '3', sub: 'DEF' },
            { num: '4', sub: 'GHI' },
            { num: '5', sub: 'JKL' },
            { num: '6', sub: 'MNO' },
            { num: '7', sub: 'PQRS' },
            { num: '8', sub: 'TUV' },
            { num: '9', sub: 'WXYZ' }
          ].map((item) => (
            <button
              key={item.num}
              type="button"
              onClick={() => handleDigit(item.num)}
              className="h-14 rounded-full bg-white/90 backdrop-blur-md text-[#23191d] border border-white/80 shadow-[0_4px_14px_rgba(166,44,90,0.06)] active:scale-90 active:bg-[#ffd9e1] transition-all flex flex-col items-center justify-center"
              aria-label={`Dígito ${item.num}`}
            >
              <span className="text-[20px] font-bold leading-none">{item.num}</span>
              <span className="text-[9px] font-semibold text-[#897176] tracking-widest mt-0.5 leading-none">
                {item.sub}
              </span>
            </button>
          ))}

          {/* Biometric Button */}
          <button
            type="button"
            onClick={handleBiometricAuth}
            className="h-14 rounded-full bg-[#fff0f3] text-[#a62c5a] border border-[#ffd9e1] shadow-xs active:scale-90 active:bg-[#ffd9e1] transition-all flex items-center justify-center"
            title="Acceso Rápido Biométrico FaceID (2026)"
            aria-label="Acceso rápido con FaceID"
          >
            <span className="material-symbols-outlined text-[24px]">face</span>
          </button>

          {/* 0 Key */}
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-14 rounded-full bg-white/90 backdrop-blur-md text-[#23191d] border border-white/80 shadow-[0_4px_14px_rgba(166,44,90,0.06)] active:scale-90 active:bg-[#ffd9e1] transition-all flex flex-col items-center justify-center"
            aria-label="Dígito 0"
          >
            <span className="text-[20px] font-bold leading-none">0</span>
            <span className="text-[9px] font-semibold text-[#897176] tracking-widest mt-0.5 leading-none">
              +
            </span>
          </button>

          {/* Backspace Key */}
          <button
            type="button"
            onClick={handleDelete}
            className="h-14 rounded-full bg-[#fff0f3] text-[#564146] border border-white/80 shadow-xs active:scale-90 active:bg-[#ffd9e1] transition-all flex items-center justify-center"
            aria-label="Borrar último dígito"
          >
            <span className="material-symbols-outlined text-[22px]">backspace</span>
          </button>
        </div>

        {/* Recovery Options & Salon Badge */}
        <div className="flex flex-col items-center gap-2 mt-4 mb-2">
          <button
            type="button"
            onClick={() => setShowRecoveryModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-white text-[#564146] hover:text-[#a62c5a] shadow-xs active:scale-95 transition-all text-[13px] font-semibold"
          >
            <span className="material-symbols-outlined text-[16px] text-[#a62c5a]">mail</span>
            <span>¿Olvidaste tu PIN? Recuperar</span>
          </button>

          <div className="flex items-center gap-1 text-[12px] text-[#897176]">
            <span className="material-symbols-outlined text-[15px] text-[#006b2e]">verified_user</span>
            <span>PWA Salon Suite · Nails &amp; Style</span>
          </div>
        </div>
      </div>

      {/* Recovery Modal Sheet */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 bg-[#23191d]/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white/95 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white flex flex-col gap-4 animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#a62c5a]">
                <span className="material-symbols-outlined text-[24px]">mark_email_read</span>
                <h3 className="text-[17px] font-bold text-[#23191d]">Recuperación de PIN</h3>
              </div>
              <button
                onClick={() => {
                  setShowRecoveryModal(false);
                  setRecoverySent(false);
                }}
                className="w-8 h-8 rounded-full bg-[#f6e3e9] flex items-center justify-center text-[#564146]"
                aria-label="Cerrar modal"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {recoverySent ? (
              <div className="bg-[#f0fff4] border border-[#bbf7d0] rounded-2xl p-4 text-center">
                <span className="material-symbols-outlined text-[#00873c] text-[32px] mb-1">
                  check_circle
                </span>
                <p className="text-[14px] font-bold text-[#006b2e]">¡Enlace Enviado!</p>
                <p className="text-[12px] text-[#564146] mt-1">
                  Hemos enviado las instrucciones a <strong>{SALON_INFO.recoveryEmail}</strong>.
                  Tu PIN de demostración predeterminado es: <strong className="text-[#a62c5a]">2026</strong>.
                </p>
              </div>
            ) : (
              <>
                <p className="text-[13px] text-[#564146] leading-relaxed">
                  Se enviará un enlace seguro de restablecimiento al correo registrado de la administradora:{' '}
                  <strong className="text-[#23191d]">{SALON_INFO.recoveryEmail}</strong>.
                </p>
                <div className="bg-[#fff0f3] rounded-2xl p-3 border border-[#ffd9e1] text-[12px] text-[#564146]">
                  <p className="font-semibold text-[#a62c5a] mb-1">Clave de Salón Inicial:</p>
                  <p>
                    Puedes usar <strong>2026</strong> o <strong>1234</strong> para acceder
                    inmediatamente a la agenda.
                  </p>
                </div>
              </>
            )}

            <div className="flex flex-col gap-2 pt-1">
              {!recoverySent ? (
                <button
                  type="button"
                  onClick={() => setRecoverySent(true)}
                  className="w-full h-12 rounded-full bg-[#a62c5a] text-white font-semibold text-[14px] shadow-[0_6px_18px_rgba(166,44,90,0.35)] active:scale-95 transition-all"
                >
                  Enviar Enlace al Correo
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowRecoveryModal(false);
                    setRecoverySent(false);
                    handleBiometricAuth();
                  }}
                  className="w-full h-12 rounded-full bg-[#006b2e] text-white font-semibold text-[14px] shadow-sm active:scale-95 transition-all"
                >
                  Entrar con Clave Demo (2026)
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowRecoveryModal(false);
                  setRecoverySent(false);
                }}
                className="w-full py-2.5 rounded-full text-[#897176] text-[13px] font-semibold hover:text-[#23191d]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
