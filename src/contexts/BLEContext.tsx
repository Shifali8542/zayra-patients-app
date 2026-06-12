import React, { createContext, useContext, type ReactNode } from 'react'
import { useBLEDevice, type BLEDeviceHookResult } from '../ble/useBLEDevice'
import { useAuth } from './AuthContext'

const BLEContext = createContext<BLEDeviceHookResult | null>(null)

export function BLEProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
const patientCode = (user as any)?.patient_code ?? undefined
const ble = useBLEDevice(patientCode)
  return <BLEContext.Provider value={ble}>{children}</BLEContext.Provider>
}

export function useBLEContext(): BLEDeviceHookResult {
  const ctx = useContext(BLEContext)
  if (!ctx) throw new Error('useBLEContext must be used within BLEProvider')
  return ctx
}