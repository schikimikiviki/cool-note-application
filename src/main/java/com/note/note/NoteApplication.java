package com.note.note;

import com.note.note.data.Note;
import com.note.note.database.Database;
import com.note.note.database.TableInitializer;
import com.note.note.database.TableStatements;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Map;


//Todo: Er erstellt Table notes, statt notes_list ???
@SpringBootApplication
public class NoteApplication {

    public static void main(String[] args) {
        SpringApplication.run(NoteApplication.class, args);


        Database database = new Database(
                "jdbc:postgresql://localhost:5432/notes-application",
                "postgres",
                "postgres");
        Map<String, String> tables = Map.of(
                "notes", TableStatements.NOTES
        );
        TableInitializer tableInitializer = new TableInitializer(database, tables);
        tableInitializer.initialize();


    }


}
