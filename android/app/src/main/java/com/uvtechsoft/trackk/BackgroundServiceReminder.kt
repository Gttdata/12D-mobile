package com.uvtechsoft.dimensions;

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.annotation.RequiresApi
import androidx.core.app.NotificationCompat
import com.uvtechsoft.dimensions.R


class BackgroundServiceReminder : Service() {

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val data = intent?.getStringArrayListExtra("data") 
        if (data != null) {
            val dataArray = data.toTypedArray() 
            showOverlayWindow(dataArray)
        }
        val notification = createNotification()
        startForeground(NOTIFICATION_ID, notification)
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    private fun createNotification(): Notification {
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Foreground Service Channel",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    
        val notificationIntent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_IMMUTABLE)


        val builder = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Foreground Service")
            .setContentText("Running in background")
            .setSmallIcon(android.R.drawable.ic_notification_overlay) 
            .setContentIntent(pendingIntent)
            .setCategory(Notification.CATEGORY_SERVICE) 

        return builder.build()
    }

    private fun showOverlayWindow(data: Array<String>?) {
        val intent = Intent(applicationContext, ReminderAcitivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        intent.putExtra("data", data) 
        applicationContext.startActivity(intent)
    }

    companion object {
        private const val CHANNEL_ID = "ForegroundServiceChannel"
        private const val NOTIFICATION_ID = 12345
        private const val OVERLAY_PERMISSION_REQUEST_CODE = 123
    }
}
