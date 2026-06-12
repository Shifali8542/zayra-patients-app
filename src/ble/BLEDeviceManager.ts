import { BleManager, State, Device } from 'react-native-ble-plx'
import { PermissionsAndroid, Platform } from 'react-native'
import {
  BLE_DEVICE_NAME,
  BLE_SERVICES,
  BLE_CHARACTERISTICS,
  BLE_RECONNECT_MAX_ATTEMPTS,
  BLE_RECONNECT_BASE_DELAY_MS,
} from './BLEConstants'
import { parseECGPacket, parseHeartRate } from './ECGPacketParser'
import type { BLEStatus, BLEVitals, ECGSample } from './types'

type StatusListener = (status: BLEStatus, attempt?: number) => void
type VitalsListener = (vitals: BLEVitals) => void
type ECGListener = (samples: ECGSample[]) => void
type ErrorListener = (message: string) => void

export class BLEDeviceManager {
  private manager: BleManager | null = null
  private device: Device | null = null
  private _connected = false
  private reconnectAttempts = 0
  private _isReconnecting = false
  private ecgSubscription: any = null
  private hrSubscription: any = null

  private statusListeners: Set<StatusListener> = new Set()
  private vitalsListeners: Set<VitalsListener> = new Set()
  private ecgListeners: Set<ECGListener> = new Set()
  private errorListeners: Set<ErrorListener> = new Set()

  onStatus(fn: StatusListener) { this.statusListeners.add(fn); return () => this.statusListeners.delete(fn) }
  onVitals(fn: VitalsListener) { this.vitalsListeners.add(fn); return () => this.vitalsListeners.delete(fn) }
  onECG(fn: ECGListener) { this.ecgListeners.add(fn); return () => this.ecgListeners.delete(fn) }
  onError(fn: ErrorListener) { this.errorListeners.add(fn); return () => this.errorListeners.delete(fn) }

  private async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        return result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        return result === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true;
  }

 async connect(): Promise<void> {
    console.log("--- 🚀 BLE CONNECT INITIATED ---");
    
    try {
      this._isReconnecting = false;
      this._connected = false;
      this.reconnectAttempts = 0;
      this.ecgSubscription?.remove();
      this.hrSubscription?.remove();
      this.ecgSubscription = null;
      this.hrSubscription = null;

      if (this.device) {
        try { await this.device.cancelConnection() } catch { }
        this.device = null;
      }

      if (!this.manager) {
        console.log("⚙️ Initializing BleManager...");
        this.manager = new BleManager();
      }

      // 1. Request Permissions
      console.log("🔒 1. Requesting Permissions...");
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log("❌ Permissions denied by user.");
        this.emitError('Bluetooth permissions denied by user.');
        this.emitStatus('error');
        return;
      }
      console.log("✅ Permissions granted!");

     // 2. Turn on Bluetooth Adapter
      console.log("📻 2. Checking Bluetooth Adapter State...");
      
      // Get current state
      let state = await this.manager.state();
      
      // If the bridge is still waking up, wait half a second
      if (state === State.Unknown) {
        console.log("⏳ State is Unknown, waiting 500ms for radio to wake up...");
        await new Promise(resolve => setTimeout(resolve, 500));
        state = await this.manager.state();
      }

      if (state !== State.PoweredOn) {
        console.log("❌ Bluetooth adapter is OFF. Current state:", state);
        this.emitError('Bluetooth is off. Please swipe down from the top of your phone and turn it on manually.');
        this.emitStatus('error');
        return;
      }
      console.log("✅ Bluetooth is Powered On!");

      // 3. Start Scanning
      console.log("📡 3. Starting Device Scan for: " + BLE_DEVICE_NAME);
      this.emitStatus('scanning');
      
      return new Promise((resolve) => {
        this.manager!.startDeviceScan(null, null, async (error, device) => {
          if (error) {
            console.log("❌ Scan error: ", error.message);
            this.emitError(`Scan error: ${error.message}`);
            this.emitStatus('error');
            resolve();
            return;
          }

          console.log(`...found device: ${device?.name || 'Unknown'}`);

          if (device?.name === BLE_DEVICE_NAME) {
            console.log("🎯 MATCH FOUND! Stopping scan...");
            this.manager!.stopDeviceScan();
            this.device = device;
            
            console.log("🔗 Initiating GATT Connection...");
            await this.connectGATT();
            resolve();
          }
        });

        // Auto-stop scan after 15 seconds
        setTimeout(() => {
          this.manager!.stopDeviceScan();
          if (!this.device) {
            console.log("⏰ 15 Seconds passed. Device not found.");
            this.emitError('Zayra-Axiom device not found. Make sure the device is on and nearby.');
            this.emitStatus('idle');
            resolve();
          }
        }, 15000);
      });

    } catch (criticalError: any) {
      console.log("💥 CRITICAL CRASH IN CONNECT():", criticalError.message);
      this.emitError('System error during connection setup.');
      this.emitStatus('error');
    }
  }

  async disconnect(): Promise<void> {
    this._isReconnecting = false
    this._connected = false
    this.reconnectAttempts = 0

    // Clean subscriptions first
    try { this.ecgSubscription?.remove() } catch { }
    try { this.hrSubscription?.remove() } catch { }
    this.ecgSubscription = null
    this.hrSubscription = null

    // Cancel device connection
    if (this.device) {
      try { await this.device.cancelConnection() } catch { }
      this.device = null
    }

    this.emitStatus('idle')
  }

  get isConnected(): boolean {
    return this._connected
  }

  destroy(): void {
    this.manager?.destroy()
    this.manager = null
  }

  private async connectGATT(): Promise<void> {
    if (!this.device) return
    try {
      console.log('🔗 connectGATT: connecting...')
      this.emitStatus('connecting')
      this.device = await this.device.connect()
      console.log('✅ connectGATT: connected, discovering services...')
      this.emitStatus('discovering')
      this.device = await this.device.discoverAllServicesAndCharacteristics()
      console.log('✅ connectGATT: services discovered')

      this.device.onDisconnected((_error, _device) => {
        console.log('⚠️ Device disconnected')
        if (!this._isReconnecting) {
          this._isReconnecting = true
          this.attemptReconnect()
        }
      })

      console.log('📡 Subscribing to ECG...')
      this.subscribeToECG()
      console.log('💓 Subscribing to Vitals...')
      this.subscribeToVitals()
      this.reconnectAttempts = 0
      this._isReconnecting = false
      this._connected = true
      console.log('🟢 STATUS: streaming — BLE fully connected')
      this.emitStatus('streaming')
    } catch (e: unknown) {
      console.log('💥 connectGATT FAILED:', e instanceof Error ? e.message : String(e))
      this._connected = false
      this.emitError(`Could not connect: ${e instanceof Error ? e.message : String(e)}`)
      this.emitStatus('error')
    }
  }

  private async attemptReconnect(): Promise<void> {
    while (this._isReconnecting && this.reconnectAttempts < BLE_RECONNECT_MAX_ATTEMPTS) {
      this.reconnectAttempts++
      this.emitStatus('reconnecting', this.reconnectAttempts)
      await sleep(BLE_RECONNECT_BASE_DELAY_MS * Math.pow(2, this.reconnectAttempts - 1))
      if (!this._isReconnecting) return
      try {
        await this.connectGATT()
        return
      } catch { }
    }
    this._isReconnecting = false
    this.emitStatus('disconnected')
    this.emitError('Device disconnected. Please reconnect manually.')
  }

  private subscribeToECG(): void {
    if (!this.device) return
    try {
      let packetCount = 0
      this.ecgSubscription = this.device.monitorCharacteristicForService(
        BLE_SERVICES.ECG,
        BLE_CHARACTERISTICS.ECG_STREAM,
        (_error, characteristic) => {
          if (_error) {
            console.log('❌ ECG subscription error:', _error.message)
            return
          }
          if (!characteristic?.value) return
          const parsed = parseECGPacket(characteristic.value)
          packetCount++
          if (packetCount % 50 === 0) {
            console.log(`📦 ECG packets received: ${packetCount}, valid: ${parsed.valid}, samples: ${parsed.samples?.length}`)
          }
          if (parsed.valid) this.ecgListeners.forEach(fn => fn(parsed.samples))
        }
      )
      console.log('✅ ECG subscription active')
    } catch (e: any) {
      console.log('❌ subscribeToECG failed:', e.message)
    }
  }

  private subscribeToVitals(): void {
    if (!this.device) return
    try {
      this.hrSubscription = this.device.monitorCharacteristicForService(
        BLE_SERVICES.VITALS,
        BLE_CHARACTERISTICS.VITALS_HR,
        (_error, characteristic) => {
          if (!characteristic?.value) return
          const hr = parseHeartRate(characteristic.value)
          if (hr !== null) {
            this.vitalsListeners.forEach(fn => fn({ heartRate: hr, spO2: null, timestamp: Date.now() }))
          }
        }
      )
    } catch { }
  }

  private emitStatus(s: BLEStatus, attempt?: number) { this.statusListeners.forEach(fn => fn(s, attempt)) }
  private emitError(m: string) { this.errorListeners.forEach(fn => fn(m)) }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
export const bleDeviceManager = new BLEDeviceManager()