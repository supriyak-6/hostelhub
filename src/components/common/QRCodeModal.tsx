import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Copy, Check, ShieldCheck } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  data: string;
  badgeLabel?: string;
  metadata?: { label: string; value: string }[];
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  data,
  badgeLabel = 'APPROVED',
  metadata,
}) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (data) {
      QRCode.toDataURL(data, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrUrl(url))
        .catch((err) => console.error('QR generation error:', err));
    }
  }, [data]);

  if (!isOpen) return null;

  const copyData = () => {
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              {badgeLabel}
            </span>
            <h3 className="font-bold text-slate-900 text-base mt-1">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center">
          <div className="p-3 bg-white border-2 border-dashed border-slate-200 rounded-2xl shadow-inner mb-4 flex items-center justify-center">
            {qrUrl ? (
              <img src={qrUrl} alt="QR Code" className="w-52 h-52 rounded-lg" />
            ) : (
              <div className="w-52 h-52 flex items-center justify-center text-slate-400 text-sm">
                Generating QR...
              </div>
            )}
          </div>

          <div className="w-full bg-slate-50 rounded-xl p-3 mb-4 text-left border border-slate-100 space-y-1.5">
            {metadata?.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">{item.label}:</span>
                <span className="text-slate-900 font-semibold">{item.value}</span>
              </div>
            ))}
            <div className="flex justify-between text-xs pt-1 border-t border-slate-200">
              <span className="text-slate-500 font-medium">Verification Token:</span>
              <span className="font-mono text-slate-800 text-[11px] truncate max-w-[170px]">{data}</span>
            </div>
          </div>

          <div className="flex gap-2 w-full">
            <button
              onClick={copyData}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Token' : 'Copy Token'}
            </button>
            {qrUrl && (
              <a
                href={qrUrl}
                download="hostelhub-pass-qr.png"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                Save QR
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
