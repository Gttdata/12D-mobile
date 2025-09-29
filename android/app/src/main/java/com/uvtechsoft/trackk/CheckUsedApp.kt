import android.app.AppOpsManager
import android.app.admin.DeviceAdminReceiver
import android.app.admin.DevicePolicyManager
import android.app.usage.UsageStatsManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.AdaptiveIconDrawable
import android.graphics.drawable.BitmapDrawable
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.os.Process
import android.provider.Settings
import android.util.Base64
import android.util.Log
import android.widget.Toast
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.ByteArrayOutputStream
import java.util.Calendar
import java.util.concurrent.TimeUnit


class CheckUsedApp(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val MODULE_NAME = "CheckUsedApp"
        const val EVENT_APP_USAGE = "onAppUsageChanged"
        private const val REQUEST_USAGE_STATS_PERMISSION = 123
        private const val REQUEST_DEVICE_ADMIN_PERMISSION = 1001

    }

    override fun getName(): String {
        return MODULE_NAME
    }

    @ReactMethod
    fun requestUsageStatsPermission() {
        if (!hasUsageStatsPermission()) {
            // Request permission
            val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
            reactApplicationContext.startActivityForResult(intent, REQUEST_USAGE_STATS_PERMISSION, null)
        }
    }

    @RequiresApi(Build.VERSION_CODES.M)
    @ReactMethod
    fun hasOverlayPermission(promise: Promise) {
        try {
            val canDrawOverlays = Settings.canDrawOverlays(reactApplicationContext)
            promise.resolve(canDrawOverlays)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }



    @ReactMethod
    fun requestOverlayPermission() {
        try {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:" + reactApplicationContext.packageName)
            )
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(intent)
//            successCallback.invoke()
        } catch (e: java.lang.Exception) {
//            errorCallback.invoke(e.message)
        }
    }


    @RequiresApi(Build.VERSION_CODES.M)
    @ReactMethod
    fun requestBatteryOptimizationExemption() {
        val packageName = reactApplicationContext.packageName
        val powerManager = reactApplicationContext.getSystemService(Context.POWER_SERVICE) as PowerManager

        if (!powerManager.isIgnoringBatteryOptimizations(packageName)) {

            val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS)
            intent.data = Uri.parse("package:$packageName")
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            try {



                reactApplicationContext.startActivity(intent)
            } catch (e: Exception) {
            }
        } else {

        }
    }

    @ReactMethod
    fun requestDeviceAdminPermission() {
        val dpm = reactApplicationContext.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        val componentName = ComponentName(reactApplicationContext, MyDeviceAdminReceiver::class.java)

        if (!dpm.isAdminActive(componentName)) {

            val intent = Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN)
            intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, componentName)
            intent.putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION, "Reason for requesting device admin permission")
            reactApplicationContext.startActivityForResult(intent, REQUEST_DEVICE_ADMIN_PERMISSION, null)

        }else{


        }
    }





    @ReactMethod
    fun sendAppUsageListToRN(appUsageList: ArrayList<HashMap<String, Any>>) {
        val appUsageArray = Arguments.createArray()

        for (item in appUsageList) {
            val appInfoMap = Arguments.createMap()
            for ((key, value) in item) {
                // Convert Any type values to String if necessary
                val stringValue = value.toString()
                appInfoMap.putString(key, stringValue)
            }
            appUsageArray.pushMap(appInfoMap)
        }

        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(EVENT_APP_USAGE, appUsageArray)
    }

    @RequiresApi(Build.VERSION_CODES.O)
    @ReactMethod
    fun getAppINTERVAL_DAILY() {
        if (hasUsageStatsPermission()) {
            val currentTimeMillis = System.currentTimeMillis()
            val calendar = Calendar.getInstance()
            calendar.timeInMillis = currentTimeMillis
            calendar.set(Calendar.HOUR_OF_DAY, 0)
            calendar.set(Calendar.MINUTE, 0)
            calendar.set(Calendar.SECOND, 0)
            val startTimestamp = calendar.timeInMillis
            calendar.set(Calendar.HOUR_OF_DAY, 23)
            calendar.set(Calendar.MINUTE, 59)
            calendar.set(Calendar.SECOND, 59)
            val endTimestamp = calendar.timeInMillis
            val currentTime = System.currentTimeMillis()

            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

            val usageStatsList = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTimestamp,
                endTimestamp
            )



            val pm = reactApplicationContext.packageManager
            val appUsageMap = HashMap<String, HashMap<String, Any>>() // Change the value type to Any to hold the icon drawable

            for (usageStats in usageStatsList) {
                val packageName = usageStats.packageName

                if (pm.getLaunchIntentForPackage(packageName) != null){
                    val appInfo = appUsageMap.getOrPut(packageName) { HashMap<String, Any>() }

                    if (!appInfo.containsKey("totalTimeInForeground") ||
                        usageStats.totalTimeInForeground > (appInfo["totalTimeInForeground"] as? Long ?: 0L)) {
                        val appname = getAppName(packageName);
                        val total = usageStats.totalTimeInForeground.toString();
                        appInfo["packageName"] = packageName
                        appInfo["appName"] = getAppName(packageName)
                        appInfo["sfirstTimeStamp"] = usageStats.firstTimeStamp.toString()
                        appInfo["lastTimeStamp"] = usageStats.lastTimeStamp.toString()
                        appInfo["totalTimeInForeground"] = usageStats.totalTimeInForeground.toString()
                        appInfo["lastTimeUsed"] = usageStats.lastTimeUsed.toString()
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                            appInfo["totalTimeForegroundServiceUsed"] = usageStats.totalTimeForegroundServiceUsed.toString()
                        }
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                            appInfo["totalTimeVisible"] = usageStats.totalTimeVisible.toString()
                        }
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                            appInfo["lastTimeForegroundServiceUsed"] = usageStats.lastTimeForegroundServiceUsed.toString()
                        }

                        // Get the application icon
                        val appIconDrawable = pm.getApplicationIcon(packageName)
                        val appIconBitmap = when (appIconDrawable) {
                            is BitmapDrawable -> appIconDrawable.bitmap
                            is AdaptiveIconDrawable -> {
                                val bitmap = Bitmap.createBitmap(
                                    appIconDrawable.intrinsicWidth,
                                    appIconDrawable.intrinsicHeight,
                                    Bitmap.Config.ARGB_8888
                                )
                                val canvas = Canvas(bitmap)
                                appIconDrawable.setBounds(0, 0, canvas.width, canvas.height)
                                appIconDrawable.draw(canvas)
                                bitmap
                            }
                            else -> null
                        }

                        val appIconBase64: String = appIconBitmap?.let { bitmapToBase64(it) } ?: ""
                        appInfo["appIcon"] = appIconBase64



                    }
                }

                // Check if the current app has more usage time than the existing entry

            }


            val appUsageList = ArrayList(appUsageMap.values)

            sendAppUsageListToRN(appUsageList)

        } else {
            // Permission not granted, log or handle accordingly
            Toast.makeText(reactApplicationContext, "Please Allow Usage Permission", Toast.LENGTH_SHORT).show();
        }
    }




//    @ReactMethod
//    fun getAppUsageINTERVAL_DAILY(startDate: Double, endDate: Double) {
//        if (hasUsageStatsPermission()) {
//            val startTimestamp = startDate.toLong()
//            val endTimestamp = endDate.toLong()
//            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
//
//            val usageStatsList = usageStatsManager.queryUsageStats(
//                UsageStatsManager.INTERVAL_DAILY,
//                startTimestamp,
//                endTimestamp
//            )
//
//            Log.d("usageStatsList", "usageStatsList: $usageStatsList")
//
//            val appUsageList = ArrayList<HashMap<String, String>>()
//            for (usageStats in usageStatsList) {
//                val appInfo = HashMap<String, String>()
//                appInfo["packageName"] = usageStats.packageName
//                appInfo["appName"] = getAppName(usageStats.packageName)
//                appInfo["firstTimeStamp"] = usageStats.firstTimeStamp.toString()
//                appInfo["lastTimeStamp"] = usageStats.lastTimeStamp.toString()
//                appInfo["totalTimeInForeground"] = usageStats.totalTimeInForeground.toString()
//                appInfo["lastTimeUsed"] = usageStats.lastTimeUsed.toString()
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["totalTimeForegroundServiceUsed"] = usageStats.totalTimeForegroundServiceUsed.toString()
//                }
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["totalTimeVisible"] = usageStats.totalTimeVisible.toString()
//                }
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["lastTimeForegroundServiceUsed"] = usageStats.lastTimeForegroundServiceUsed.toString()
//                }
//
//                appUsageList.add(appInfo)
//            }
//
//            // Log the appUsageList or emit an event
//            Log.d("CheckUsedApp", "App Usage List: $appUsageList")
//            sendAppUsageListToRN(appUsageList)
//
//        } else {
//            // Permission not granted, log or handle accordingly
//            Toast.makeText(reactApplicationContext, "Please Allow Usage Permission", Toast.LENGTH_SHORT).show();
//            Log.d("CheckUsedApp", "Usage stats permission not granted")
//        }
//    }
//
//
//    @ReactMethod
//    fun getAppUsageINTERVAL_MONTHLY(startDate: Double, endDate: Double) {
//        if (hasUsageStatsPermission()) {
//            val startTimestamp = startDate.toLong()
//            val endTimestamp = endDate.toLong()
//            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
//
//            val usageStatsList = usageStatsManager.queryUsageStats(
//                UsageStatsManager.INTERVAL_MONTHLY,
//                startTimestamp,
//                endTimestamp
//            )
//
//            Log.d("usageStatsList", "usageStatsList: $usageStatsList")
//
//            val appUsageList = ArrayList<HashMap<String, String>>()
//            for (usageStats in usageStatsList) {
//                val appInfo = HashMap<String, String>()
//                appInfo["packageName"] = usageStats.packageName
//                appInfo["appName"] = getAppName(usageStats.packageName)
//                appInfo["firstTimeStamp"] = usageStats.firstTimeStamp.toString()
//                appInfo["lastTimeStamp"] = usageStats.lastTimeStamp.toString()
//                appInfo["totalTimeInForeground"] = usageStats.totalTimeInForeground.toString()
//                appInfo["lastTimeUsed"] = usageStats.lastTimeUsed.toString()
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["totalTimeForegroundServiceUsed"] = usageStats.totalTimeForegroundServiceUsed.toString()
//                }
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["totalTimeVisible"] = usageStats.totalTimeVisible.toString()
//                }
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["lastTimeForegroundServiceUsed"] = usageStats.lastTimeForegroundServiceUsed.toString()
//                }
//
//                appUsageList.add(appInfo)
//            }
//
//            sendAppUsageListToRN(appUsageList)
//
//
//            // Log the appUsageList or emit an event
//            Log.d("CheckUsedApp", "App Usage List: $appUsageList")
//        } else {
//            // Permission not granted, log or handle accordingly
//            Toast.makeText(reactApplicationContext, "Please Allow Usage Permission", Toast.LENGTH_SHORT).show();
//            Log.d("CheckUsedApp", "Usage stats permission not granted")
//        }
//    }
// @ReactMethod
//    fun getAppUsageINTERVAL_YEARLY(startDate: Double, endDate: Double) {
//        if (hasUsageStatsPermission()) {
//            val startTimestamp = startDate.toLong()
//            val endTimestamp = endDate.toLong()
//            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
//
//            val usageStatsList = usageStatsManager.queryUsageStats(
//                UsageStatsManager.INTERVAL_YEARLY,
//                startTimestamp,
//                endTimestamp
//            )
//
//            Log.d("usageStatsList", "usageStatsList: $usageStatsList")
//
//            val appUsageList = ArrayList<HashMap<String, String>>()
//            for (usageStats in usageStatsList) {
//                val appInfo = HashMap<String, String>()
//                appInfo["packageName"] = usageStats.packageName
//                appInfo["appName"] = getAppName(usageStats.packageName)
//
//                appInfo["firstTimeStamp"] = usageStats.firstTimeStamp.toString()
//                appInfo["lastTimeStamp"] = usageStats.lastTimeStamp.toString()
//                appInfo["totalTimeInForeground"] = usageStats.totalTimeInForeground.toString()
//                appInfo["lastTimeUsed"] = usageStats.lastTimeUsed.toString()
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["totalTimeForegroundServiceUsed"] = usageStats.totalTimeForegroundServiceUsed.toString()
//                }
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["totalTimeVisible"] = usageStats.totalTimeVisible.toString()
//                }
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["lastTimeForegroundServiceUsed"] = usageStats.lastTimeForegroundServiceUsed.toString()
//                }
//
//                appUsageList.add(appInfo)
//            }
//
//            // Log the appUsageList or emit an event
//            sendAppUsageListToRN(appUsageList)
//
//            Log.d("CheckUsedApp", "App Usage List: $appUsageList")
//        } else {
//            // Permission not granted, log or handle accordingly
//            Toast.makeText(reactApplicationContext, "Please Allow Usage Permission", Toast.LENGTH_SHORT).show();
//            Log.d("CheckUsedApp", "Usage stats permission not granted")
//        }
//    }
//@ReactMethod
//    fun getAppUsageINTERVAL_BEST(startDate: Double, endDate: Double) {
//        if (hasUsageStatsPermission()) {
//            val startTimestamp = startDate.toLong()
//            val endTimestamp = endDate.toLong()
//            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
//
//            val usageStatsList = usageStatsManager.queryUsageStats(
//                UsageStatsManager.INTERVAL_BEST,
//                startTimestamp,
//                endTimestamp
//            )
//
//            Log.d("usageStatsList", "usageStatsList: $usageStatsList")
//
//            val appUsageList = ArrayList<HashMap<String, String>>()
//            for (usageStats in usageStatsList) {
//                val appInfo = HashMap<String, String>()
//                appInfo["packageName"] = usageStats.packageName
//                appInfo["appName"] = getAppName(usageStats.packageName)
//
//                appInfo["firstTimeStamp"] = usageStats.firstTimeStamp.toString()
//                appInfo["lastTimeStamp"] = usageStats.lastTimeStamp.toString()
//                appInfo["totalTimeInForeground"] = usageStats.totalTimeInForeground.toString()
//                appInfo["lastTimeUsed"] = usageStats.lastTimeUsed.toString()
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["totalTimeForegroundServiceUsed"] = usageStats.totalTimeForegroundServiceUsed.toString()
//                }
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["totalTimeVisible"] = usageStats.totalTimeVisible.toString()
//                }
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["lastTimeForegroundServiceUsed"] = usageStats.lastTimeForegroundServiceUsed.toString()
//                }
//
//                appUsageList.add(appInfo)
//            }
//
//            // Log the appUsageList or emit an event
//            Log.d("CheckUsedApp", "App Usage List: $appUsageList")
//            sendAppUsageListToRN(appUsageList)
//
//        } else {
//            // Permission not granted, log or handle accordingly
//            Toast.makeText(reactApplicationContext, "Please Allow Usage Permission", Toast.LENGTH_SHORT).show();
//            Log.d("CheckUsedApp", "Usage stats permission not granted")
//        }
//    }
//@ReactMethod
//    fun getAppUsageINTERVAL_WEEKLY(startDate: Double, endDate: Double) {
//        if (hasUsageStatsPermission()) {
//            val startTimestamp = startDate.toLong()
//            val endTimestamp = endDate.toLong()
//            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
//
//            val usageStatsList = usageStatsManager.queryUsageStats(
//                UsageStatsManager.INTERVAL_WEEKLY,
//                startTimestamp,
//                endTimestamp
//            )
//
//            Log.d("usageStatsList", "usageStatsList: $usageStatsList")
//
//            val appUsageList = ArrayList<HashMap<String, String>>()
//            for (usageStats in usageStatsList) {
//                val appInfo = HashMap<String, String>()
//                appInfo["packageName"] = usageStats.packageName
//                appInfo["appName"] = getAppName(usageStats.packageName)
//
//                appInfo["firstTimeStamp"] = usageStats.firstTimeStamp.toString()
//                appInfo["lastTimeStamp"] = usageStats.lastTimeStamp.toString()
//                appInfo["totalTimeInForeground"] = usageStats.totalTimeInForeground.toString()
//                appInfo["lastTimeUsed"] = usageStats.lastTimeUsed.toString()
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["totalTimeForegroundServiceUsed"] = usageStats.totalTimeForegroundServiceUsed.toString()
//                }
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["totalTimeVisible"] = usageStats.totalTimeVisible.toString()
//                }
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["lastTimeForegroundServiceUsed"] = usageStats.lastTimeForegroundServiceUsed.toString()
//                }
//
//                appUsageList.add(appInfo)
//            }
//
//            // Log the appUsageList or emit an event
//            Log.d("CheckUsedApp", "App Usage List: $appUsageList")
//            sendAppUsageListToRN(appUsageList)
//
//        } else {
//            // Permission not granted, log or handle accordingly
//            Toast.makeText(reactApplicationContext, "Please Allow Usage Permission", Toast.LENGTH_SHORT).show();
//            Log.d("CheckUsedApp", "Usage stats permission not granted")
//        }
//    }
//@ReactMethod
//    fun getAppUsageSTANDBY_BUCKET_ACTIVE(startDate: Double, endDate: Double) {
//        if (hasUsageStatsPermission()) {
//            val startTimestamp = startDate.toLong()
//            val endTimestamp = endDate.toLong()
//            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
//
//            val usageStatsList = usageStatsManager.queryUsageStats(
//                UsageStatsManager.STANDBY_BUCKET_ACTIVE,
//                startTimestamp,
//                endTimestamp
//            )
//
//            Log.d("usageStatsList", "usageStatsList: $usageStatsList")
//
//            val appUsageList = ArrayList<HashMap<String, String>>()
//            for (usageStats in usageStatsList) {
//                val appInfo = HashMap<String, String>()
//                appInfo["packageName"] = usageStats.packageName
//                appInfo["appName"] = getAppName(usageStats.packageName)
//
//                appInfo["firstTimeStamp"] = usageStats.firstTimeStamp.toString()
//                appInfo["lastTimeStamp"] = usageStats.lastTimeStamp.toString()
//                appInfo["totalTimeInForeground"] = usageStats.totalTimeInForeground.toString()
//                appInfo["lastTimeUsed"] = usageStats.lastTimeUsed.toString()
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["totalTimeForegroundServiceUsed"] = usageStats.totalTimeForegroundServiceUsed.toString()
//                }
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["totalTimeVisible"] = usageStats.totalTimeVisible.toString()
//                }
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["lastTimeForegroundServiceUsed"] = usageStats.lastTimeForegroundServiceUsed.toString()
//                }
//
//                appUsageList.add(appInfo)
//            }
//
//            // Log the appUsageList or emit an event
//            Log.d("CheckUsedApp", "App Usage List: $appUsageList")
//            sendAppUsageListToRN(appUsageList)
//
//        } else {
//            // Permission not granted, log or handle accordingly
//            Toast.makeText(reactApplicationContext, "Please Allow Usage Permission", Toast.LENGTH_SHORT).show();
//            Log.d("CheckUsedApp", "Usage stats permission not granted")
//        }
//    }
//@ReactMethod
//    fun getAppUsageSTANDBY_BUCKET_FREQUENT(startDate: Double, endDate: Double) {
//        if (hasUsageStatsPermission()) {
//            val startTimestamp = startDate.toLong()
//            val endTimestamp = endDate.toLong()
//            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
//
//            val usageStatsList = usageStatsManager.queryUsageStats(
//                UsageStatsManager.STANDBY_BUCKET_FREQUENT,
//                startTimestamp,
//                endTimestamp
//            )
//
//            Log.d("usageStatsList", "usageStatsList: $usageStatsList")
//
//            val appUsageList = ArrayList<HashMap<String, String>>()
//            for (usageStats in usageStatsList) {
//                val appInfo = HashMap<String, String>()
//                appInfo["packageName"] = usageStats.packageName
//                appInfo["appName"] = getAppName(usageStats.packageName)
//
//                appInfo["firstTimeStamp"] = usageStats.firstTimeStamp.toString()
//                appInfo["lastTimeStamp"] = usageStats.lastTimeStamp.toString()
//                appInfo["totalTimeInForeground"] = usageStats.totalTimeInForeground.toString()
//                appInfo["lastTimeUsed"] = usageStats.lastTimeUsed.toString()
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["totalTimeForegroundServiceUsed"] = usageStats.totalTimeForegroundServiceUsed.toString()
//                }
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["totalTimeVisible"] = usageStats.totalTimeVisible.toString()
//                }
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["lastTimeForegroundServiceUsed"] = usageStats.lastTimeForegroundServiceUsed.toString()
//                }
//
//                appUsageList.add(appInfo)
//            }
//
//            // Log the appUsageList or emit an event
//            Log.d("CheckUsedApp", "App Usage List: $appUsageList")
//            sendAppUsageListToRN(appUsageList)
//
//        } else {
//            // Permission not granted, log or handle accordingly
//            Toast.makeText(reactApplicationContext, "Please Allow Usage Permission", Toast.LENGTH_SHORT).show();
//            Log.d("CheckUsedApp", "Usage stats permission not granted")
//        }
//    }
//@ReactMethod
//    fun getAppUsageSTANDBY_BUCKET_RARE(startDate: Double, endDate: Double) {
//        if (hasUsageStatsPermission()) {
//            val startTimestamp = startDate.toLong()
//            val endTimestamp = endDate.toLong()
//            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
//
//            val usageStatsList = usageStatsManager.queryUsageStats(
//                UsageStatsManager.STANDBY_BUCKET_RARE,
//                startTimestamp,
//                endTimestamp
//            )
//
//            Log.d("usageStatsList", "usageStatsList: $usageStatsList")
//
//            val appUsageList = ArrayList<HashMap<String, String>>()
//            for (usageStats in usageStatsList) {
//                val appInfo = HashMap<String, String>()
//                appInfo["packageName"] = usageStats.packageName
//                appInfo["appName"] = getAppName(usageStats.packageName)
//
//                appInfo["firstTimeStamp"] = usageStats.firstTimeStamp.toString()
//                appInfo["lastTimeStamp"] = usageStats.lastTimeStamp.toString()
//                appInfo["totalTimeInForeground"] = usageStats.totalTimeInForeground.toString()
//                appInfo["lastTimeUsed"] = usageStats.lastTimeUsed.toString()
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["totalTimeForegroundServiceUsed"] = usageStats.totalTimeForegroundServiceUsed.toString()
//                }
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["totalTimeVisible"] = usageStats.totalTimeVisible.toString()
//                }
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["lastTimeForegroundServiceUsed"] = usageStats.lastTimeForegroundServiceUsed.toString()
//                }
//
//                appUsageList.add(appInfo)
//            }
//
//            // Log the appUsageList or emit an event
//            Log.d("CheckUsedApp", "App Usage List: $appUsageList")
//            sendAppUsageListToRN(appUsageList)
//
//        } else {
//            // Permission not granted, log or handle accordingly
//            Toast.makeText(reactApplicationContext, "Please Allow Usage Permission", Toast.LENGTH_SHORT).show();
//            Log.d("CheckUsedApp", "Usage stats permission not granted")
//        }
//    }
//@ReactMethod
//    fun getAppUsageSTANDBY_BUCKET_WORKING_SET(startDate: Double, endDate: Double) {
//        if (hasUsageStatsPermission()) {
//            val startTimestamp = startDate.toLong()
//            val endTimestamp = endDate.toLong()
//            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
//
//            val usageStatsList = usageStatsManager.queryUsageStats(
//                UsageStatsManager.STANDBY_BUCKET_WORKING_SET,
//                startTimestamp,
//                endTimestamp
//            )
//
//            Log.d("usageStatsList", "usageStatsList: $usageStatsList")
//
//            val appUsageList = ArrayList<HashMap<String, String>>()
//            for (usageStats in usageStatsList) {
//                val appInfo = HashMap<String, String>()
//                appInfo["packageName"] = usageStats.packageName
//                appInfo["appName"] = getAppName(usageStats.packageName)
//
//                appInfo["firstTimeStamp"] = usageStats.firstTimeStamp.toString()
//                appInfo["lastTimeStamp"] = usageStats.lastTimeStamp.toString()
//                appInfo["totalTimeInForeground"] = usageStats.totalTimeInForeground.toString()
//                appInfo["lastTimeUsed"] = usageStats.lastTimeUsed.toString()
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["totalTimeForegroundServiceUsed"] = usageStats.totalTimeForegroundServiceUsed.toString()
//                }
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["totalTimeVisible"] = usageStats.totalTimeVisible.toString()
//                }
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["lastTimeForegroundServiceUsed"] = usageStats.lastTimeForegroundServiceUsed.toString()
//                }
//
//                appUsageList.add(appInfo)
//            }
//
//            // Log the appUsageList or emit an event
//            Log.d("CheckUsedApp", "App Usage List: $appUsageList")
//            sendAppUsageListToRN(appUsageList)
//
//        } else {
//            // Permission not granted, log or handle accordingly
//            Toast.makeText(reactApplicationContext, "Please Allow Usage Permission", Toast.LENGTH_SHORT).show();
//            Log.d("CheckUsedApp", "Usage stats permission not granted")
//        }
//    }
//@ReactMethod
//    fun getAppUsageSTANDBY_BUCKET_RESTRICTED(startDate: Double, endDate: Double) {
//        if (hasUsageStatsPermission()) {
//            val startTimestamp = startDate.toLong()
//            val endTimestamp = endDate.toLong()
//            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
//
//            val usageStatsList = usageStatsManager.queryUsageStats(
//                UsageStatsManager.STANDBY_BUCKET_RESTRICTED,
//                startTimestamp,
//                endTimestamp
//            )
//
//            Log.d("usageStatsList", "usageStatsList: $usageStatsList")
//
//            val appUsageList = ArrayList<HashMap<String, String>>()
//            for (usageStats in usageStatsList) {
//                val appInfo = HashMap<String, String>()
//                appInfo["packageName"] = usageStats.packageName
//                appInfo["appName"] = getAppName(usageStats.packageName)
//                appInfo["firstTimeStamp"] = usageStats.firstTimeStamp.toString()
//                appInfo["lastTimeStamp"] = usageStats.lastTimeStamp.toString()
//                appInfo["totalTimeInForeground"] = usageStats.totalTimeInForeground.toString()
//                appInfo["lastTimeUsed"] = usageStats.lastTimeUsed.toString()
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["totalTimeForegroundServiceUsed"] = usageStats.totalTimeForegroundServiceUsed.toString()
//                }
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["totalTimeVisible"] = usageStats.totalTimeVisible.toString()
//                }
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    appInfo["lastTimeForegroundServiceUsed"] = usageStats.lastTimeForegroundServiceUsed.toString()
//                }
//
//                appUsageList.add(appInfo)
//            }
//
//            // Log the appUsageList or emit an event
//            Log.d("CheckUsedApp", "App Usage List: $appUsageList")
//            sendAppUsageListToRN(appUsageList)
//
//        } else {
//            // Permission not granted, log or handle accordingly
//            Toast.makeText(reactApplicationContext, "Please Allow Usage Permission", Toast.LENGTH_SHORT).show();
//            Log.d("CheckUsedApp", "Usage stats permission not granted")
//        }
//    }



@ReactMethod
     fun hasUsageStatsPermission(): Boolean {
        val appOps = reactApplicationContext.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = appOps.checkOpNoThrow(
            AppOpsManager.OPSTR_GET_USAGE_STATS,
            Process.myUid(),
            reactApplicationContext.packageName
        )
        return mode == AppOpsManager.MODE_ALLOWED
    }
    @ReactMethod
    fun hasUsageStatsPermissions(promise: Promise) {
        Log.d("Coming","coming")

        try {
            val appOps = reactContext.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
            val mode = appOps.checkOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                reactContext.packageName
            )
            val a = mode == AppOpsManager.MODE_ALLOWED
            Log.d("thisis"," $a")

            promise.resolve(mode == AppOpsManager.MODE_ALLOWED) // Resolve the promise with the permission status
        } catch (e: Exception) {
            promise.reject("ERROR", e) // Reject the promise in case of an error
        }
    }

    private fun getAppName(packageName: String): String {
        return try {
            val pm = reactApplicationContext.packageManager
            val ai = pm.getApplicationInfo(packageName, PackageManager.GET_META_DATA)
            pm.getApplicationLabel(ai).toString()
        } catch (e: PackageManager.NameNotFoundException) {
            // Handle the exception, e.g., return a default name or log the error
            Log.e("chectheerror", "Error getting app name for package $packageName", e)
            "Unknown App"
        }
    }

    fun getAppNameFromPkgName(context: Context, Packagename: String?): String? {
        return try {
            val packageManager = context.packageManager
            val info = packageManager.getApplicationInfo(
                Packagename!!,
                PackageManager.GET_META_DATA
            )
            packageManager.getApplicationLabel(info) as String
        } catch (e: PackageManager.NameNotFoundException) {
            e.printStackTrace()
            ""
        }
    }


    fun bitmapToBase64(bitmap: Bitmap): String {
        val outputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream)
        val byteArray = outputStream.toByteArray()
        return Base64.encodeToString(byteArray, Base64.DEFAULT)
    }
}
