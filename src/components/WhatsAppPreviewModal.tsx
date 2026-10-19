import React, { useState, useEffect } from 'react';
import { buildWhatsAppLink } from '../lib/constants';

interface WhatsAppPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  clientPhone: string;
  defaultMessage: string;
  serviceName?: string;
  title?: string;
}

export const WhatsAppPreviewModal: React.FC<WhatsAppPreviewModalProps> = ({
  isOpen,
  onClose,
  clientName,
  clientPhone,
  defaultMessage,
  serviceName,
  title = "Recordatorio Automático"
}) => {
  const [message, setMessage] = useState(defaultMessage);

  useEffect(() => {
    setMessage(defaultMessage);
  }, [defaultMessage]);

  if (!isOpen) return null;

  const handleSend = () => {
    const waUrl = buildWhatsAppLink(clientPhone, message);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-[#23191d]/40 backdrop-blur-md transition-opacity">
      <div
        className="w-full max-w-[390px] bg-white/95 backdrop-blur-2xl rounded-3xl p-5 shadow-[0_20px_45px_rgba(35,25,29,0.25)] border border-white flex flex-col gap-4 animate-in fade-in slide-in-from-bottom duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with animated bell */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#fec97b]/40 text-[#78520e] flex items-center justify-center">
              <span className="material-symbols-outlined text-[19px] material-symbols-fill">
                notifications_active
              </span>
            </span>
            <div>
              <h3 className="text-[17px] font-bold text-[#23191d]">{title}</h3>
              <p className="text-[11px] text-[#7e5713] font-semibold">
                Para: {clientName} ({clientPhone})
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

        {/* Editable Message Bubble */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-[#897176] uppercase tracking-wider flex items-center justify-between">
            <span>Mensaje WhatsApp Personalizado</span>
            {serviceName && (
              <span className="text-[#a62c5a] font-bold">{serviceName}</span>
            )}
          </label>
          <div className="bg-[#fff0f3]/70 border border-[#ffd9e1] rounded-2xl p-3 shadow-inner">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full bg-transparent border-none outline-none text-[13px] text-[#23191d] font-normal leading-relaxed resize-none"
              placeholder="Escribe el mensaje de WhatsApp..."
            />
          </div>
        </div>

        {/* Metadata link check */}
        <div className="flex items-center justify-between px-1 text-[11px] text-[#564146]">
          <span className="flex items-center gap-1 text-[#006b2e] font-semibold">
            <span className="material-symbols-outlined text-[15px]">check_circle</span>
            wa.me pre-enlazado
          </span>
          <span className="font-semibold text-[#7e5713]">Nails &amp; Style Lizeth Jhoana</span>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-full bg-[#f6e3e9] text-[#564146] font-semibold text-[14px] hover:bg-[#f0dee3] active:scale-95 transition-all"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSend}
            className="h-12 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-[14px] shadow-[0_6px_18px_rgba(37,211,102,0.38)] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[19px]">send</span>
            <span>Enviar Mensaje</span>
          </button>
        </div>
      </div>
    </div>
  );
};
