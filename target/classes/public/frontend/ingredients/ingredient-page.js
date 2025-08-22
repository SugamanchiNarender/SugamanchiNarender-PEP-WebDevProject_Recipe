/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
const addIngredientNameInput =document.getElementById("add-ingredient-name-input");
const deleteIngredientNameInput =document.getElementById("delete-ingredient-name-input");
const ingredientListContainer =document.getElementById("ingredient-list");
//const searchInput =document.getElementById("search-input");
//const adminLink =document.getElementById("admin-link");

/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
const addIngredientSubmitButton = document.getElementById("add-ingredient-submit-button");
const deleteIngredientSubmitButton =document.getElementById("delete-ingredient-submit-button");

addIngredientSubmitButton.onclick = addIngredient;
deleteIngredientSubmitButton.onclick =deleteIngredient;

/*
 * TODO: Create an array to keep track of ingredients
 */
let ingredients =[];

/* 
 * TODO: On page load, call getIngredients()
 */
window.onload =() => {
    getIngredients();
};


/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    // Implement add ingredient logic here
    try {
       const ingredientName = addIngredientNameInput.value.trim();
       if(!ingredientName){
        alert("Cannot be empty")
        return
       }
       const token = sessionStorage.getItem("auth-token");

       const headers ={
        "Content-Type" : "application/json"
       }

       if(token){
        headers["Authorization"] = `Bearer ${token}`;
       }

       const response = await fetch(`${BASE_URL}/ingredients/`,{
            method : "POST",
            headers :headers,
            body: JSON.stringify({ name : ingredientName})
        });

        if(response.ok ){
            addIngredientNameInput.value = "";
            await getIngredients (); 
        }
        else{
            alert("Failed to Add!")
        }

    } catch (error) {
        console.error(error);
    }
}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
    try {
        const authToken =sessionStorage.getItem("auth-token");
        const headers ={};
        if(authToken){
            headers["Authorization"] = `Bearer ${authToken}`;

        }
        const response =await fetch(`${BASE_URL}/ingredients`,{
            method: "GET",
            headers : headers

        });
        if(!response.ok){
            throw new Error("Failed to get Ingredients");
        }
        ingredients = await response.json();
        refreshIngredientList();


    } catch (error) {
        console.error(error);
    }
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Implement delete ingredient logic here
    try {
        const ingredientName = deleteIngredientNameInput.value.trim();
        if(!ingredientName){
            alert("Cannot be empty");
            return
        }
        const ingredient = ingredients.find(ing => ing.name.toLowerCase() === ingredientName.toLowerCase());
        if (!ingredient) {
            alert("Ingredient not found!");
            return;
        }
        const token = sessionStorage.getItem("auth-token");
        const headers = {}
        if(token){
            headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await fetch(`${BASE_URL}/ingredients/${ingredient.id}`, {
            method:"DELETE",
            headers:headers,
        });
        if(response.ok){
            deleteIngredientNameInput.value="";
            await getIngredients();
        }else{
            alert("Unable to Delete")
        }
        
    } catch (error) {
        console.error(error);
        
    }
    
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    ingredientListContainer .innerHTML ="";
    ingredients.forEach(ingredient => {
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.innerText =ingredient.name;
        li.appendChild(p);
        ingredientListContainer.appendChild(li);
    });
}
