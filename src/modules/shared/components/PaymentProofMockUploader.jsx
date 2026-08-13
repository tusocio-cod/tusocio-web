import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, X } from 'lucide-react';
import { PrimaryButton } from './SharedComponents';

export const PaymentProofMockUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile({
        name: selectedFile.name,
        size: (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB',
        type: selectedFile.type
      });
      setSuccess(false);
      setProgress(0);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    
    setUploading(true);
    let currentProgress = 0;
    
    const interval = setInterval(() => {
      currentProgress += 15;
      if (currentProgress > 100) currentProgress = 100;
      setProgress(currentProgress);
      
      if (currentProgress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploading(false);
          setSuccess(true);
          if (onUploadSuccess) onUploadSuccess(file);
        }, 500);
      }
    }, 200);
  };

  const resetUpload = () => {
    setFile(null);
    setSuccess(false);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (success) {
    return (
      <div style={{ backgroundColor: 'var(--portal-success-light)', border: '1px solid var(--portal-success)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
        <CheckCircle2 size={32} style={{ color: 'var(--portal-success)', margin: '0 auto 1rem' }} />
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--portal-success)', marginBottom: '0.5rem' }}>
          ¡Comprobante enviado con éxito!
        </h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--portal-text-main)', marginBottom: '1rem' }}>
          Nuestro equipo revisará el pago en breve.
        </p>
        <button onClick={resetUpload} style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--portal-success)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
          Enviar otro archivo
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--portal-surface)', border: '1px solid var(--portal-border)', padding: '1.5rem', borderRadius: '8px' }}>
      <h3 className="portal-h3" style={{ fontSize: '1rem', marginBottom: '1rem' }}>Enviar comprobante de pago</h3>
      
      {!file ? (
        <div 
          style={{ border: '2px dashed var(--portal-border)', borderRadius: '8px', padding: '2rem 1rem', textAlign: 'center', cursor: 'pointer', backgroundColor: 'var(--portal-bg)' }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            style={{ display: 'none' }} 
            accept="image/jpeg, image/png, application/pdf" 
          />
          <UploadCloud size={32} style={{ color: 'var(--portal-primary)', margin: '0 auto 1rem' }} />
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--portal-text-main)', marginBottom: '0.25rem' }}>
            Haz clic para seleccionar un archivo
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>
            Soporta PDF, JPG y PNG (máx. 5MB)
          </div>
        </div>
      ) : (
        <div style={{ backgroundColor: 'var(--portal-bg)', border: '1px solid var(--portal-border)', borderRadius: '8px', padding: '1rem' }}>
          <div className="portal-flex portal-justify-between portal-items-center portal-mb-4">
            <div className="portal-flex portal-items-center portal-gap-3">
              <FileText size={24} style={{ color: 'var(--portal-primary)' }} />
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--portal-text-main)', wordBreak: 'break-all' }}>{file.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>{file.size}</div>
              </div>
            </div>
            {!uploading && (
              <button onClick={resetUpload} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--portal-text-muted)' }}>
                <X size={18} />
              </button>
            )}
          </div>
          
          {uploading && (
            <div style={{ marginBottom: '1rem' }}>
              <div className="portal-flex portal-justify-between portal-items-center portal-mb-2">
                <span style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>Subiendo...</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{progress}%</span>
              </div>
              <div className="portal-progress-bg" style={{ height: '6px' }}>
                <div className="portal-progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          <PrimaryButton fullWidth loading={uploading} onClick={handleUpload}>
            {uploading ? 'Enviando...' : 'Confirmar envío'}
          </PrimaryButton>
        </div>
      )}
      
      <div className="portal-flex portal-gap-2 portal-mt-4" style={{ backgroundColor: 'var(--portal-warning-light)', padding: '0.75rem', borderRadius: '6px' }}>
        <AlertCircle size={16} style={{ color: 'var(--portal-warning)', flexShrink: 0, marginTop: '0.1rem' }} />
        <p style={{ fontSize: '0.75rem', color: 'var(--portal-warning)', margin: 0 }}>
          Solo envía el comprobante después de haber realizado el pago. El archivo será analizado por nuestro equipo.
        </p>
      </div>
    </div>
  );
};
