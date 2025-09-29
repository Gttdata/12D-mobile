package com.uvtechsoft.dimensions

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

class DatabaseHelper(context: Context) : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    override fun onCreate(db: SQLiteDatabase) {
        val createTable = """
            CREATE TABLE usage_stats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                package_name TEXT,
                date TEXT,
                hour INTEGER,
                usage_duration INTEGER,
                START_TIME LONG,
                END_TIME LONG,
                is_app_closed INTEGER
            )   
        """
        db.execSQL(createTable)
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        // Handle database upgrades if needed
        // Example:
        // db.execSQL("DROP TABLE IF EXISTS usage_stats")
        // onCreate(db)
    }

    companion object {
        private const val DATABASE_NAME = "usageStats.db"
        private const val DATABASE_VERSION = 1
    }
}
