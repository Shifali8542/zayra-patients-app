export type BLEStatus =
  | 'idle'
  | 'scanning'
  | 'connecting'
  | 'discovering'
  | 'streaming'
  | 'reconnecting'
  | 'disconnected'
  | 'error'

export interface BLEVitals {
  heartRate: number | null
  spO2: number | null
  timestamp: number
}

export interface ECGSample {
  channelMv: number
  timestamp: number
}

export interface ParsedECGPacket {
  samples: ECGSample[]
  sequenceNumber: number
  valid: boolean
}