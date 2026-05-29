import { ECG_ADC_TO_MV, PACKET_HEADER_BYTE, PACKET_TYPE_ECG } from './BLEConstants'
import type { ECGSample, ParsedECGPacket } from './types'

export function parseECGPacket(base64Value: string): ParsedECGPacket {
  const invalid: ParsedECGPacket = { samples: [], sequenceNumber: 0, valid: false }
  try {
    const binary = atob(base64Value)
    const bytes  = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    const buf = new DataView(bytes.buffer)

    if (buf.byteLength < 6) return invalid
    if (buf.getUint8(0) !== PACKET_HEADER_BYTE) return invalid
    if (buf.getUint8(1) !== PACKET_TYPE_ECG) return invalid

    const sequenceNumber = buf.getUint16(2, true)
    const sampleCount    = buf.getUint16(4, true)
    const expectedLength = 6 + sampleCount * 2 + 2
    if (buf.byteLength < expectedLength) return invalid

    let checksum = 0
    for (let i = 0; i < expectedLength - 2; i++) checksum ^= buf.getUint8(i)
    const receivedChecksum = buf.getUint16(expectedLength - 2, true)
    if (checksum !== receivedChecksum) return invalid

    const now = Date.now()
    const samples: ECGSample[] = []
    for (let i = 0; i < sampleCount; i++) {
      const rawAdc = buf.getInt16(6 + i * 2, true)
      samples.push({ channelMv: rawAdc * ECG_ADC_TO_MV, timestamp: now })
    }
    return { samples, sequenceNumber, valid: true }
  } catch {
    return invalid
  }
}

export function parseHeartRate(base64Value: string): number | null {
  try {
    const binary = atob(base64Value)
    if (binary.length < 2) return null
    const flags   = binary.charCodeAt(0)
    const isUint16 = (flags & 0x01) !== 0
    return isUint16
      ? (binary.charCodeAt(2) << 8) | binary.charCodeAt(1)
      : binary.charCodeAt(1)
  } catch {
    return null
  }
}