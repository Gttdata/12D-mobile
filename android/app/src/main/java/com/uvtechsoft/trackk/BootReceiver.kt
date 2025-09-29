import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.uvtechsoft.dimensions.BackgroundService

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action == Intent.ACTION_BOOT_COMPLETED) {
            // Start the background service
            val serviceIntent = Intent(context, BackgroundService::class.java)
            context?.startService(serviceIntent)
        }
    }
}
