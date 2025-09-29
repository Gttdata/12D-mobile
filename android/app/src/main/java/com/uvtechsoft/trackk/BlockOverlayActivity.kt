package com.uvtechsoft.dimensions

import android.app.Activity
import android.os.Bundle
import android.widget.TextView

class BlockOverlayActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_block_overlay)

        val remaining = intent.getStringExtra("remaining_time")
        val msg = findViewById<TextView>(R.id.blockMessage)
        msg.text = "🚫 This app is blocked.\nWait $remaining minutes."
    }

    override fun onBackPressed() {
        // Disable back button so user cannot bypass
    }
}
