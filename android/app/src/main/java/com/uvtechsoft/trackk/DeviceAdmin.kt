package com.uvtechsoft.dimensions
import MyDeviceAdminReceiver
import android.app.Activity
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.os.Build
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod


class DeviceAdmin(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(
        reactContext
    ) {
    private val devicePolicyManager: DevicePolicyManager
    private var componentName: ComponentName
    private val INJECT_EVENTS_REQUEST_CODE = 123
    private val INJECT_EVENTS_PERMISSION = "android.permission.INJECT_EVENTS"



    private val mActivityEventListener: ActivityEventListener =
        object : BaseActivityEventListener() {
            override fun onActivityResult(
                activity: Activity,
                requestCode: Int,
                resultCode: Int,
                data: Intent?
            ) {
                if (requestCode == REQUEST_DEVICE_ADMIN_PERMISSION) {
                    // Handle result here if needed
                }
            }
        }

    init {
        reactContext.addActivityEventListener(mActivityEventListener)
        devicePolicyManager =
            reactContext.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        componentName = ComponentName(reactContext, MyDeviceAdminReceiver::class.java)
    }

    override fun getName(): String {
        return "DeviceAdmin"
    }


    @ReactMethod
    fun requestInjectEventsPermission(successCallback: Callback, errorCallback: Callback) {
        try {
            val currentActivity = getCurrentActivity()
            if (currentActivity != null) {
                if (ContextCompat.checkSelfPermission(currentActivity, INJECT_EVENTS_PERMISSION)
                    != PackageManager.PERMISSION_GRANTED
                ) {
                    ActivityCompat.requestPermissions(
                        currentActivity,
                        arrayOf(INJECT_EVENTS_PERMISSION),
                        INJECT_EVENTS_REQUEST_CODE
                    )
                } else {
                    // Permission already granted
                    successCallback.invoke()
                }
            } else {
                errorCallback.invoke("Activity is null")
            }
        } catch (e: Exception) {
            errorCallback.invoke(e.message)
        }
    }

    @RequiresApi(Build.VERSION_CODES.M)
    @ReactMethod
    fun requestOverlayPermissionWithCheck() {
        if (Settings.canDrawOverlays(reactContext)) {
            // Permission already granted, invoke successCallback

                   } else {

            try {
                val intent = Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:" + reactApplicationContext.packageName)
                )
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                reactApplicationContext.startActivity(intent)
//                successCallback.invoke()
            } catch (e: java.lang.Exception) {
//                errorCallback.invoke(e.message)
            }
        }
    }


    @ReactMethod
    fun requestDeviceAdminPermission(successCallback: Callback, errorCallback: Callback) {
        try {

            val intent = Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN)
            val componentName = ComponentName(reactContext, MyDeviceAdminReceiver::class.java)
//            componentName = ComponentName(reactContext, "com.uvtechsoft.dimensions.MyDeviceAdminReceiver")

            intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, componentName)
            intent.putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION, "Your explanation for why you need device admin")
            currentActivity!!.startActivityForResult(intent, REQUEST_DEVICE_ADMIN_PERMISSION)

            successCallback.invoke()
        } catch (e: Exception) {
            errorCallback.invoke(e.message)
        }
    }

    companion object {
        private const val REQUEST_DEVICE_ADMIN_PERMISSION = 1
    }

    @ReactMethod
    fun blockPackage(packageName: String) {


        val devicePolicyManager = reactContext.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        val componentName = ComponentName(reactContext, "com.uvtechsoft.dimensions.MyDeviceAdminReceiver")

        if (devicePolicyManager.isAdminActive(componentName)) {
//
            val restrictions = Bundle().apply {
                // Add restrictions as key-value pairs
                // Example: restrict the app from accessing the camera
                putBoolean("no_camera", true)
                // You can add more restrictions as needed
            }
            devicePolicyManager.setApplicationRestrictions(componentName, packageName, restrictions)
        } else {
            val intent = Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN)
            intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, componentName)
            intent.putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION, "Your explanation for why you need device admin")
            // Start the activity from the current activity in the ReactApplicationContext
            reactContext.currentActivity?.startActivityForResult(intent, REQUEST_DEVICE_ADMIN_PERMISSION)
            Log.e("DeviceAdmin", "Device admin permission not granted.")
        }
    }
}

