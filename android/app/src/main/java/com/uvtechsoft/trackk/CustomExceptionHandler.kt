package com.uvtechsoft.dimensions

import android.content.Context
import android.os.Build
import java.io.BufferedReader
import java.io.File
import java.io.FileWriter
import java.io.InputStreamReader

class CustomExceptionHandler(
    private val defaultUEH: Thread.UncaughtExceptionHandler,
    private val context: Context
) : Thread.UncaughtExceptionHandler {

    override fun uncaughtException(thread: Thread, throwable: Throwable) {
        try {
            val logFile = File(context.getExternalFilesDir(null), "logcat_output.txt")
            val writer = FileWriter(logFile, true)

            // Write device information
            writeDeviceInfo(writer)

            // Write throwable details
            writer.write("\n\nThrowable Details:\n")
            writer.write(throwable.toString() + "\n")
            throwable.stackTrace.forEach { writer.write(it.toString() + "\n") }

            // Fetch and write logcat logs
            writer.write("\n\nLogcat Logs:\n")
            fetchLogcatLogs(writer)

            writer.close()
        } catch (e: Exception) {
            e.printStackTrace()
        }

        defaultUEH.uncaughtException(thread, throwable)
    }

    private fun writeDeviceInfo(writer: FileWriter) {
        try {
            writer.write("Device Info:\n")
            writer.write("Manufacturer: ${Build.MANUFACTURER}\n")
            writer.write("Model: ${Build.MODEL}\n")
            writer.write("Android Version: ${Build.VERSION.RELEASE}\n")
            // Add more device info as needed
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun fetchLogcatLogs(writer: FileWriter) {
        try {
            val process = Runtime.getRuntime().exec("logcat -d")
            val bufferedReader = BufferedReader(InputStreamReader(process.inputStream))

            var line: String?
            while (bufferedReader.readLine().also { line = it } != null) {
                writer.write("$line\n")
            }

            process.destroy()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
