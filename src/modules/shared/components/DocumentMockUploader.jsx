import React, { useRef, useState } from 'react';
import { UploadCloud, File as FileIcon, X, CheckCircle2 } from 'lucide-react';
import { PrimaryButton } from './SharedComponents';

export const DocumentMockUploader = ({ onUploadSuccess, isReenvio = false }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    setUploading(true);
    setProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onUploadSuccess({ name: selectedFile.name, size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` });
            setUploading(false);
            setSelectedFile(null);
          }, 500);
          return 100;
        }
        return prev + 15;
      });
    }, 200);
  };

  return (
    <div style={{ backgroundColor: 'var(--portal-surface)', padding: '1.5rem', borderRadius: 'var(--portal-radius)', border: '1px solid var(--portal-border)', textAlign: 'center' }}>
      
      {!selectedFile && !uploading && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          style={{ border: '2px dashed var(--portal-border)', padding: '2.5rem', borderRadius: '8px', backgroundColor: 'var(--portal-bg)', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <UploadCloud size={32} style={{ color: 'var(--portal-primary)', marginBottom: '1rem' }} />
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--portal-text-main)', marginBottom: '0.25rem' }}>
            Haz clic o arrastra un archivo aquí
          </h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>PDF, JPG, PNG (máx. 5MB)</p>
        </div>
      )}

      {selectedFile && !uploading && (
        <div style={{ border: '1px solid var(--portal-border)', padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--portal-bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div className="portal-flex portal-items-center portal-gap-3">
            <div style={{ padding: '0.5rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid var(--portal-border)' }}>
              <FileIcon size={20} style={{ color: 'var(--portal-text-muted)' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--portal-text-main)' }}>{selectedFile.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</div>
            </div>
          </div>
          <button onClick={() => setSelectedFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--portal-text-muted)' }}>
            <X size={18} />
          </button>
        </div>
      )}

      {uploading && (
        <div style={{ border: '1px solid var(--portal-border)', padding: '1.5rem', borderRadius: '8px', backgroundColor: 'var(--portal-bg)', marginBottom: '1rem' }}>
          <div className="portal-flex portal-justify-between portal-mb-2">
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--portal-text-main)' }}>Subiendo archivo...</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--portal-text-muted)' }}>{Math.min(progress, 100)}%</span>
          </div>
          <div style={{ height: '8px', backgroundColor: 'var(--portal-border)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', backgroundColor: 'var(--portal-primary)', width: `${progress}%`, transition: 'width 0.2s ease' }} />
          </div>
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
        accept=".pdf,.jpg,.jpeg,.png"
      />

      {selectedFile && !uploading && (
        <PrimaryButton fullWidth onClick={handleUpload}>
          {isReenvio ? 'Reenviar documento' : 'Enviar documento'}
        </PrimaryButton>
      )}

      <p style={{ fontSize: '0.65rem', color: 'var(--portal-text-muted)', marginTop: '1rem' }}>
        * Upload simulado para desenvolvimento. O upload seguro real será implementado depois.
      </p>
    </div>
  );
};
