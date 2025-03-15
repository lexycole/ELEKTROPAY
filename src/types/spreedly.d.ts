// types/spreedly.d.ts

declare namespace SpreedlyIFrame {
    interface SpreedlyIFrameStyles {
      'font-family'?: string;
      base?: {
        color?: string;
        'font-size'?: string;
      };
      valid?: {
        color?: string;
      };
      invalid?: {
        color?: string;
      };
    }
  
    interface SpreedlyIFrameError {
      attribute: string;
      message: string;
    }
  
    interface SpreedlyIFrame {
      init(
        environmentKey: string,
        options: {
          container: string;
          numberEl: string;
          cvvEl: string;
          monthEl: string;
          yearEl: string;
          firstNameEl: string;
          lastNameEl: string;
          address1El: string;
          address2El: string;
          cityEl: string;
          stateEl: string;
          zipEl: string;
          countryEl: string;
          style?: SpreedlyIFrameStyles;
        }
      ): void;
      on(event: 'ready', callback: () => void): void;
      on(event: 'tokenReceived', callback: (token: string) => void): void;
      on(event: 'errors', callback: (errors: SpreedlyIFrameError[]) => void): void;
      setPaymentMethodType(paymentMethod: string): void;
      destroy(): void;
    }
  }
  
  // Extend the global Window interface
  interface Window {
    SpreedlyIFrame: SpreedlyIFrame.SpreedlyIFrame;
  }