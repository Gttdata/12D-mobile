import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import com.uvtechsoft.dimensions.MainActivity

class MyForegroundService : Service() {
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {

        // Create and show a notification
        val runningPackages = getRunningAppPackages()

        // Process the running app packages
        for (packageName in runningPackages) {
            // You can emit this information or handle it as per your requirements
        }
        val notification = createNotification()
        startForeground(MyForegroundService.NOTIFICATION_ID, notification)

        // Return START_STICKY to ensure the service restarts if it's killed
        return START_STICKY
    }

    private fun getRunningAppPackages(): List<String> {
        val usageStatsManager = getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val currentTime = System.currentTimeMillis()
        val stats = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, currentTime - 1000 * 10, currentTime)

        val runningPackages = mutableListOf<String>()
        if (stats != null) {
            for (usageStats in stats) {
                if (usageStats.lastTimeUsed > currentTime - 1000 * 10) { // Check if the app was used within the last 10 seconds
                    val packageName = usageStats.packageName
                    val totalTimeInForeground = usageStats.totalTimeInForeground
                    runningPackages.add(packageName)
                    runningPackages.add(totalTimeInForeground.toString())
                }
            }
        }
        return runningPackages
    }
    private fun createNotification(): Notification {
        // Create a notification channel for Android Oreo and higher
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                MyForegroundService.CHANNEL_ID,
                "Foreground Service Channel",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            val manager = getSystemService(
                NotificationManager::class.java
            )
            manager.createNotificationChannel(channel)
        }

        // Create the notification
        val notificationIntent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(this, 0, notificationIntent,
            PendingIntent.FLAG_IMMUTABLE)
        val builder: Notification.Builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, MyForegroundService.CHANNEL_ID)
                .setContentTitle("Foreground Service")
                .setContentText("Running in background")
                .setSmallIcon(androidx.loader.R.drawable.notification_bg) // Replace with a valid drawable resource
                .setContentIntent(pendingIntent)
                .setCategory(Notification.CATEGORY_SERVICE) // Specify the category as CATEGORY_SERVICE
        } else {
            TODO("VERSION.SDK_INT < O")
        }
        return builder.build()
    }


    override fun onBind(intent: Intent): IBinder? {
        return null
    }

    companion object {
        private const val NOTIFICATION_ID = 12345
        private const val CHANNEL_ID = "ForegroundServiceChannel"
        private const val CHANNEL_NAME = "Foreground Service Channel"
    }
}
