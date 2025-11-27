import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import android.util.Log
import android.widget.Toast
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class BatteryRestrictions(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "BatteryRestrictions"
    }

    @RequiresApi(Build.VERSION_CODES.M)
    @ReactMethod
    fun openBatteryOptimizationSettings() {
        val packageName = reactApplicationContext.packageName
        val powerManager = reactApplicationContext.getSystemService(Context.POWER_SERVICE) as PowerManager

        if (!powerManager.isIgnoringBatteryOptimizations(packageName)){
            val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS)
            intent.data = Uri.parse("package:$packageName")
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            try {
                reactApplicationContext.startActivity(intent)
            } catch (e: Exception) {
                showToast("Unable to open battery optimization settings.")
            }
        }else{
        }
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !powerManager.isIgnoringBatteryOptimizations(packageName)) {
//            // Open the battery optimization settings screen
//            val intent = Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS)
//            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
//            Log.d("context", "reactApplicationContext")
//
//            reactApplicationContext.startActivity(intent)
//        }
    }
    @RequiresApi(Build.VERSION_CODES.M)
    @ReactMethod
    fun requestBatteryOptimizationExemption() {
        val packageName = reactApplicationContext.packageName
        val powerManager = reactApplicationContext.getSystemService(Context.POWER_SERVICE) as PowerManager

        if (!powerManager.isIgnoringBatteryOptimizations(packageName)) {
            // Open the battery optimization settings screen

            val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS)
            intent.data = Uri.parse("package:$packageName")
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            try {
                reactApplicationContext.startActivity(intent)
            } catch (e: Exception) {
                showToast("Unable to open battery optimization settings.")
            }
        } else {

        }
    }

    private fun showToast(message: String) {
        Toast.makeText(reactApplicationContext, message, Toast.LENGTH_SHORT).show()
    }
}
