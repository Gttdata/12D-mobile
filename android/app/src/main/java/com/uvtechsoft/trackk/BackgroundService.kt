// BackgroundService.java
package com.uvtechsoft.dimensions

import android.annotation.SuppressLint
import android.app.ActivityManager
import android.app.AppOpsManager
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.database.sqlite.SQLiteDatabase
import android.graphics.PixelFormat
import android.net.Uri
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.provider.Settings
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.widget.Button
import android.widget.ImageButton
import android.widget.TextView
import androidx.annotation.RequiresApi
import androidx.core.app.NotificationCompat
import com.uvtechsoft.dimensions.RunInBackground
import com.uvtechsoft.dimensions.RunInBackgroundModule
import com.uvtechsoft.dimensions.ReminderAcitivity
import com.uvtechsoft.dimensions.batteryRestrictionsModule
import com.uvtechsoft.dimensions.BackgroundServiceReminder
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.time.Instant
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import java.util.Date
import java.util.Locale
import java.util.concurrent.TimeUnit
import java.util.Calendar
import android.app.usage.UsageStats

//state holder
data class DetoxState(
    var todaysTotal: Long = 0L,
    var sessionUsage: Long = 0L,
    var coolDownTime: Long = 0L,
    var isIncoolDown: Boolean = false,
    var coolDownStart: Long = 0L,
    var todaysDate: String = ""
)

class BackgroundService : Service() {
    var totalDuration = 0L
    var selectedPackages1: List<String> = emptyList()
    var detoxMinutes1: Int = 0
    var detoxDuration1: Double = 0.0
    // Shared state object for the service
    private val detoxState = DetoxState()

    val handler = Handler(Looper.getMainLooper())
    val checkInterval = 3000L

        val checkRunnable =  object : Runnable {
            override fun run() {
                Log.d("DD008","Service Called ${System.currentTimeMillis()}")
                // cleanupExpiredCooldowns()
                // getTotalForegroundUsageToday(applicationContext, selectedPackages1)
            // requestUsageStatsPermission(applicationContext, selectedPackages1, detoxMinutes1, detoxDuration1)
            newLogic(applicationContext, totalDuration, selectedPackages1, detoxMinutes1, detoxDuration1,  state = detoxState)
                handler.postDelayed(this, checkInterval)
            }
        }

fun newLogic(
    context: Context,
    totalDurations: Long,
    selectedPackageNames: List<String>,
    detoxTimeMinutes: Int,
    DETOX_DURATION: Double,
    state: DetoxState
) {
    val windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
    // Log.d("DD000a","All variable $totalDurations $state $selectedPackageNames $detoxTimeMinutes $DETOX_DURATION")
    if(state.todaysDate != getTimeStringFromMillis(System.currentTimeMillis()).substring(0,10)){
        state.todaysDate = getTimeStringFromMillis(System.currentTimeMillis()).substring(0,10)
        state.todaysTotal = 0L
        state.sessionUsage = 0L
        state.coolDownTime = 0L
        Log.d("DD0001","New Day Detected. Resetting totals.")
    }
    if(state.isIncoolDown){
        // state.coolDownTime += 3000L
        if(state.coolDownStart + DETOX_DURATION * 60000L < System.currentTimeMillis()){
            state.todaysTotal = state.sessionUsage + state.todaysTotal
            state.sessionUsage = 0L
            state.coolDownTime = 0L
            state.isIncoolDown = false
            // close overlay
            overlayView?.let { view ->
            try {
                windowManager.removeView(view)
            } catch (e: Exception) {
                e.printStackTrace()
            }
            overlayView = null
            }
        }else{
        // trire overlay function here
        // blockApp(context, selectedPackageNames, detoxTimeMinutes)
        checkAndBlockSelectedApps(context, selectedPackageNames)
        Log.d("DD000c","In Cool Down Time: ${state.coolDownTime}")
        }
    } else {
        val total = getTotalForegroundUsageToday(applicationContext, selectedPackageNames)
        Log.d("DD000d","Total Foreground Usage Today: $total")
        if(state.todaysTotal <= 0L) {
            state.todaysTotal = total
        } else {
            Log.d("DD000e","Total Foreground Usage Today Previous: ${total - state.todaysTotal}")
            state.sessionUsage = total - state.todaysTotal
            if(state.sessionUsage > detoxTimeMinutes * 60000L){
                state.isIncoolDown = true
                state.coolDownStart = System.currentTimeMillis()
                // trigger block overlay function here
                Log.d("DD000b","App should be blocked now. Session Usage: ${state.sessionUsage}")
                // blockApp(context, selectedPackageNames,detoxTimeMinutes)
                checkAndBlockSelectedApps(context, selectedPackageNames)
            }
        }
    }
}

fun blockApp(
    context: Context,
    selectedPackages: List<String>,
    detoxTimeMinutes: Int
){
    val currentTime = System.currentTimeMillis()
    val startTime = currentTime - TimeUnit.MINUTES.toMillis(detoxTimeMinutes.toLong())
    val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
    val usageEvents = usageStatsManager.queryEvents(startTime, currentTime)
    val event = UsageEvents.Event()

    while (usageEvents.hasNextEvent()) {
        usageEvents.getNextEvent(event)
        // Only show overlay when app moves to foreground
        if (event.eventType == UsageEvents.Event.MOVE_TO_FOREGROUND &&
            selectedPackages.contains(event.packageName)) {
            showOverlay()
            break // avoid multiple overlays
        }
    }
}

fun checkAndBlockSelectedApps(context: Context, selectedPackages: List<String>) {
    val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
    val endTime = System.currentTimeMillis()
    val startTime = endTime - 1000 * 60 * 5 // last 5 minutes (or any window)
    val usageEvents = usageStatsManager.queryEvents(startTime, endTime)
    val event = UsageEvents.Event()
    
    var currentForegroundPackage: String? = null
    
    while (usageEvents.hasNextEvent()) {
        usageEvents.getNextEvent(event)
        // Only interested in foreground events
        if (event.eventType == UsageEvents.Event.MOVE_TO_FOREGROUND) {
            currentForegroundPackage = event.packageName
        }
    }
    
    // Show overlay ONLY if current foreground app is in selectedPackages
    if (currentForegroundPackage != null && selectedPackages.contains(currentForegroundPackage)) {
        showOverlay()
    }
}


private var overlayView: View? = null

private fun showOverlay() {
    val windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager

    // Avoid adding multiple overlays
    if (overlayView != null) return

    val layoutParams = WindowManager.LayoutParams(
        WindowManager.LayoutParams.MATCH_PARENT,
        WindowManager.LayoutParams.MATCH_PARENT,
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            WindowManager.LayoutParams.TYPE_PHONE
        },
        WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
        PixelFormat.TRANSLUCENT
    )

    overlayView = LayoutInflater.from(this).inflate(R.layout.overlay_view, null)
    windowManager.addView(overlayView, layoutParams)

    val messageText = overlayView!!.findViewById<TextView>(R.id.textView)
    val actionButton = overlayView!!.findViewById<Button>(R.id.actionButton)

    messageText.text = "Oh, we are sorry...!\n" +
            "you can not access it..!\n" +
            "You are currently going through digital detoxification..!\n" +
            "Till now you are doing great..! We are happy to see you love yourself..!\n" +
            "So keep patience! Very soon you will be a new you..!\n" +
            "Good Luck..!"

    actionButton.setOnClickListener {
        // Remove overlay
        overlayView?.let { view ->
            try {
                windowManager.removeView(view)
            } catch (e: Exception) {
                e.printStackTrace()
            }
            overlayView = null
        }

        // Redirect to Home (like pressing Home button)
        val homeIntent = Intent(Intent.ACTION_MAIN).apply {
            addCategory(Intent.CATEGORY_HOME)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        startActivity(homeIntent)
    }
}




fun getTotalForegroundUsageToday(
    context: Context,
    selectedPackages: List<String>
): Long {
    val usageStatsManager =
        context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

    val calendar = Calendar.getInstance().apply {
        set(Calendar.HOUR_OF_DAY, 0)
        set(Calendar.MINUTE, 0)
        set(Calendar.SECOND, 0)
        set(Calendar.MILLISECOND, 0)
    }
    val startTime = calendar.timeInMillis
    val endTime = System.currentTimeMillis()

    val events = usageStatsManager.queryEvents(startTime, endTime)
    val event = UsageEvents.Event()
    val selectedSet = selectedPackages.toHashSet()

    val lastForeground = mutableMapOf<String, Long>()
    var total = 0L

    while (events.hasNextEvent()) {
        events.getNextEvent(event)
        val pkg = event.packageName ?: continue
        if (!selectedSet.contains(pkg)) continue

        when (event.eventType) {
            UsageEvents.Event.MOVE_TO_FOREGROUND -> {
                lastForeground[pkg] = event.timeStamp
            }
            UsageEvents.Event.MOVE_TO_BACKGROUND -> {
                val start = lastForeground.remove(pkg)
                if (start != null) total += (event.timeStamp - start)
            }
        }
    }

    // If app still in foreground, count until now
    lastForeground.forEach { (_, start) ->
        total += (endTime - start)
    }

    return total
}

 
// Optional helper to format milliseconds to HH:MM
fun formatMillisToHoursMinutes(timeMillis: Long): String {
    val totalMinutes = timeMillis / 1000 / 60
    val hours = totalMinutes / 60
    val minutes = totalMinutes % 60
    val totalSeconds = timeMillis / 1000 % 60
    return String.format("%02d:%02d:%02d", hours, minutes, totalSeconds)
}

    override fun onCreate() {
        
        super.onCreate()
         // Log.d("BackgroundService", "Service started")

         Log.d("DD001", "Service created")
         val notification = createNotification()
        startForeground(NOTIFICATION_ID, notification)

        
        // Run first check immediately
        handler.post(checkRunnable)

    }
    @RequiresApi(Build.VERSION_CODES.O)
    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacks(checkRunnable)
        Log.d("DD002", "Service destroyed")
        
    }

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onStartCommand(intent: Intent, flags: Int, startId: Int): Int {
        // Log.d("BackgroundService", "Service started")
         Log.d("DD003", "On StartCommand called")
        if (intent.getBooleanExtra("STOP_SERVICE", false)) {
            stopSelf()
            Log.d("DD004", "On StartCommand called - Service Stopped")
            return START_NOT_STICKY
        }

         intent.getStringExtra("selectedPackageNamesJSON")?.let { selectedJSON ->
                    intent.getStringExtra("DetoxConfig")?.let { configJSON ->
                         selectedPackages1 = JSONArray(selectedJSON).let { jsonArr ->
                            List(jsonArr.length()) { i -> jsonArr.getString(i) }
                        }
                        val config = JSONObject(configJSON)
                        detoxMinutes1 = config.getDouble("DETOX_TIME").toInt()
                        detoxDuration1 = config.getDouble("DETOX_DURATION")
                        
                        
                    }
                }

        // Save start time if new service instance
        val sharedPref = getSharedPreferences("UsagePrefs", Context.MODE_PRIVATE)
        Log.d("DD005", "Shared Preferences service start time: ${sharedPref.getLong("serviceStartTime", 0L)}")
        if (sharedPref.getLong("serviceStartTime", 0L) == 0L) {

            sharedPref.edit().putLong("serviceStartTime", System.currentTimeMillis()).apply()
            Log.d("DD006", "Current Millisecond applied")
        }
        
        // Setup foreground notification
        // val notification = createNotification()
        // startForeground(NOTIFICATION_ID, notification)

        // val handler = Handler(Looper.getMainLooper())
        // val checkInterval = 30000L

        // val checkRunnable = object : Runnable {
        //     override fun run() {
        //         cleanupExpiredCooldowns()
        //         intent.getStringExtra("selectedPackageNamesJSON")?.let { selectedJSON ->
        //             intent.getStringExtra("DetoxConfig")?.let { configJSON ->
        //                 val selectedPackages = JSONArray(selectedJSON).let { jsonArr ->
        //                     List(jsonArr.length()) { i -> jsonArr.getString(i) }
        //                 }
        //                 val config = JSONObject(configJSON)
        //                 val detoxMinutes = config.getDouble("DETOX_TIME").toInt()
        //                 val detoxDuration = config.getDouble("DETOX_DURATION")
        //                 requestUsageStatsPermission(applicationContext, selectedPackages, detoxMinutes, detoxDuration)
        //             }
        //         }
        //         handler.postDelayed(this, checkInterval)
        //     }
        // }

        // // Run first check immediately
        // handler.post(checkRunnable)

        return START_STICKY
    }

    fun stopService() {
        // Clear all blocking state
        val sharedPref = getSharedPreferences("UsagePrefs", Context.MODE_PRIVATE)
        val overlayPref = getSharedPreferences("OverlayPrefs", Context.MODE_PRIVATE)

        with(sharedPref.edit()) {
            putLong("totalUsage", 0L)
            putLong("cooldownStart", 0L)
            putLong("lastUpdate", 0L)
            apply()
        }

        with(sharedPref.edit()) {
            clear() // Clear all preferences
            apply()
        }

        with(overlayPref.edit()) {
            clear()
            apply()
        }

        stopSelf()
    }

    private fun removeAllOverlays() {
        val windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        activeOverlays.values.forEach { view ->
            try {
                windowManager.removeView(view)
            } catch (e: Exception) {
                Log.e("BackgroundService", "Error removing overlay", e)
            }
        }
        activeOverlays.clear()
    }

    @RequiresApi(Build.VERSION_CODES.O)
    fun requestUsageStatsPermission(
        context: Context,
        selectedPackageNames: List<String>,
        detoxTimeMinutes: Int,
        DETOX_DURATION: Double
    ) {
        if (!isUsageStatsPermissionGranted(context)) {
            val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(intent)
        } else {
            
            getAppUsageDuration(context, selectedPackageNames, detoxTimeMinutes, DETOX_DURATION)
        }
    }


    private fun getAppName(packageName: String): String {
        return try {
            val pm = applicationContext.packageManager
            val ai = pm.getApplicationInfo(packageName, PackageManager.GET_META_DATA)
            pm.getApplicationLabel(ai).toString()
        } catch (e: PackageManager.NameNotFoundException) {
            // Handle the exception, e.g., return a default name or log the error
            Log.e("chectheerror", "Error getting app name for package $packageName", e)
            "Unknown App"
        }
    }

    fun getTimeStringFromMillis(timeMillis: Long): String {
        val sdf = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
        return sdf.format(Date(timeMillis))
    }

    fun getMillisFromMinutes(minutes: Double): Long {
        return (minutes * 60000).toLong()
    }

    @SuppressLint("SuspiciousIndentation")
    @RequiresApi(Build.VERSION_CODES.O)
    private var lastUpdateTime = System.currentTimeMillis()

    // Added on 2025-04-09
    @SuppressLint("SuspiciousIndentation")
    @RequiresApi(Build.VERSION_CODES.O)
    private fun getAppUsageDuration(
    context: Context,
    selectedPackageNames: List<String>,
    detoxTimeMinutes: Int,
    DETOX_DURATION: Double
     ) {

        val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val currentTime = System.currentTimeMillis()

        val startTime = currentTime - TimeUnit.MINUTES.toMillis(detoxTimeMinutes.toLong())

        val sharedPref = context.getSharedPreferences("UsagePrefs", Context.MODE_PRIVATE)
        val overlayPref = context.getSharedPreferences("OverlayPrefs", Context.MODE_PRIVATE) // Add this line

        var totalDetoxDuration = sharedPref.getLong("totalUsage", 0L)
        val lastUpdateTime = sharedPref.getLong("lastUpdate", currentTime)
        val cooldownStartTime = sharedPref.getLong("cooldownStart", 0L)

   

        // Reset if new detox period starts
        // if (!isInCooldown(cooldownStartTime, DETOX_DURATION, currentTime) &&
        //     currentTime - lastUpdateTime > TimeUnit.MINUTES.toMillis(detoxTimeMinutes.toLong())) {
        //     totalDetoxDuration = 0L
        //     with(sharedPref.edit()) {
        //         putLong("totalUsage", 0L)
        //         putLong("lastUpdate", currentTime)
        //         apply()
        //     }
        // }

        // Track usage events in real-time
        val usageEvents = usageStatsManager.queryEvents(startTime, currentTime)
        val event = UsageEvents.Event()
        val appStartTimes = mutableMapOf<String, Long>()
        val activeApps = mutableSetOf<String>()

        while (usageEvents.hasNextEvent()) {
            usageEvents.getNextEvent(event)
            if (selectedPackageNames.contains(event.packageName)) {
            val overlayPref = context.getSharedPreferences("OverlayPrefs", Context.MODE_PRIVATE)
            val cooldownEndTime = overlayPref.getLong("${event.packageName}_cooldownEnd", 0L)

            Log.d("DD0003", "App ${event.packageName} cooldown ends at $cooldownEndTime")
            
            // Skip if still in cooldown period
            if (System.currentTimeMillis() < cooldownEndTime) {
                continue
            }
                when (event.eventType) {
                      UsageEvents.Event.ACTIVITY_RESUMED -> {
                    // Only proceed if not in cooldown
                    appStartTimes[event.packageName] = event.timeStamp
                    activeApps.add(event.packageName)
                }
                    UsageEvents.Event.ACTIVITY_PAUSED -> {
                        appStartTimes.remove(event.packageName)?.let { startTime ->
                            val duration = event.timeStamp - startTime
                            totalDetoxDuration += duration
                            Log.d("DD0004", "App ${event.packageName} closed after $duration ms (Total: $totalDetoxDuration)")
                        }
                        activeApps.remove(event.packageName)
                    }
                    UsageEvents.Event.MOVE_TO_FOREGROUND -> {
                        // Handle app coming to foreground from recent apps
                        if (overlayPref.getBoolean(event.packageName, false)) {
                            // App is blocked but user tried to open from recent
                            forceCloseApp(event.packageName)
                            // showOverlayWindow(event.packageName, getAppName(event.packageName),
                            //     detoxTimeMinutes, DETOX_DURATION)
                        }
                    }
                }
            }
        }

        // Add time for currently active apps
        for (packageName in activeApps) {
            appStartTimes[packageName]?.let { startTime ->
                val duration = currentTime - startTime
                totalDetoxDuration += duration
                Log.d("DD0002", "App $packageName active for $duration ms (Total: $totalDetoxDuration)")
                Log.d("DD0001","$startTime $currentTime")
            }
        }

        // Save current state
        with(sharedPref.edit()) {
            putLong("totalUsage", totalDetoxDuration)
            putLong("lastUpdate", currentTime)
            apply()
        }

        val detoxLimitMillis = TimeUnit.MINUTES.toMillis(detoxTimeMinutes.toLong())
        handleAppBlocking(
            context, selectedPackageNames, activeApps,
            totalDetoxDuration, detoxLimitMillis,
            currentTime, DETOX_DURATION, detoxTimeMinutes
        )
    }

    private fun isInCooldown(cooldownStartTime: Long, DETOX_DURATION: Double, currentTime: Long): Boolean {
        return cooldownStartTime > 0 &&
                (currentTime - cooldownStartTime < TimeUnit.MINUTES.toMillis(DETOX_DURATION.toLong()))
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun handleAppBlocking(
        context: Context,
        selectedPackageNames: List<String>,
        activeApps: Set<String>,
        totalDetoxDuration: Long,
        detoxLimitMillis: Long,
        currentTime: Long,
        DETOX_DURATION: Double,
        detoxTimeMinutes: Int
    ) {
        val sharedPref = context.getSharedPreferences("UsagePrefs", Context.MODE_PRIVATE)
        val overlayPref = context.getSharedPreferences("OverlayPrefs", Context.MODE_PRIVATE)
        val cooldownDurationMillis = TimeUnit.MINUTES.toMillis(DETOX_DURATION.toLong())
        val cooldownStartTime = sharedPref.getLong("cooldownStart", 0L)
        val isInCooldown = cooldownStartTime > 0 &&
                (currentTime - cooldownStartTime < cooldownDurationMillis)
        // 1. Check if we need to start blocking
        if (totalDetoxDuration >= detoxLimitMillis && !isInCooldown) {
            // Log.d("Blocking", "Starting cooldown period - Usage limit reached")
            with(sharedPref.edit()) {
                putLong("cooldownStart", currentTime)
                putLong("totalUsage", 0L) // Reset usage counter
                apply()
            }

            // Show overlay for all selected apps
            selectedPackageNames.forEach { packageName ->
                if (!overlayPref.getBoolean(packageName, false) && !overlayDisplayed.getOrDefault(packageName, false)) {
                    val appName = getAppName(packageName)
                    // showOverlayWindow(packageName, appName, detoxTimeMinutes, DETOX_DURATION)
                    overlayPref.edit().putBoolean(packageName, true).apply()
                    overlayDisplayed[packageName] = true // Mark overlay as displayed
                    // Force close the app if it's currently active
                    if (activeApps.contains(packageName)) {
                        forceCloseApp(packageName)
                    }
                }
            }
        }
        // 2. Check if cooldown period is active
        else if (isInCooldown) {
            val timeRemaining = cooldownDurationMillis - (currentTime - cooldownStartTime)
            // Log.d("Cooldown FI", "Time remaining: $timeRemaining ms")

            // Ensure all selected apps remain blocked during cooldown
            selectedPackageNames.forEach { packageName ->
                // If app is active during cooldown, force close it
                if (activeApps.contains(packageName)) {
                    forceCloseApp(packageName)
                }
            }

            // Check if cooldown period has ended
            if (timeRemaining <= 0) {
                // Log.d("Cooldown", "Cooldown period ended")
                with(sharedPref.edit()) {
                    putLong("cooldownStart", 0L)
                    putLong("lastUpdate", currentTime)
                    apply()
                }

                // Remove all overlays
                selectedPackageNames.forEach { packageName ->
                    if (overlayPref.getBoolean(packageName, false)) {
                        removeOverlay(packageName)
                        overlayPref.edit().remove(packageName).apply()
                    }
                }
            }
        }
    }

    private fun forceCloseApp(packageName: String) {
        try {
            // val activityManager = getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
            // activityManager.killBackgroundProcesses(packageName)
            // Log.d("ForceClose", "Attempted to close $packageName")
        } catch (e: Exception) {
            Log.e("ForceClose", "Error closing app $packageName", e)
        }
    }

    private fun cleanupExpiredCooldowns() {
    val overlayPref = getSharedPreferences("OverlayPrefs", Context.MODE_PRIVATE)
    val editor = overlayPref.edit()
    val currentTime = System.currentTimeMillis()
    
    val allEntries = overlayPref.all
    for ((key, value) in allEntries) {
        if (key.endsWith("_cooldownEnd") && value is Long) {
            if (currentTime > value) {
                editor.remove(key)
                // Also remove the overlay shown flag
                val packageName = key.replace("_cooldownEnd", "")
                editor.remove("${packageName}_overlayShown")
            }
        }
    }
    editor.apply()
}


    @SuppressLint("SuspiciousIndentation")
    @RequiresApi(Build.VERSION_CODES.O)
    private fun getAppEachDuration(context: Context, selectedPackageNames: List<String>,
                                   detoxTimeHours: Int, DETOX_DURATION: Double) {
        val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

        val currentTime = System.currentTimeMillis()

        // Get the current time in milliseconds
        val currentTimeMillis = System.currentTimeMillis()

        // Convert to Instant
        val instant = Instant.ofEpochMilli(currentTimeMillis)

        // Convert Instant to ZonedDateTime in the Asia/Kolkata timezone
        val kolkataTime = ZonedDateTime.ofInstant(instant, ZoneId.of("Asia/Kolkata"))

        // Subtract the specified number of minutes
        val previousTime = kolkataTime.minusMinutes(detoxTimeHours.toLong())

        // Get the milliseconds since epoch for the previous time in the Asia/Kolkata timezone
        val previousTimeMillis = previousTime.toInstant().toEpochMilli()
        val kolkataTimeMillis = kolkataTime.toInstant().toEpochMilli()

        // Print the current and previous time in milliseconds for the Asia/Kolkata timezone
        println("Current Kolkata Time: $currentTimeMillis")
        println("Time $detoxTimeHours minutes earlier (milliseconds): $previousTimeMillis")
        val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")

        val kolkataTimeFormatted = kolkataTime.format(formatter)
        val previousTimeFormatted = previousTime.format(formatter)

        // Print the human-readable times
        println("Current Kolkata Time: $kolkataTimeFormatted")
        println("Previous Time: $previousTimeFormatted")
        val adjustedDetoxTimeHours = if (detoxTimeHours < 60) detoxTimeHours else detoxTimeHours
        val startTime = currentTime - adjustedDetoxTimeHours * 60 * 1000
        // Log.d("startTime","$startTime $currentTime")
        // Log.d("kolkataTimeMillis","$previousTimeMillis $kolkataTimeMillis")
        val usageEvents = usageStatsManager.queryEvents(previousTimeMillis, kolkataTimeMillis)
        val event = UsageEvents.Event()
        val appDurations = mutableMapOf<String, Long>()
        val appStartTimes = mutableMapOf<String, Long>()
        val activeApps = mutableSetOf<String>()

        while (usageEvents.hasNextEvent()) {
            usageEvents.getNextEvent(event)
            val packageName = event.packageName
            if (selectedPackageNames.contains(packageName)) {
                when (event.eventType) {
                    UsageEvents.Event.ACTIVITY_RESUMED -> {
                        appStartTimes[packageName] = event.timeStamp
                        // Log.d("AppStart","$packageName Time : ${event.timeStamp}")
                        activeApps.add(packageName)
                    }
                    UsageEvents.Event.ACTIVITY_PAUSED

                        -> {
                        val startTime = appStartTimes[packageName]
                        if (startTime != null) {
                            val duration = event.timeStamp - startTime
                            // Log.d("duration","$packageName Duration : $duration")
                            appDurations[packageName] = appDurations.getOrDefault(packageName, 0L) + duration
                            appStartTimes.remove(packageName)
                            activeApps.remove(packageName)

                        }
                    }
                }
            }
        }

        val sharedPreferences = context.getSharedPreferences("AppUsagePrefs", Context.MODE_PRIVATE)
        val editor = sharedPreferences.edit()

        val currentPackageName = context.packageName
        val pm = context.packageManager

        // Log.d("appDurations","$appDurations");
        // Log.d("activeApps","$activeApps");
        // Log.d("appStartTimes","$appStartTimes");

        for ((packageName, duration) in appDurations) {
            if (packageName in selectedPackageNames && packageName != currentPackageName && pm.getLaunchIntentForPackage(packageName) != null) {
                val formattedTime = getHoursAndMinutesStringFromMillis(duration)
                val DETOX_DURATIONInMillis = getMillisFromMinutes(DETOX_DURATION)

                if(activeApps.contains(packageName)){
                    totalDuration= duration;

                    // Log.d("CHECK","CHECK THE DETOX $packageName duration $duration DETOX_DURATION $DETOX_DURATION DETOX_DURATIONInMillis $DETOX_DURATIONInMillis ");

                    val FistTimeOpend = sharedPreferences.getLong(packageName, 0)
                    if (FistTimeOpend == 0L) {
                        // Log.d("FistTimeOpend","$FistTimeOpend")
                        editor.putLong(packageName, currentTime)

                        editor.apply()
                    }else{
                        val durationInMillis = currentTime - FistTimeOpend
                        val totalDur = durationInMillis + duration;

                        // Log.d("WhereCheck","CHECK THE DETOX $packageName duration $totalDur DETOX_DURATION $DETOX_DURATION DETOX_DURATIONInMillis $DETOX_DURATIONInMillis  ");

                        val UsedApp = getHoursAndMinutesStringFromMillis(totalDur)
                        val formattedTimeAll = getHoursAndMinutesStringFromMillis(totalDuration)
                        val AllformattedTime = getHoursAndMinutesStringFromMillis(totalDur)

                        // Log.d("going","beforeCondtions");


                        val sharedPref: SharedPreferences = getSharedPreferences("OverlayPrefs", Context.MODE_PRIVATE)
                        val editor: SharedPreferences.Editor = sharedPref.edit()
                        if (totalDur > DETOX_DURATIONInMillis && activeApps.contains(packageName)) {
                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                                // Log.d("gooing here","ap");

                                // Log.d("sharedPref","$sharedPref pkg $packageName")


                                if (!sharedPref.contains(packageName)) {

                                    val appname = getAppName(packageName)
                                    // Log.d("appname","ap $appname");

                                    // showOverlayWindow(packageName, appname, detoxTimeHours, DETOX_DURATION)

                                    editor.putBoolean(packageName, true)
                                    editor.apply()
                                }
                            }
                        }

                    }

                }else{

                    // Log.d("NOTaCTIVE","$packageName")

                    if (sharedPreferences.contains(packageName)) {
                        editor.remove(packageName)
                        editor.apply()
                    }
                }
                val sharedPref: SharedPreferences = getSharedPreferences("OverlayPrefs", Context.MODE_PRIVATE)
                val editor: SharedPreferences.Editor = sharedPref.edit()

                val cooldownEndTime = sharedPref.getLong("${packageName}_cooldownEnd", 0L)
                if (System.currentTimeMillis() < cooldownEndTime) {
                    // Still in cooldown, force overlay even if app was closed and reopened
                    if (!activeOverlays.containsKey(packageName)) {
                        val appname = getAppName(packageName)
                        // showOverlayWindow(packageName, appname, detoxTimeHours, DETOX_DURATION)
                    }
                    return // Skip further checks for this package
                }


                if (duration > DETOX_DURATIONInMillis && activeApps.contains(packageName)) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        // Log.d("CHECK2","CHECK THE DETOX $packageName");
                        // Log.d("CHECK3","sharedPref $sharedPref");


                        if (!sharedPref.contains(packageName)) {
                            val appname = getAppName(packageName)

                            // Log.d("appname","ap $appname");
                            // showOverlayWindow(packageName, appname, detoxTimeHours, DETOX_DURATION)

                            editor.putBoolean(packageName, true)
                            editor.apply()
                        }
                    }
                }
            } else {
                val formattedTime = getHoursAndMinutesStringFromMillis(duration)
            }
        }


    }

    private fun getHoursAndMinutesStringFromMillis(timeMillis: Long): String {
        val totalSeconds = timeMillis / 1000
        val minutes = (totalSeconds / 60).toInt()
        val hours = minutes / 60
        val remainingMinutes = minutes % 60
        return String.format("%02d:%02d", hours, remainingMinutes)
    }

    fun isUsageStatsPermissionGranted(context: Context): Boolean {
        val appOpsManager = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = appOpsManager.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, android.os.Process.myUid(), context.packageName)
        return mode == AppOpsManager.MODE_ALLOWED
    }


    fun convertTimestampToDate(timestamp: Long): String {
        val date = Date(timestamp)
        val format = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
        return format.format(date)
    }

    @RequiresApi(Build.VERSION_CODES.LOLLIPOP)
    fun getLastTimeUsed(packageName: String, usageStatsManager: UsageStatsManager): Long? {
        val currentTime = System.currentTimeMillis()

        val stats = usageStatsManager.queryUsageStats(
            UsageStatsManager.INTERVAL_DAILY,
            currentTime - TimeUnit.HOURS.toMillis(24),
            currentTime)

        var lastTimeUsed: Long? = null

        stats?.let { usageStats ->
            for (stat in usageStats) {
                if (stat.packageName == packageName) {
                    lastTimeUsed = stat.lastTimeUsed
                    break
                }
            }
        }

        return lastTimeUsed
    }

    // Function to calculate the duration between two times
    fun calculateDuration(startTime: Long, endTime: Long?): Long {
        val startDate = startTime ?: System.currentTimeMillis()
        val endDate = endTime ?: System.currentTimeMillis()

        return (endDate - startDate) / 1000
    }


    // Function to update the END_TIME and usage_duration in the database
    fun updateEndTimeAndDuration(db: SQLiteDatabase, id: Int, endTime: Long, usageDuration: Long) {

        val values = ContentValues().apply {
            put("END_TIME", endTime)
            put("usage_duration", usageDuration)
            put("is_app_closed", 1)
        }
        db.update("usage_stats", values, "id = ?", arrayOf(id.toString()))
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    private fun createNotification(title: String = "", text: String = ""): Notification {
        val channelId = "background_service_channel"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Background Service",
                NotificationManager.IMPORTANCE_MIN
            ).apply {
                setShowBadge(false)
                lockscreenVisibility = Notification.VISIBILITY_SECRET
                enableLights(false)
                enableVibration(false)
                setSound(null, null)
            }

            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }

        return NotificationCompat.Builder(this, channelId)
            .setContentTitle("")
            .setContentText("")
            // .setSmallIcon(R.drawable.transparent_icon)
            .setPriority(NotificationCompat.PRIORITY_MIN)
            .setCategory(Notification.CATEGORY_SERVICE)
            .setOngoing(true)
            .setSilent(true)
            .build()
    }


    private fun bringLauncherToFront(windowManager: WindowManager, overlayView: View, packageName: String) {
    val intent = Intent(Intent.ACTION_MAIN)
    intent.addCategory(Intent.CATEGORY_HOME)
    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
    startActivity(intent)
    
    // Remove the overlay view
    try {
        windowManager.removeView(overlayView)
        activeOverlays.remove(packageName)
    } catch (e: Exception) {
        Log.e("BackgroundService", "Error removing overlay", e)
    }
}

    @RequiresApi(Build.VERSION_CODES.O)
// private fun showOverlayWindow(packageName: String, appName: String, detoxTimeHours: Int, DetoxDuration: Double) {
//     // Check if overlay is already active or if app is already in cooldown
//     val overlayPref = getSharedPreferences("OverlayPrefs", Context.MODE_PRIVATE)
//     val cooldownEndTime = overlayPref.getLong("${packageName}_cooldownEnd", 0L)
    
//     // Don't show if already displayed or still in cooldown
//     if (activeOverlays.containsKey(packageName) || 
//         System.currentTimeMillis() < cooldownEndTime) {
//         return
//     }

//     // Set new cooldown period
//     val newCooldownEndTime = System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(DetoxDuration.toLong())
//     overlayPref.edit().putLong("${packageName}_cooldownEnd", newCooldownEndTime).apply()

//     val windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
//     val layoutParams = WindowManager.LayoutParams(
//         WindowManager.LayoutParams.MATCH_PARENT,
//         WindowManager.LayoutParams.MATCH_PARENT,
//         if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//             WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
//         } else {
//             WindowManager.LayoutParams.TYPE_PHONE
//         },
//         WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
//                 WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
//                 WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
//         PixelFormat.TRANSLUCENT
//     )

//     val overlayView = LayoutInflater.from(this).inflate(R.layout.overlay_view, null)
//     windowManager.addView(overlayView, layoutParams)
//     activeOverlays[packageName] = overlayView

//     // Set up UI elements
//     val closeButton = overlayView.findViewById<ImageButton>(R.id.close)
//     val closebtn = overlayView.findViewById<Button>(R.id.closebtn)
//     val Text = overlayView.findViewById<TextView>(R.id.textView)
//     val AppName = overlayView.findViewById<TextView>(R.id.AppName)

//     AppName.text = appName
//     Text.text = "Oh, we are sorry...!\n" +
//             "you can not access it..!\n" +
//             "You are currently going through digital detoxification..!\n" +
//             "Till now you are doing great..! We are happy to see you love yourself..!\n" +
//             "So keep patience! Very soon you will be a new you..!\n" +
//             "Good Luck..!"

//     closeButton.setOnClickListener {
//         removeOverlay(packageName)
//         bringLauncherToFront(windowManager, overlayView, packageName)
//     }

//     closebtn.setOnClickListener {
//         removeOverlay(packageName)
//         bringLauncherToFront(windowManager, overlayView, packageName)
//     }

//     // Auto-remove after cooldown
//     val handler = Handler(Looper.getMainLooper())
//     handler.postDelayed({
//         removeOverlay(packageName)
//     }, TimeUnit.MINUTES.toMillis(DetoxDuration.toLong()))
// }

    private fun resetBlockingState() {
        val sharedPref = getSharedPreferences("UsagePrefs", Context.MODE_PRIVATE)
        with(sharedPref.edit()) {
            putLong("totalUsage", 0L)
            putLong("cooldownStart", 0L)
            putLong("lastUpdate", System.currentTimeMillis())
            apply()
        }
    }

   private fun removeOverlay(packageName: String) {
    val windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
    activeOverlays[packageName]?.let { view ->
        try {
            windowManager.removeView(view)
            activeOverlays.remove(packageName)
            
            // Mark that overlay was shown and should not reappear during cooldown
            val overlayPref = getSharedPreferences("OverlayPrefs", Context.MODE_PRIVATE)
            overlayPref.edit().putBoolean("${packageName}_overlayShown", true).apply()
        } catch (e: Exception) {
            Log.e("BackgroundService", "Error removing overlay", e)
        }
    }
}


    companion object {
        private const val CHANNEL_ID = "ForegroundServiceChannel"
        private const val NOTIFICATION_ID = 12345
        private const val OVERLAY_PERMISSION_REQUEST_CODE = 123

        // Track active overlay views
        private val activeOverlays = mutableMapOf<String, View>()

        // Track which overlays are currently displayed
        private val overlayDisplayed = mutableMapOf<String, Boolean>()
    }
}