package com.uvtechsoft.dimensions

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build

class AlarmReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    val serviceIntent = Intent(context, AlarmService::class.java)

    // Forward the action from AlarmReceiver's intent to AlarmService if present
    if (intent.action != null) {
      serviceIntent.action = intent.action
    } else {
      // Default to START action to play alarm
      serviceIntent.action = "START"
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      context.startForegroundService(serviceIntent)
    } else {
      context.startService(serviceIntent)
    }
  }
}
