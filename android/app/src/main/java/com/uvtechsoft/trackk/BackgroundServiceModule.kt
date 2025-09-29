package com.uvtechsoft.dimensions

import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import androidx.core.content.ContextCompat.startForegroundService
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.uvtechsoft.dimensions.BackgroundServiceReminder
import java.util.Timer
import java.util.TimerTask
import com.facebook.react.bridge.Promise

class BackgroundServiceModule(reactContext: ReactApplicationContext?) :
    ReactContextBaseJavaModule(reactContext) {
    private var timer: Timer? = null
    private var isServiceRunning = false

    override fun getName(): String {

        return "BackgroundServiceCheck"
    }

    @ReactMethod
    fun startBackgroundService(selectedPackageNamesJSON: String,DetoxConfig:String) {
        val context: Context = reactApplicationContext 
        timer = Timer()
        timer!!.schedule(object : TimerTask() {
            override fun run() {
                Log.d("Services","is Calling")
                isServiceRunning = true;

                val serviceIntent = Intent(
                    context,
                    BackgroundService::class.java)

                serviceIntent.putExtra("selectedPackageNamesJSON", selectedPackageNamesJSON)
                serviceIntent.putExtra("DetoxConfig", DetoxConfig)

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    startForegroundService(reactApplicationContext,serviceIntent)
                } else {

                    context.startService(serviceIntent)
                }
            }
        }, 5000, 5000)
    }

    @ReactMethod
    fun stopBackgroundService() {
        val context: Context = reactApplicationContext

        // Cancel timer and stop service
        timer?.cancel()
        timer = null
        isServiceRunning = false

        // Clear all blocking states
        val overlayPref = context.getSharedPreferences("OverlayPrefs", Context.MODE_PRIVATE)
        with(overlayPref.edit()) {
            clear()
            apply()
        }

        // Stop the service
        val serviceIntent = Intent(context, BackgroundService::class.java)
        val isStopped = context.stopService(serviceIntent)

        if (isStopped) {
            Log.d("BackgroundService", "Service stopped successfully")
        } else {
            Log.d("BackgroundService", "Service was not running")
        }
    }

    @ReactMethod
    fun isBackgroundServiceRunning(promise: Promise) {
        promise.resolve(isServiceRunning)
    }
    @ReactMethod
    fun startBackgroundReminder(data: ReadableArray) {
        val context: Context = reactApplicationContext
        val serviceIntent = Intent(context, BackgroundServiceReminder::class.java)
        serviceIntent.putExtra("data", data.toArrayList()) 
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(context, serviceIntent)
        } else {
            context.startService(serviceIntent)
        }

    }
    companion object {
        private const val INTERVAL: Long = 10000 
    }


}
