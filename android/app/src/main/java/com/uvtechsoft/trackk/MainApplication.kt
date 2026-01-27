package com.uvtechsoft.dimensions

import android.app.Application
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.graphics.Color
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.soloader.SoLoader

// Newly Imported
import com.facebook.react.BuildConfig
import com.facebook.react.ReactInstanceManager
import java.lang.reflect.InvocationTargetException

class MainApplication : Application(), ReactApplication {
  override val reactNativeHost: ReactNativeHost = object : ReactNativeHost(this) {
    override fun getUseDeveloperSupport(): Boolean {
      return BuildConfig.DEBUG
    }
    override fun getPackages(): List<ReactPackage> {
      val packages: MutableList<ReactPackage> = PackageList(this).packages
      packages.add(CheckUsedAppModule())
      packages.add(RunInBackgroundModule())
      packages.add(BackgroundServiceCheck())
      packages.add(DeviceAdminModule())
      packages.add(AlarmModulePackage()) 
      return packages
    }
    override fun getJSMainModuleName(): String {
      return "index"
    }
  }
  override fun onCreate() {
    super.onCreate()

    // Ensure the FCM channel with id "custom" exists and uses our alarm_sound
    createCustomNotificationChannel()

    val defaultUEH: Thread.UncaughtExceptionHandler = Thread.getDefaultUncaughtExceptionHandler()
    Thread.setDefaultUncaughtExceptionHandler(CustomExceptionHandler(defaultUEH, this))
    SoLoader.init(this, false)
    initializeFlipper(this, reactNativeHost.reactInstanceManager)
  }

  private fun createCustomNotificationChannel() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channel = NotificationChannel(
        "custom",
        "Default Notifications",
        NotificationManager.IMPORTANCE_HIGH
      ).apply {
        description = "Generic channel for FCM notifications"
        enableVibration(true)
        vibrationPattern = longArrayOf(500, 500, 500, 500)
        enableLights(true)
        lightColor = Color.RED
        lockscreenVisibility = Notification.VISIBILITY_PUBLIC
      }

      val notificationManager = getSystemService(NotificationManager::class.java)
      notificationManager.createNotificationChannel(channel)
    }
  }
  companion object {
    private fun initializeFlipper(
      context: Context, reactInstanceManager: ReactInstanceManager
    ) {
      if (BuildConfig.DEBUG) {
        try {
          /*
          * We use reflection here to pick up the class that initializes Flipper,
          * since Flipper library is not available in release mode
          */
          val aClass = Class.forName("com.dimensions.ReactNativeFlipper")
          aClass
            .getMethod(
              "initializeFlipper",
              Context::class.java,
              ReactInstanceManager::class.java
            )
            .invoke(null, context, reactInstanceManager)
        } catch (e: ClassNotFoundException) {
          e.printStackTrace()
        } catch (e: NoSuchMethodException) {
          e.printStackTrace()
        } catch (e: IllegalAccessException) {
          e.printStackTrace()
        } catch (e: InvocationTargetException) {
          e.printStackTrace()
        }
      }
    }
  }
}


// package com.uvtechsoft.dimensions

// import android.app.Application
// import com.facebook.react.PackageList
// import com.facebook.react.ReactApplication
// import com.facebook.react.ReactNativeHost
// import com.facebook.react.ReactPackage
// import com.facebook.react.bridge.ReactApplicationContext
// import com.facebook.react.bridge.NativeModule
// import com.facebook.react.uimanager.ViewManager
// import com.facebook.soloader.SoLoader
// import android.content.Context
// import com.facebook.react.BuildConfig
// import com.facebook.react.ReactInstanceManager
// import java.lang.reflect.InvocationTargetException

// class MainApplication : Application(), ReactApplication {
//   override val reactNativeHost: ReactNativeHost = object : ReactNativeHost(this) {
//     override fun getUseDeveloperSupport() = BuildConfig.DEBUG

//     override fun getPackages(): List<ReactPackage> {
//       val packages = PackageList(this).packages.toMutableList()
//       packages.add(AlarmPackage())
//       return packages
//     }

//     override fun getJSMainModuleName() = "index"
//   }

//   override fun onCreate() {
//     super.onCreate()
//     SoLoader.init(this, false)
//     initializeFlipper(this, reactNativeHost.reactInstanceManager)
//   }

//   companion object {
//     private fun initializeFlipper(context: Context, reactInstanceManager: ReactInstanceManager) {
//       if (BuildConfig.DEBUG) {
//         try {
//           val aClass = Class.forName("com.uvtechsoft.dimensions.ReactNativeFlipper")
//           aClass.getMethod("initializeFlipper", Context::class.java, ReactInstanceManager::class.java)
//             .invoke(null, context, reactInstanceManager)
//         } catch (ignored: Exception) { }
//       }
//     }
//   }
// }

// class AlarmPackage : ReactPackage {
//   override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> =
//     listOf(AlarmModule(reactContext))

//   override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> =
//     emptyList()
// }
