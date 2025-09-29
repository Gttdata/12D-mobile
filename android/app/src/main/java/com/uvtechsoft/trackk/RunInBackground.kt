package com.uvtechsoft.dimensions

import MyForegroundService
import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.util.Timer

class RunInBackground(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var timer: Timer? = null

    override fun getName(): String {
        return "RunInBackgroundModule"
    }

    @ReactMethod
    fun startForegroundService() {

        val serviceIntent = Intent(reactApplicationContext, MyForegroundService::class.java)
        reactApplicationContext.startService(serviceIntent)

    }

    companion object {
        private const val EVENT_APP_USAGE = "onAppUsageChanged"
    }
}
