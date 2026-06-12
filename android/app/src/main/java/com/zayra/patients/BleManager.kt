package com.your.packagename // Make sure this matches your project!

import android.annotation.SuppressLint
import android.bluetooth.*
import android.bluetooth.le.*
import android.content.Context
import android.util.Log

class BleManager(private val context: Context) {

    private val bluetoothManager: BluetoothManager = context.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
    private val bluetoothAdapter: BluetoothAdapter? = bluetoothManager.adapter
    private val bleScanner: BluetoothLeScanner? = bluetoothAdapter?.bluetoothLeScanner
    private var bluetoothGatt: BluetoothGatt? = null

    // Replace with your ESP32's actual name
    private val TARGET_DEVICE_NAME = "Zayra_ESP32" 

    // --- STEP 2: SCANNING LOGIC ---
    @SuppressLint("MissingPermission")
    fun startScanning() {
        if (bleScanner == null) {
            Log.e("BLE", "Bluetooth not enabled or not supported")
            return
        }
        Log.i("BLE", "Starting scan...")
        bleScanner.startScan(scanCallback)
    }

    private val scanCallback = object : ScanCallback() {
        @SuppressLint("MissingPermission")
        override fun onScanResult(callbackType: Int, result: ScanResult) {
            val device = result.device
            val deviceName = device.name ?: "Unknown"

            if (deviceName == TARGET_DEVICE_NAME) {
                Log.i("BLE", "Found ESP32! Stopping scan and connecting...")
                bleScanner?.stopScan(this)
                connectToDevice(device)
            }
        }
    }

    // --- STEP 3: CONNECTION & DATA LOGIC ---
    @SuppressLint("MissingPermission")
    private fun connectToDevice(device: BluetoothDevice) {
        bluetoothGatt = device.connectGatt(context, false, gattCallback)
    }

    private val gattCallback = object : BluetoothGattCallback() {
        @SuppressLint("MissingPermission")
        override fun onConnectionStateChange(gatt: BluetoothGatt, status: Int, newState: Int) {
            if (newState == BluetoothProfile.STATE_CONNECTED) {
                Log.i("BLE", "Connected! Discovering services...")
                gatt.discoverServices()
            }
        }

        @SuppressLint("MissingPermission")
        override fun onServicesDiscovered(gatt: BluetoothGatt, status: Int) {
            if (status == BluetoothGatt.GATT_SUCCESS) {
                // Update these to match your MicroPython code
                val serviceUuid = java.util.UUID.fromString("YOUR-SERVICE-UUID-HERE")
                val charUuid = java.util.UUID.fromString("YOUR-CHARACTERISTIC-UUID-HERE")
                
                val characteristic = gatt.getService(serviceUuid)?.getCharacteristic(charUuid)
                if (characteristic != null) {
                    gatt.setCharacteristicNotification(characteristic, true)
                    val descriptor = characteristic.getDescriptor(
                        java.util.UUID.fromString("00002902-0000-1000-8000-00805f9b34fb")
                    )
                    descriptor.value = BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE
                    gatt.writeDescriptor(descriptor)
                }
            }
        }

        override fun onCharacteristicChanged(gatt: BluetoothGatt, characteristic: BluetoothGattCharacteristic) {
            val dataBytes = characteristic.value
            val samples = parseEcgBytesToIntArray(dataBytes)
            Log.i("BLE", "Received ECG Data: $samples")
            // TODO: Send 'samples' to your Django /ble-upload/ API here
        }
    }

    private fun parseEcgBytesToIntArray(bytes: ByteArray): List<Int> {
        val integers = mutableListOf<Int>()
        for (i in bytes.indices step 2) {
            if (i + 1 < bytes.size) {
                val value = (bytes[i].toInt() and 0xFF) or ((bytes[i+1].toInt() and 0xFF) shl 8)
                integers.add(value)
            }
        }
        return integers
    }
}