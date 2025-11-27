import moment from 'moment';
import SQLite from 'react-native-sqlite-storage';

const database_name = 'tasks.db';
const database_version = '1.0';
const database_displayname = 'SQLite Tasks Database';
const database_size = 200000;

let db;

export const openDatabase = () => {
  if (!db) {
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size,
      () => {
        console.log('Database opened');
        createTable();
      },
      err => {
        console.error('SQL Error: ', err);
      },
    );
  }
  return db;
};


const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tasks (
        ID INTEGER,
        ARCHIVE_FLAG TEXT,
        ASSIGNED_DATE TEXT,
        CLIENT_ID INTEGER,
        COMPLETED_DATE TEXT,
        CREATED_MODIFIED_DATE TEXT,
        DATE_DIFFERENCE INTEGER,
        DESCRIPTIONS TEXT,
        DIAMENTION_ID INTEGER,
        DISABLE_TIMING TEXT,
        ENABLE_TIME TEXT,
        FITNESS_ACTIVITY_ID INTEGER,
        TASK_ID INTEGER,
        IMAGE_URL TEXT,
        IS_SUNDAY_OFF INTEGER,
        LABEL TEXT,
        READ_ONLY TEXT,
        SEQ_NO INTEGER,
        STATUS TEXT,
        SUBSCRIPTION_DETAILS_ID INTEGER,
        SUBSCRIPTION_END_DATE TEXT,
        SUBSCRIPTION_START_DATE TEXT,
        USER_ID INTEGER,
        USER_SUBSCRIPTION_ID INTEGER
      );`,
      [],
      () => {
        console.log('Table created successfully');
      },
      err => {
        console.error('Error creating table: ', err);
      },
    );
  });
};

export const insertTasks = tasks => {
  if (tasks.length === 0) return;

  db.transaction(tx => {
    tasks.forEach(task => {
      tx.executeSql(
        `INSERT INTO tasks (
          ID, ARCHIVE_FLAG, ASSIGNED_DATE, CLIENT_ID, COMPLETED_DATE,
          CREATED_MODIFIED_DATE, DATE_DIFFERENCE, DESCRIPTIONS, DIAMENTION_ID,
          DISABLE_TIMING, ENABLE_TIME, FITNESS_ACTIVITY_ID, TASK_ID, IMAGE_URL,
          IS_SUNDAY_OFF, LABEL, READ_ONLY, SEQ_NO, STATUS, SUBSCRIPTION_DETAILS_ID,
          SUBSCRIPTION_END_DATE, SUBSCRIPTION_START_DATE, USER_ID, USER_SUBSCRIPTION_ID
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          task.ID,
          task.ARCHIVE_FLAG,
          task.ASSIGNED_DATE,
          task.CLIENT_ID,
          task.COMPLETED_DATE,
          task.CREATED_MODIFIED_DATE,
          task.DATE_DIFFERENCE,
          task.DESCRIPTIONS,
          task.DIAMENTION_ID,
          task.DISABLE_TIMING,
          task.ENABLE_TIME,
          task.FITNESS_ACTIVITY_ID,
          task.TASK_ID,
          task.IMAGE_URL,
          task.IS_SUNDAY_OFF,
          task.LABEL,
          task.READ_ONLY,
          task.SEQ_NO,
          task.STATUS,
          task.SUBSCRIPTION_DETAILS_ID,
          task.SUBSCRIPTION_END_DATE,
          task.SUBSCRIPTION_START_DATE,
          task.USER_ID,
          task.USER_SUBSCRIPTION_ID,
        ],
        () => {
          console.log('Task inserted successfully');
        },
        err => {
          console.error('Error inserting task: ', err);
        },
      );
    });
  });
};

export const updateTasksByDate = tasks => {
  if (tasks.length === 0) return;

  const date = tasks[0].ASSIGNED_DATE;

  db.transaction(tx => {
    tasks.forEach(task => {
      tx.executeSql(
        `UPDATE tasks SET 
          ARCHIVE_FLAG = ?,
          CLIENT_ID = ?,
          COMPLETED_DATE = ?,
          CREATED_MODIFIED_DATE = ?,
          DATE_DIFFERENCE = ?,
          DESCRIPTIONS = ?,
          DIAMENTION_ID = ?,
          DISABLE_TIMING = ?,
          ENABLE_TIME = ?,
          FITNESS_ACTIVITY_ID = ?,
          TASK_ID = ?,
          IMAGE_URL = ?,
          IS_SUNDAY_OFF = ?,
          LABEL = ?,
          READ_ONLY = ?,
          SEQ_NO = ?,
          STATUS = ?,
          SUBSCRIPTION_DETAILS_ID = ?,
          SUBSCRIPTION_END_DATE = ?,
          SUBSCRIPTION_START_DATE = ?,
          USER_ID = ?,
          USER_SUBSCRIPTION_ID = ?
        WHERE ASSIGNED_DATE = ? AND ID = ?`,
        [
          task.ARCHIVE_FLAG,
          task.CLIENT_ID,
          task.COMPLETED_DATE,
          task.CREATED_MODIFIED_DATE,
          task.DATE_DIFFERENCE,
          task.DESCRIPTIONS,
          task.DIAMENTION_ID,
          task.DISABLE_TIMING,
          task.ENABLE_TIME,
          task.FITNESS_ACTIVITY_ID,
          task.TASK_ID,
          task.IMAGE_URL,
          task.IS_SUNDAY_OFF,
          task.LABEL,
          task.READ_ONLY,
          task.SEQ_NO,
          task.STATUS,
          task.SUBSCRIPTION_DETAILS_ID,
          task.SUBSCRIPTION_END_DATE,
          task.SUBSCRIPTION_START_DATE,
          task.USER_ID,
          task.USER_SUBSCRIPTION_ID,
          date,
          task.ID,
        ],
        () => {
          console.log('Task updated successfully');
        },
        err => {
          console.error('Error updating task: ', err);
        },
      );
    });
  });
};

export const getTasksByDate = (date, userId, callback) => {
  const dbDate = date;

  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM tasks WHERE ASSIGNED_DATE LIKE ? AND USER_ID = ?`,
      [dbDate, userId],
      (tx, results) => {
        const { rows } = results;
        let tasks = [];
        if (rows.length > 0) {
          for (let i = 0; i < rows.length; i++) {
            tasks.push(rows.item(i));
          }
          callback(tasks);
        } else {
          callback([]);
        }
      },
      (tx, err) => {
        console.error('Error fetching tasks: ', err);
        callback([]);
      },
    );
  });
};

export const deleteTasksByDate = date => {
  db.transaction(tx => {
    tx.executeSql(
      `DELETE FROM tasks WHERE ASSIGNED_DATE = ?`,
      [date],
      () => {
        console.log('Tasks deleted successfully for date: ', date);
      },
      err => {
        console.error('Error deleting tasks: ', err);
      },
    );
  });
};

export const createSubmitApiFlagTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS submitApiFlag (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        date TEXT,
        flag TEXT,
        UNIQUE(userId, date)
      );`,
      [],
      () => {
        console.log('SubmitApiFlag table created successfully');
      },
      (tx, error) => {
        console.error('Error creating SubmitApiFlag table: ', error);
      },
    );
  });
};

export const setSubmitApiCalledFlag = (userId, date) => {
  const today = date;
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO submitApiFlag (userId, date, flag) VALUES (?, ?, ?)`,
      [userId, today, 'true'],
      () => {
        console.log('Submit API flag set successfully');
      },
      (tx, error) => {
        console.error('Error setting submit API flag: ', error);
      },
    );
  });
};

export const getSubmitApiCalledFlag = (userId, date) => {
  return new Promise((resolve, reject) => {
    const today = date;
    db.transaction(tx => {
      tx.executeSql(
        `SELECT flag FROM submitApiFlag WHERE userId = ? AND date = ?`,
        [userId, today],
        (tx, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0).flag === 'true');
          } else {
            resolve(false);
          }
        },
        (tx, error) => {
          console.error('Error getting submit API flag: ', error);
          reject(error);
        },
      );
    });
  });
};

export const deleteTableData = () => {
  db.transaction(tx => {
    tx.executeSql(
      `DELETE FROM tasks;`,
      [],
      () => console.log("All tasks deleted successfully"),
      (tx, err) => {
        console.error("Error deleting tasks data:", err);
        return true;
      }
    );
  });
};
