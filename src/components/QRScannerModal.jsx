
import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Modal, Button } from './ui';

const QRScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const scannerRef = useRef(null);
  const [error, setError] = useState(null);
  const regionId = 'qr-reader';

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      return;
    }

    // Small delay to ensure the DOM element is ready
    const timer = setTimeout(() => {
      startScanner();
    }, 100);

    return () => {
      clearTimeout(timer);
      stopScanner();
    };
  }, [isOpen]);

  const startScanner = async () => {
    try {
      const html5QrCode = new Html5Qrcode(regionId);
      scannerRef.current = html5QrCode;

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          // Success callback
          try {
            // Robust parsing: Look for the client ID pattern (XXXX-YYYYYY) in the decoded text
            // Format from clientId.service.js is /^[A-Z0-9]{4}-[A-Z0-9]{6,}$/
            const clientIdMatch = decodedText.match(/[A-Z0-9]{4}-[A-Z0-9]{6,}/i);
            
            if (clientIdMatch) {
              const clientId = clientIdMatch[0].toUpperCase();
              console.log('Extracted Client ID via regex:', clientId);
              onScanSuccess(clientId);
              handleClose();
            } else {
              // Fallback: Try URL parsing if regex fails to find a match directly
              const url = new URL(decodedText);
              const pathParts = url.pathname.split('/');
              const clientIdx = pathParts.lastIndexOf('client');
              
              if (clientIdx !== -1 && pathParts[clientIdx + 1]) {
                const clientId = pathParts[clientIdx + 1];
                onScanSuccess(clientId);
                handleClose();
              } else {
                console.warn('Invalid QR code format', decodedText);
                setError('Invalid QR code format. Please scan a valid client loyalty QR code.');
              }
            }
          } catch (e) {
            // If not a URL, check if it's just the client ID via regex again
            const clientIdMatch = decodedText.match(/[A-Z0-9]{4}-[A-Z0-9]{6,}/i);
            if (clientIdMatch) {
               onScanSuccess(clientIdMatch[0].toUpperCase());
               handleClose();
            } else {
               console.warn('Scanned text is not a valid loyalty QR', decodedText);
               setError('This QR code is not recognized as a valid client ID.');
            }
          }
        },
        () => {
          // Error callback (no QR found in frame)
        }
      );
    } catch (err) {
      console.error('Unable to start scanning', err);
      if (err.toString().includes('Permission denied')) {
        setError('Camera permission denied. Please allow camera access in your browser settings.');
      } else if (!window.isSecureContext) {
        setError('Camera access requires a secure connection (HTTPS).');
      } else {
        setError(`Failed to start camera: ${err.message || err.toString()}`);
      }
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error('Error stopping scanner', err);
      }
    }
  };

  const handleClose = () => {
    stopScanner().finally(() => {
      setError(null);
      onClose();
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Scan Client QR Code"
      size="md"
    >
      <div className="flex flex-col items-center">
        {error ? (
          <div className="p-6 text-center">
            <div className="mb-4 text-warning" style={{ fontSize: '3rem' }}>⚠️</div>
            <p className="mb-6 font-medium text-gray-900">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={startScanner}>Try Again</Button>
              <Button variant="ghost" onClick={handleClose}>Cancel</Button>
            </div>
            {!window.isSecureContext && (
              <p className="mt-4 text-xs text-gray-500">
                You are currently using an unsecure connection. 
                Please use HTTPS to enable the camera.
              </p>
            )}
          </div>
        ) : (
          <>
            <div id={regionId} style={{ width: '100%', maxWidth: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: '#000', minHeight: '300px' }}></div>
            <p className="mt-4 text-sm text-gray-500 text-center">
              Point your camera at the client's loyalty card QR code.
            </p>
          </>
        )}
      </div>
    </Modal>
  );
};

export default QRScannerModal;
