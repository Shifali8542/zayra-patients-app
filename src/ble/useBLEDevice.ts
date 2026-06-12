import { useState, useEffect, useCallback, useRef } from 'react'
import { bleDeviceManager } from './BLEDeviceManager'
import { ECG_RING_BUFFER_SIZE } from './BLEConstants'
import type { BLEStatus, BLEVitals, ECGSample } from './types'

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

  const ecgRingBufferRef = useRef(new Float32Array(ECG_RING_BUFFER_SIZE))
  const ecgWriteIndexRef = useRef(0)

  useEffect(() => {
    const unsubStatus = bleDeviceManager.onStatus((s, attempt) => {
      setStatus(s)
      if (attempt !== undefined) setReconnect(attempt)
    })
    const unsubVitals = bleDeviceManager.onVitals(setVitals)
    const unsubError  = bleDeviceManager.onError(setError)
    const unsubECG    = bleDeviceManager.onECG((samples: ECGSample[]) => {
      for (const sample of samples) {
        ecgRingBufferRef.current[ecgWriteIndexRef.current % ECG_RING_BUFFER_SIZE] = sample.channelMv
        ecgWriteIndexRef.current++
      }
    })
    return () => { unsubStatus(); unsubVitals(); unsubError(); unsubECG() }
  }, [])

  const connect    = useCallback(() => bleDeviceManager.connect(), [])
  const disconnect = useCallback(() => bleDeviceManager.disconnect(), [])

  return { status, vitals, error, reconnectAttempt, ecgRingBufferRef, ecgWriteIndexRef, connect, disconnect }
}