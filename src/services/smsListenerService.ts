// SMS Listener Service - Background SMS Monitoring

import { Platform, DeviceEventEmitter, NativeModules } from 'react-native';
import { parseBankSMS, SMSMessage } from './smsPermissionService';

/**
 * SMS Listener for monitoring incoming messages
 * Android only - uses native SMS broadcast receiver
 */
class SMSListenerService {
  private listeners: Array<(message: SMSMessage) => void> = [];
  private isListening = false;

  /**
   * Start listening for incoming SMS
   */
  startListening(): void {
    if (Platform.OS !== 'android') {
      console.warn('SMS listening is only available on Android');
      return;
    }

    if (this.isListening) {
      console.log('SMS listener already active');
      return;
    }

    // Listen for SMS received event
    DeviceEventEmitter.addListener('onSMSReceived', (message: any) => {
      console.log('SMS received:', message);
      
      const smsMessage: SMSMessage = {
        id: message.messageId || Date.now().toString(),
        address: message.originatingAddress || message.address,
        body: message.body || message.message,
        date: message.timestamp || Date.now(),
        read: false,
      };

      // Parse for bank transaction
      const parsed = parseBankSMS(smsMessage);
      
      if (parsed.isTransaction) {
        console.log('Bank transaction detected:', parsed);
        
        // Notify all listeners
        this.notifyListeners({
          ...smsMessage,
          parsed,
        });
      }
    });

    this.isListening = true;
    console.log('SMS listener started');
  }

  /**
   * Stop listening for SMS
   */
  stopListening(): void {
    if (!this.isListening) {
      return;
    }

    DeviceEventEmitter.removeAllListeners('onSMSReceived');
    this.isListening = false;
    console.log('SMS listener stopped');
  }

  /**
   * Add a callback for when bank transaction SMS is received
   */
  addListener(callback: (message: any) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Remove all listeners
   */
  removeAllListeners(): void {
    this.listeners = [];
  }

  /**
   * Notify all registered listeners
   */
  private notifyListeners(message: any): void {
    this.listeners.forEach(callback => {
      try {
        callback(message);
      } catch (error) {
        console.error('Error in SMS listener callback:', error);
      }
    });
  }

  /**
   * Check if listener is active
   */
  isActive(): boolean {
    return this.isListening;
  }
}

// Export singleton instance
export const smsListener = new SMSListenerService();

export default smsListener;
