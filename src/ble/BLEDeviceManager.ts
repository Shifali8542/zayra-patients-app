import { BleManager, State, Device } from 'react-native-ble-plx'
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

  async connect(): Promise<void> {
    this.device = null
    this.reconnectAttempts = 0
    this._isReconnecting = false

    if (!this.manager) this.manager = new BleManager()

    const state = await this.manager.state()
    if (state !== State.PoweredOn) {
      this.emitError('Bluetooth is off. Please enable Bluetooth and try again.')
      this.emitStatus('error')
      return
    }

   this.emitStatus('scanning')
    return new Promise((resolve) => {
      this.manager!.startDeviceScan(null, null, async (error, device) => {
        if (error) {
          this.emitError(`Scan error: ${error.message}`)
          this.emitStatus('error')
          resolve()
          return
        }
        if (device?.name === BLE_DEVICE_NAME) {
          this.manager!.stopDeviceScan()
          this.device = device
          await this.connectGATT()
          resolve()
        }
      })
      // Auto-stop scan after 15 seconds
      setTimeout(() => {
        this.manager!.stopDeviceScan()
        if (!this.device) {
          this.emitError('Zayra-Axiom device not found. Make sure the device is on and nearby.')
          this.emitStatus('idle')
          resolve()
        }
      }, 15000)
    })
  }

  async disconnect(): Promise<void> {
    this._isReconnecting = false
    this._connected = false
    this.reconnectAttempts = 0
    this.ecgSubscription?.remove()
    this.hrSubscription?.remove()
    if (this.device) {
      try { await this.device.cancelConnection() } catch { }
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
      this.emitStatus('connecting')
      this.device = await this.device.connect()
      this.emitStatus('discovering')
      this.device = await this.device.discoverAllServicesAndCharacteristics()

      this.device.onDisconnected((_error, _device) => {
        if (!this._isReconnecting) {
          this._isReconnecting = true
          this.attemptReconnect()
        }
      })

      this.subscribeToECG()
      this.subscribeToVitals()
      this.reconnectAttempts = 0
      this._isReconnecting = false
      this._connected = true
      this.emitStatus('streaming')
    } catch (e: unknown) {
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
      this.ecgSubscription = this.device.monitorCharacteristicForService(
        BLE_SERVICES.ECG,
        BLE_CHARACTERISTICS.ECG_STREAM,
        (_error, characteristic) => {
          if (!characteristic?.value) return
          const parsed = parseECGPacket(characteristic.value)
          if (parsed.valid) this.ecgListeners.forEach(fn => fn(parsed.samples))
        }
      )
    } catch { }
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