package com.uvtechsoft.dimensions

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import com.facebook.react.bridge.*

class AlarmModule(private val ctx: ReactApplicationContext) : ReactContextBaseJavaModule(ctx) {
  override fun getName() = "AlarmModule"

  @ReactMethod
  fun scheduleAlarm(msFromNow: Double) {
    val alarmAt = System.currentTimeMillis() + msFromNow.toLong()

    val alarmIntent = Intent(ctx, AlarmReceiver::class.java).apply {
      action = "START" // Must set this action to trigger alarm playback
    }

    val pi = PendingIntent.getBroadcast(
      ctx,
      0,
      alarmIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )

    val alarmManager = ctx.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, alarmAt, pi)
  }

  @ReactMethod
  fun stopAlarm() {
    val stopIntent = Intent(ctx, AlarmService::class.java).apply {
      action = "STOP"
    }
    ctx.startService(stopIntent)
  }
}
