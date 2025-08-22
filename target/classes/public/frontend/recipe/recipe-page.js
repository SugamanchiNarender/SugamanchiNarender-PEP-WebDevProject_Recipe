/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */

    const addRecipeName = document.getElementById("add-recipe-name-input");
    const addRecipeInstruction =document.getElementById("add-recipe-instructions-input");
    const addRecipeSubmitButton =document.getElementById("add-recipe-submit-input");

    const updateRecipeName =document.getElementById("update-recipe-name-input")
    const updateRecipeInstruction = document.getElementById("update-recipe-instructions-input");
    const updateRecipeSubmitButton =document.getElementById("update-recipe-submit-input");

    const deleteRecipeName = document.getElementById("delete-recipe-name-input");
    const deleteRecipeSubmitButton = document.getElementById("delete-recipe-submit-input");

    const recipeList = document.getElementById("recipe-list");

    const adminLink = document.getElementById("admin-link");
    const logoutButton = document.getElementById("logout-button");

    const searchInput = document.getElementById("search-input");
    const searchButton =document.getElementById("search-button");


    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */

    //const authToken = sessionStorage.getItem("auth-token")
    if(sessionStorage.getItem("auth-token")){
        logoutButton.style.display = "inline"
    }

    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    //const isAdmin =sessionStorage.getItem("is-admin")
    if(sessionStorage.getItem("is-admin") === "true"){
        adminLink.style.display = "inline"
    }

    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    addRecipeSubmitButton.addEventListener("click", addRecipe)
    updateRecipeSubmitButton.addEventListener("click",updateRecipe)
    deleteRecipeSubmitButton.addEventListener("click",deleteRecipe)
    searchButton.addEventListener("click",searchRecipes)
    logoutButton.addEventListener("click",processLogout);

    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    getRecipes();
    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        try {
            const searchTerm = searchInput.value.trim();
            const authToken = sessionStorage.getItem("auth-token");
            const headers = {};
            if(authToken){
                headers["Authorization"] = `Bearer ${authToken}`;
            }
            const url = `${BASE_URL}/recipes?name=${encodeURIComponent(searchTerm)}`;
            const response = await fetch(url,{
                method : "GET",
                headers : headers
            });
            if(!response.ok){
               throw new Error("Failed to Fetch Recipes")
            }
            const searchResults =await response.json();
            refreshRecipeList(searchResults);

        } catch (error) {
            console.error(error);
        }
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        const name = addRecipeName.value.trim();
        const instructions = addRecipeInstruction.value.trim();
        if(!name || !instructions){
            alert ("Enter name and instructions");
            return;
        }
        try {
            const authToken = sessionStorage.getItem("auth-token");
            const response = await fetch (`${BASE_URL}/recipes`,{
                method : "POST",
                headers :{
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ name , instructions})
            });
            if(!response.ok) {
                if(response.status === 401){
                    alert("Authentication Failed.")
                    return;
                }
                throw new Error("Try Again!");
            }
            addRecipeName.value ="";
            addRecipeInstruction.value="";
            await getRecipes();
        } catch (error) {
            console.error(error);
        }
        
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        const name = updateRecipeName.value.trim();
        const instructions = updateRecipeInstruction.value
        if(!name || !instructions){
            alert ("Enter name and instructions");
            return
        }
        const recipe = recipes.find(r => r.name.toLowerCase() === name.toLowerCase());
        if(!recipe){
            alert("Recipe not Found");
            return
        }
        try {
            const authToken = sessionStorage.getItem("auth-token") 
            const response = await fetch (`${BASE_URL}/recipes/${recipe.id}`,{
                method : "PUT",
                headers :{
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ name , instructions})
            });
            if(!response.ok) {
                if(response.status === 401){
                    alert("Authentication Failed.")
                    return
                }
                if(response.status === 404){
                    alert("Recipe Not Found")
                    return
                }

            }
            updateRecipeName.value = '';
            updateRecipeInstruction.value="";
            await getRecipes();
            alert("Recipe updated successfully");
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
        const name =deleteRecipeName.value.trim();
        if(!name){
            alert("enter recipe name");
            return
        }
        const authToken = sessionStorage.getItem("auth-token") 
        const recipe = recipes.find(r => r.name.toLowerCase() === name.toLowerCase());
        if(!recipe){
            alert("recipe not found");
            return
        }
        try {
            const response = await fetch(`${BASE_URL}/recipes/${recipe.id}`,{
                method : "DELETE",
                headers :{
                    "Authorization" : `Bearer ${authToken}`
                }
            });
            if(!response.ok){
                if(response.status === 401){
                    alert("Authentacation Failed");
                    return
                }
                if(response.status === 404){
                    alert("Recipe not Found");
                    return
                }
                throw new Error ("Failed to Delete")
            }
            deleteRecipeName.value="";
            await getRecipes();
        } catch (error) {
            console.error(error);
            
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        try {
            const authToken = sessionStorage.getItem("auth-token");
            const headers ={};
            if(authToken){
                headers["Authorization"] = `Bearer ${authToken}`;
            }
            const response = await fetch(`${BASE_URL}/recipes`,{
                method:"GET",
                headers:headers

            });
            if(!response.ok){
                throw new Error("Failed to get Recipes")
            }
            recipes =await response.json();
            refreshRecipeList(recipes);
        } catch (error) {
            console.error(error);
            
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList(recipeL = recipes) {
        // Implement refresh logic here
        recipeList.innerHTML="";
        recipeL.forEach(r =>{
            const li = document.createElement("li");
            li.innerHTML = `${r.name} : ${r.instructions}`
            recipeList.appendChild(li);
        });
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
        try {
            const authToken = sessionStorage.getItem("auth-token")
            const response = await fetch(`${BASE_URL}/logout`,{
                method : "POST",
                headers : {
                    'Authorization' : `Bearer ${authToken}`
                } 
            });
            if(!response.ok){
                throw new Error("Logout Failed");
            }
            sessionStorage.removeItem("auth-token");
            sessionStorage.removeItem("is-admin");
            window.location.href = "../login/login-page.html";
        } catch (error) {
            console.error(error);

            
        }
    }

});
