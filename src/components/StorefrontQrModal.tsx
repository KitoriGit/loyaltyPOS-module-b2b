import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, Copy, Check, Sparkles, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

interface StorefrontQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  tenantName: string;
}

export function StorefrontQrModal({
  isOpen,
  onClose,
  workspaceId,
  tenantName,
}: StorefrontQrModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const walletUrl = `https://loyalty-cards-wallet-mocha.vercel.app/?join=${workspaceId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(walletUrl);
    setCopied(true);
    toast.success('Enlace de la billetera copiado al portapapeles');
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Contenedor Modal */}
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/60 overflow-hidden flex flex-col">
        {/* Header no imprimible */}
        <div className="px-6 py-4 border-b border-outline-variant/40 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Sparkles className="w-4 h-4 text-primary" />
            </span>
            <h3 className="font-display font-bold text-base text-on-surface">
              Cartel QR de Mostrador
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Zona Imprimible del Cartel */}
        <div className="p-8 flex flex-col items-center text-center bg-white text-slate-900 print:p-12 print:m-0 print:w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold mb-4 tracking-wide uppercase">
            <span>✨ Programa de Fidelización</span>
          </div>

          {/* Nombre del Comercio */}
          <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-slate-900 mb-2">
            {tenantName || 'Nuestro Comercio'}
          </h1>
          <p className="font-sans text-sm text-slate-600 max-w-xs mb-6">
            ¡Escaneá este código con la cámara de tu teléfono y comenzá a sumar puntos con tu DNI!
          </p>

          {/* Recuadro QR */}
          <div className="p-5 rounded-2xl bg-white border-2 border-slate-200 shadow-md mb-6 flex flex-col items-center">
            <QRCodeSVG
              value={walletUrl}
              size={200}
              level="H"
              includeMargin={true}
              className="w-44 h-44 sm:w-52 sm:h-52"
            />
            <div className="mt-3 font-mono text-[11px] text-slate-500 font-medium">
              loyalty-cards-wallet-mocha.vercel.app
            </div>
          </div>

          {/* Pasos de uso */}
          <div className="w-full max-w-sm grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100">
            <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50">
              <span className="font-bold text-primary text-xs">1. Escaneá</span>
              <span className="text-[10px] text-slate-500 leading-tight mt-0.5">Con tu celular</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50">
              <span className="font-bold text-primary text-xs">2. DNI</span>
              <span className="text-[10px] text-slate-500 leading-tight mt-0.5">Ingresá tu DNI</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50">
              <span className="font-bold text-emerald-700 text-xs">3. Premios</span>
              <span className="text-[10px] text-slate-500 leading-tight mt-0.5">Canjeá en caja</span>
            </div>
          </div>
        </div>

        {/* Acciones del Modal (No Imprimibles) */}
        <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-outline-variant/60 text-on-surface hover:bg-surface-container font-medium text-xs transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado' : 'Copiar Enlace'}</span>
          </button>

          <div className="flex items-center gap-2">
            <a
              href={walletUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-on-surface-variant hover:text-on-surface text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrir</span>
            </a>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary font-semibold text-xs shadow-xs hover:bg-primary-hover active:scale-[0.98] transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Cartel (A4)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
