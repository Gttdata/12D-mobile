package com.uvtechsoft.dimensions

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.net.Uri
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import androidx.core.app.NotificationCompat

class AlarmService : Service() {
  private var mp: MediaPlayer? = null
  private val CHANNEL_ID = "custom"
  private val NOTIFICATION_ID = 1234
  private var wakeLock: PowerManager.WakeLock? = null

  override fun onCreate() {
    super.onCreate()
    createNotificationChannel()
    acquireWakeLock()
  }

  private fun acquireWakeLock() {
    val powerManager = getSystemService(POWER_SERVICE) as PowerManager
    wakeLock = powerManager.newWakeLock(
      PowerManager.PARTIAL_WAKE_LOCK or
              PowerManager.ACQUIRE_CAUSES_WAKEUP or
              PowerManager.ON_AFTER_RELEASE,
      "Dimensions:AlarmWakeLock"
    )
    wakeLock?.acquire(10 * 60 * 1000L /*10 minutes*/)
  }

  private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      // Use your raw resource URI
      val soundUri = Uri.parse("android.resource://${packageName}/${R.raw.alarm_sound}")

      val audioAttributes = AudioAttributes.Builder()
        .setUsage(AudioAttributes.USAGE_ALARM)
        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
        .build()

      val channel = NotificationChannel(
        CHANNEL_ID,
        "Alarm Channel",
        NotificationManager.IMPORTANCE_HIGH
      ).apply {
        description = "Channel for alarm notifications"
        setSound(soundUri, audioAttributes) // Set custom sound here
        enableVibration(true)
        vibrationPattern = longArrayOf(500, 500, 500, 500)
        enableLights(true)
        lightColor = android.graphics.Color.RED
        lockscreenVisibility = Notification.VISIBILITY_PUBLIC
      }

      val notificationManager = getSystemService(NotificationManager::class.java)
      notificationManager.createNotificationChannel(channel)
    }
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    when (intent?.action) {
      "START" -> startAlarm()
      "STOP" -> stopAlarm()
    }
    return START_STICKY
  }

  private fun startAlarm() {
    if (mp == null) {
      // Play sound directly through MediaPlayer
      mp = MediaPlayer.create(this, R.raw.alarm_sound).apply {
        setWakeMode(applicationContext, PowerManager.PARTIAL_WAKE_LOCK)
        isLooping = true
        setAudioAttributes(
          AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_ALARM)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build()
        )
        start()
      }

      // Create notification with silent sound
      val notification = NotificationCompat.Builder(this, CHANNEL_ID)
        .setContentTitle("Alarm")
        .setContentText("Alarm is ringing")
        .setSmallIcon(R.mipmap.ic_launcher)
        .setPriority(NotificationCompat.PRIORITY_MAX)
        .setCategory(NotificationCompat.CATEGORY_ALARM)
        .setOngoing(true)
        .setAutoCancel(false)
        .setSilent(true) // Important: Notification should be silent
        .build()

      startForeground(NOTIFICATION_ID, notification)
    }
  }

  private fun stopAlarm() {
    mp?.let {
      if (it.isPlaying) {
        it.stop()
      }
      it.release()
    }
    mp = null
    stopForeground(true)
    stopSelf()
  }

  override fun onDestroy() {
    wakeLock?.release()
    wakeLock = null
    stopAlarm()
    super.onDestroy()
  }

  override fun onBind(intent: Intent?): IBinder? = null
}