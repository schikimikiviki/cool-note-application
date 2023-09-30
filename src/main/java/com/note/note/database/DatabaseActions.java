package com.note.note.database;

import com.note.note.data.Note;

import java.sql.Connection;
import java.sql.*;
import java.sql.PreparedStatement;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;


public class DatabaseActions {
    private final Database database;

    Scanner scanner = new Scanner(System.in);

    public DatabaseActions(Database database) {
        this.database = database;
    }

    public void save(Note note) {
        String checkNameTemplate = "SELECT COUNT(*) FROM notes WHERE id = ?";
        String insertTemplate = "INSERT INTO notes (name, contents) VALUES (?, ?)";

        try (Connection connection = database.getConnection();
             PreparedStatement checkNameStatement = connection.prepareStatement(checkNameTemplate);
             PreparedStatement insertStatement = connection.prepareStatement(insertTemplate)) {

            String newName = note.getName();
            String newContent = note.getContent();

            insertStatement.setString(1, newName);
            insertStatement.setString(2, newContent);

            insertStatement.executeUpdate();

            System.out.println("Note was saved.");
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }



//    public class NoRecipeFoundException extends Exception {
//        public NoRecipeFoundException(String message) {
//            super(message);
//        }
//    }

//    public void deleteRecipe(String recipeName) {
//        String deleteTemplate = "DELETE FROM recipes WHERE name = ? AND id = ?";
//
//        try (Connection connection = database.getConnection();
//             PreparedStatement deleteStatement = connection.prepareStatement(deleteTemplate)) {
//
//            List<Integer> recipeIds = findRecipeIdsByName(recipeName);
//
//            if (recipeIds.isEmpty()) {
//                System.out.println("Recipe not found");
//            } else {
//
//                int recipeId = recipeIds.get(0);
//                deleteStatement.setString(1, recipeName);
//                deleteStatement.setInt(2, recipeId);
//                deleteStatement.executeUpdate();
//                System.out.println("Recipe was deleted");
//            }
//
//        } catch (SQLException e) {
//            throw new RuntimeException(e);
//        }
//    }

/**/
//    private List<Integer> findRecipeIdsByName(String recipeName) {
//        List<Integer> recipeIds = new ArrayList<>();
//        String selectTemplate = "SELECT id FROM recipes WHERE name = ?";
//
//        try (Connection connection = database.getConnection();
//             PreparedStatement selectStatement = connection.prepareStatement(selectTemplate)) {
//
//            selectStatement.setString(1, recipeName);
//
//            try (ResultSet resultSet = selectStatement.executeQuery()) {
//                while (resultSet.next()) {
//                    int recipeId = resultSet.getInt("id");
//                    recipeIds.add(recipeId);
//                }
//            }
//        } catch (SQLException e) {
//            throw new RuntimeException(e);
//        }
//
//        return recipeIds;
//    }
//
//    public List<Recipe> executeRecipeQuery(String queryTemplate, Object... params) throws NoRecipeFoundException {
//        List<Recipe> recipes = new ArrayList<>();
//
//        try (Connection connection = database.getConnection();
//             PreparedStatement statement = connection.prepareStatement(queryTemplate)) {
//
//            for (int i = 0; i < params.length; i++) {
//                statement.setObject(i + 1, params[i]);
//            }
//
//            try (ResultSet resultSet = statement.executeQuery()) {
//                while (resultSet.next()) {
//                    String recipeName = resultSet.getString("name");
//                    String[] ingredients = resultSet.getString("ingredients").split(",");
//                    int numberOfIngredients = resultSet.getInt("number_of_ingredients");
//                    int duration = resultSet.getInt("duration");
//                    int numberOfServings = resultSet.getInt("servings");
//                    String[] tags = resultSet.getString("tags").split(",");
//                    String instructions = resultSet.getString("instructions");
//
//                    Recipe recipe = new Recipe(recipeName, ingredients, numberOfIngredients, duration, numberOfServings, tags, instructions);
//                    recipes.add(recipe);
//                }
//            }
//        } catch (SQLException e) {
//            throw new RuntimeException(e);
//        }
//
//        if (recipes.isEmpty()) {
//            throw new NoRecipeFoundException("No recipes found.");
//        }
//
//        return recipes;
//    }
//
//
//
//    public List<Recipe> findRecipe(String searchTerm) throws NoRecipeFoundException {
//        String template = "SELECT * FROM recipes WHERE name LIKE ? OR ? = ANY(tags) OR ? = ANY(ingredients)";
//        String wildcardSearchTerm = "%" + searchTerm + "%";
//
//        return executeRecipeQuery(template, wildcardSearchTerm, searchTerm, searchTerm);
//    }
//
//    public List<Recipe> getAllRecipes() throws NoRecipeFoundException {
//        String template = "SELECT * FROM recipes";
//        return executeRecipeQuery(template);
//    }
//
//    public void updateRecipe(String recipeToUpdate) {
//        String selectTemplate = "SELECT * FROM recipes WHERE name = ?";
//        String updateTemplate = "UPDATE recipes SET name = ?, ingredients = ?, number_of_ingredients = ?, duration = ?, servings = ?, tags = ?, instructions = ? WHERE id = ?";
//
//        try (Connection connection = database.getConnection();
//             PreparedStatement selectStatement = connection.prepareStatement(selectTemplate);
//             PreparedStatement updateStatement = connection.prepareStatement(updateTemplate)) {
//
//            selectStatement.setString(1, recipeToUpdate);
//            try (ResultSet resultSet = selectStatement.executeQuery()) {
//                if (resultSet.next()) {
//                    int recipeId = resultSet.getInt("id");
//
//                    System.out.println("Enter updated name:");
//                    String updatedName = scanner.nextLine();
//
//                    System.out.println("Enter updated ingredients separated by commas:");
//                    String updatedIngredients = scanner.nextLine();
//                    String[] updatedIngredientsArray = updatedIngredients.split(",", 0);
//
//                    for (int i = 0; i < updatedIngredientsArray.length; i++) {
//                        updatedIngredientsArray[i] = " " + updatedIngredientsArray[i].trim() + " ";
//                    }
//
//                    System.out.println("Enter the updated duration");
//                    int updatedDuration = scanner.nextInt();
//
//                    System.out.println("Enter the updated number of servings");
//                    int updatedServings = scanner.nextInt();
//
//                    // Consume any remaining newline characters in the buffer
//                    scanner.nextLine();
//
//                    System.out.println("Enter updated tags");
//                    String updatedTagsList = scanner.nextLine();
//                    String[] updatedTagArray = updatedTagsList.split(",", 0);
//
//                    for (int i = 0; i < updatedTagArray.length; i++) {
//                        updatedTagArray[i] = " " + updatedTagArray[i].trim() + " ";
//                    }
//
//                    System.out.println("Enter updated instructions");
//                    String updatedInstructions = scanner.nextLine();
//
//
//                    updateStatement.setString(1, updatedName);
//                    updateStatement.setArray(2, connection.createArrayOf("VARCHAR", updatedIngredientsArray));
//                    updateStatement.setInt(3, updatedIngredientsArray.length);
//                    updateStatement.setInt(4, updatedDuration);
//                    updateStatement.setInt(5, updatedServings);
//                    updateStatement.setArray(6, connection.createArrayOf("VARCHAR", updatedTagArray));
//                    updateStatement.setString(7, updatedInstructions);
//                    updateStatement.setInt(8, recipeId);
//
//                    updateStatement.executeUpdate();
//                    System.out.println("Recipe was updated");
//                } else {
//                    System.out.println("Recipe not found");
//                }
//            }
//        } catch (SQLException e) {
//            throw new RuntimeException(e);
//        }
//    }


}
