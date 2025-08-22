/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - usernameInput, emailInput, passwordInput, repeatPasswordInput, registerButton
 */
 var usernameInput = document.getElementById("username-input");
 var emailInput =document.getElementById("email-input");
 var passwordInput = document.getElementById("password-input");
 var repeatPasswordInput =document.getElementById("repeat-password-input");
 var button =document.getElementById("register-button");



/* 
 * TODO: Ensure the register button calls processRegistration when clicked
 */
button.onclick = processRegistration;

/**
 * TODO: Process Registration Function
 * 
 * Requirements:
 * - Retrieve username, email, password, and repeat password from input fields
 * - Validate all fields are filled
 * - Check that password and repeat password match
 * - Create a request body with username, email, and password
 * - Define requestOptions using method POST and proper headers
 * 
 * Fetch Logic:
 * - Send POST request to `${BASE_URL}/register`
 * - If status is 201:
 *      - Redirect user to login page
 * - If status is 409:
 *      - Alert that user/email already exists
 * - Otherwise:
 *      - Alert generic registration error
 * 
 * Error Handling:
 * - Wrap in try/catch
 * - Log error and alert user
 */
async function processRegistration() {
    // Implement registration logic here

    // Example placeholder:
    try {
        const username = usernameInput.value;
        const email =emailInput.value;
        const password = passwordInput.value;
        const repeatPassword =repeatPasswordInput.value;

        if(username == null || email == null || password == null || repeatPassword == null ){
            alert("Field cannot be empty")
            return
        }
        if(password !== repeatPassword){
            alert("Check your password")
            return
        }
        const registerBody = { username, email, password };
        const requestOptions = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(registerBody)
        };
    // await fetch(...)
        const response = await fetch(`${BASE_URL}/register`,requestOptions);
            if(response.status == 201){
                window.location.href ="../login/login-page.html";
            }else if(response.status == 409){
                alert(" User/Email already exists");
            }else{
                alert("Regestration failed")
            }
            
    } catch (error) {
        console.error(error);
        alert("Error! Try to Refresh")
    }
        
}
