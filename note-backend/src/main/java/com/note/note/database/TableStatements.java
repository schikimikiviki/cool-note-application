package com.note.note.database;

public interface TableStatements {
    String NOTES = "CREATE TABLE IF NOT EXISTS notes (" +
            "id SERIAL PRIMARY KEY," +
            "name VARCHAR(100)," +
            "contents TEXT," +
            "color VARCHAR(100)," +
            "done BOOLEAN" +
            ");";

}
