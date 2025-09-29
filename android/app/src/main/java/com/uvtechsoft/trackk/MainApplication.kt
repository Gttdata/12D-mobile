package com.uvtechsoft.dimensions

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.soloader.SoLoader


// Newly Imported
import android.content.Context
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
      return packages
    }
    override fun getJSMainModuleName(): String {
      return "index"
    }
  }
  override fun onCreate() {
    super.onCreate()
    val defaultUEH: Thread.UncaughtExceptionHandler = Thread.getDefaultUncaughtExceptionHandler()
    Thread.setDefaultUncaughtExceptionHandler(CustomExceptionHandler(defaultUEH, this))
    SoLoader.init(this, false)
    initializeFlipper(this, reactNativeHost.reactInstanceManager)
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
