// components/SpreedlyForm.tsx
import React, { useEffect, useRef, useState } from 'react';

interface SpreedlyFormProps {
  environmentKey: string;
  styles?: SpreedlyIFrame.SpreedlyIFrameStyles;
  successCallback: (token: string) => void;
  errorCallback?: (errors: SpreedlyIFrame.SpreedlyIFrameError[]) => void;
  paymentMethod?: string; // Optional: Specify a default payment method
}

const SpreedlyForm: React.FC<SpreedlyFormProps> = ({
  environmentKey,
  styles,
  successCallback,
  errorCallback,
  paymentMethod,
}) => {
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const [spreedlyIframe, setSpreedlyIframe] = useState<SpreedlyIFrame.SpreedlyIFrame | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadSpreedlyScript = () => {
      return new Promise<void>((resolve, reject) => {
        const existingScript = document.querySelector('script[src="https://core.spreedly.com/iframe/iframe-v1.min.js"]');
        if (existingScript) {
          console.log('Spreedly script already loaded');
          resolve();
          return;
        }
    
        console.log('Loading Spreedly script...');
        const script = document.createElement('script');
        script.src = 'https://core.spreedly.com/iframe/iframe-v1.min.js';
        script.async = true;
    
        script.onload = () => {
          console.log('Spreedly script loaded successfully');
          resolve();
        };
    
        script.onerror = (error) => {
          console.error('Failed to load Spreedly script:', error);
          reject(new Error('Failed to load Spreedly script'));
        };
    
        document.body.appendChild(script);
      });
    };
  
    const initSpreedlyIframe = async () => {
      try {
        await loadSpreedlyScript();
    
        // Retry mechanism to ensure SpreedlyIFrame is available
        const waitForSpreedly = new Promise<void>((resolve, reject) => {
          const interval = setInterval(() => {
            if ((window as any).SpreedlyIFrame) {
              clearInterval(interval);
              resolve();
            }
          }, 100); // Check every 100ms
    
          setTimeout(() => {
            clearInterval(interval);
            reject(new Error('SpreedlyIFrame is not available after timeout'));
          }, 10000); // Timeout after 5 seconds
        });
    
        await waitForSpreedly;
    
        if (iframeContainerRef.current) {
          const spreedly = (window as any).SpreedlyIFrame;
    
          // Ensure the container has an ID
          iframeContainerRef.current.id = iframeContainerRef.current.id || 'spreedly-container';
    
          spreedly.init(environmentKey, {
            container: iframeContainerRef.current.id,
            numberEl: 'number',
            cvvEl: 'cvv',
            monthEl: 'month',
            yearEl: 'year',
            firstNameEl: 'first_name',
            lastNameEl: 'last_name',
            address1El: 'address1',
            address2El: 'address2',
            cityEl: 'city',
            stateEl: 'state',
            zipEl: 'zip',
            countryEl: 'country',
            style: styles || {},
          });
    
          spreedly.on('ready', () => {
            setIsReady(true);
            if (paymentMethod) {
              spreedly.setPaymentMethodType(paymentMethod);
            }
          });
    
          spreedly.on('tokenReceived', (token: string) => {
            successCallback(token);
          });
    
          spreedly.on('errors', (errors: any[]) => {
            console.error('Spreedly Errors:', errors);
            if (errorCallback) {
              errorCallback(errors);
            }
          });
    
          setSpreedlyIframe(spreedly);
        }
      } catch (error) {
        console.error("Error loading or initializing Spreedly iFrame:", error);
      }
    };
  
    initSpreedlyIframe();
  
    return () => {
      if (spreedlyIframe) {
        spreedlyIframe.destroy();
      }
    };
  }, [environmentKey, styles, successCallback, errorCallback, paymentMethod]);


  return (
    <div>
      <div id="spreedly-container" ref={iframeContainerRef}>
        {/* Spreedly iFrame will be rendered here */}
      </div>

      <div>
        <label htmlFor="number">Card Number:</label>
        <div id="number" style={{ border: '1px solid #ccc', padding: '8px', marginBottom: '8px' }}></div>

        <label htmlFor="cvv">CVV:</label>
        <div id="cvv" style={{ border: '1px solid #ccc', padding: '8px', marginBottom: '8px' }}></div>

        <label htmlFor="month">Expiry Month:</label>
        <div id="month" style={{ border: '1px solid #ccc', padding: '8px', marginBottom: '8px' }}></div>

        <label htmlFor="year">Expiry Year:</label>
        <div id="year" style={{ border: '1px solid #ccc', padding: '8px', marginBottom: '8px' }}></div>

        <label htmlFor="first_name">First Name:</label>
        <div id="first_name" style={{ border: '1px solid #ccc', padding: '8px', marginBottom: '8px' }}></div>

        <label htmlFor="last_name">Last Name:</label>
        <div id="last_name" style={{ border: '1px solid #ccc', padding: '8px', marginBottom: '8px' }}></div>

        <label htmlFor="address1">Address 1:</label>
        <div id="address1" style={{ border: '1px solid #ccc', padding: '8px', marginBottom: '8px' }}></div>

        <label htmlFor="address2">Address 2:</label>
        <div id="address2" style={{ border: '1px solid #ccc', padding: '8px', marginBottom: '8px' }}></div>

        <label htmlFor="city">City:</label>
        <div id="city" style={{ border: '1px solid #ccc', padding: '8px', marginBottom: '8px' }}></div>

        <label htmlFor="state">State:</label>
        <div id="state" style={{ border: '1px solid #ccc', padding: '8px', marginBottom: '8px' }}></div>

        <label htmlFor="zip">Zip:</label>
        <div id="zip" style={{ border: '1px solid #ccc', padding: '8px', marginBottom: '8px' }}></div>

        <label htmlFor="country">Country:</label>
        <div id="country" style={{ border: '1px solid #ccc', padding: '8px', marginBottom: '8px' }}></div>
      </div>
      {!isReady && <div>Loading...</div>}
    </div>
  );
};

export default SpreedlyForm;