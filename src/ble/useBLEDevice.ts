import { useState, useEffect, useCallback, useRef } from 'react'
import { bleDeviceManager } from './BLEDeviceManager'
import { ECG_RING_BUFFER_SIZE } from './BLEConstants'
import type { BLEStatus, BLEVitals, ECGSample } from './types'
import { api } from '../services/api'

const UPLOAD_CHUNK_SIZE = 500

export interface BLEDeviceHookResult {
  status: BLEStatus
  vitals: BLEVitals | null
  error: string | null
  reconnectAttempt: number
  ecgRingBufferRef: React.MutableRefObject<Float32Array>
  ecgWriteIndexRef: React.MutableRefObject<number>
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

export function useBLEDevice(patientCode?: string): BLEDeviceHookResult {
  const [status, setStatus]               = useState<BLEStatus>('idle')
  const [vitals, setVitals]               = useState<BLEVitals | null>(null)
  const [error, setError]                 = useState<string | null>(null)
  const [reconnectAttempt, setReconnect]  = useState(0)

  const ecgRingBufferRef  = useRef(new Float32Array(ECG_RING_BUFFER_SIZE))
  const ecgWriteIndexRef  = useRef(0)
  const uploadBufferRef   = useRef<number[]>([])
  const vitalsRef         = useRef<BLEVitals | null>(null)
  const patientCodeRef    = useRef<string | undefined>(patientCode)

  useEffect(() => { vitalsRef.current = vitals }, [vitals])
  useEffect(() => { patientCodeRef.current = patientCode }, [patientCode])

  useEffect(() => {
    const unsubStatus = bleDeviceManager.onStatus((s, attempt) => {
      setStatus(s)
      if (attempt !== undefined) setReconnect(attempt)
    })
    const unsubVitals = bleDeviceManager.onVitals((v) => {
      setVitals(v)
      vitalsRef.current = v
    })
    const unsubError  = bleDeviceManager.onError(setError)
    const unsubECG    = bleDeviceManager.onECG((samples: ECGSample[]) => {
      for (const sample of samples) {
        // Write to ring buffer for ECGChart display
        ecgRingBufferRef.current[ecgWriteIndexRef.current % ECG_RING_BUFFER_SIZE] = sample.channelMv
        ecgWriteIndexRef.current++

        // Accumulate for backend upload (convert mV → ADC int × 1000)
        uploadBufferRef.current.push(Math.round(sample.channelMv * 1000))

        // When we have a full chunk, POST to backend
        if (uploadBufferRef.current.length >= UPLOAD_CHUNK_SIZE) {
          const chunk = uploadBufferRef.current.splice(0, UPLOAD_CHUNK_SIZE)
          const code  = patientCodeRef.current ?? 'unknown'
          const hr    = vitalsRef.current?.heartRate ?? null
          console.log('📤 BLE upload firing, patient_code:', code, 'samples:', chunk.length)
          api.patient.bleUpload({
            patient_code:   code,
            samples:        chunk,
            sampling_hz:    500,
            heart_rate_bpm: hr,
          }).catch((e) => {
            console.log('❌ BLE upload failed:', e?.message)
          })
        }
      }
    })
    return () => { unsubStatus(); unsubVitals(); unsubError(); unsubECG() }
  }, []) 

  const connect    = useCallback(() => bleDeviceManager.connect(), [])
  const disconnect = useCallback(() => {
    return bleDeviceManager.disconnect();
  }, [])

  return { status, vitals, error, reconnectAttempt, ecgRingBufferRef, ecgWriteIndexRef, connect, disconnect }
}