package com.uvtechsoft.dimensions

import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.provider.Settings
import android.util.Log
import com.facebook.react.bridge.*

class AppUsageModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val usageStatsManager: UsageStatsManager =
        reactContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

    override fun getName(): String {
        return "AppUsageModule"
    }

    @ReactMethod
    fun checkUsagePermission(promise: Promise) {
        val context = reactApplicationContext
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as android.app.AppOpsManager
        val mode = appOps.checkOpNoThrow(
            "android:get_usage_stats",
            android.os.Process.myUid(),
            context.packageName
        )

        val granted = mode == android.app.AppOpsManager.MODE_ALLOWED
        promise.resolve(granted)
    }

    @ReactMethod
    fun requestUsagePermission() {
        val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactApplicationContext.startActivity(intent)
    }

    @ReactMethod
    fun getUsageStats(promise: Promise) {
        val endTime = System.currentTimeMillis()
        val startTime = endTime - (1000 * 60 * 60 * 24) 

        val usageStatsList: List<UsageStats> = usageStatsManager.queryUsageStats(
            UsageStatsManager.INTERVAL_DAILY, startTime, endTime
        ) ?: emptyList()

        val result = Arguments.createArray()

        for (usageStats in usageStatsList) {
            val appInfo = Arguments.createMap()
            appInfo.putString("packageName", usageStats.packageName)
            appInfo.putDouble("totalTimeInForeground", (usageStats.totalTimeInForeground / 1000).toDouble()) // Convert to seconds
            result.pushMap(appInfo)
        }

        promise.resolve(result)
    }
}