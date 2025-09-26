// --- Initialize Supabase Client ---
const SUPABASE_URL = "https://hrlqhglfzgnoqpaueacb.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhybHFoZ2xmemdub3FwYXVlYWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MjEzOTMsImV4cCI6MjA3NDM5NzM5M30.q_ukDX8J-cAZoCZhGnLMas8_eZmsXtFN0STRoEyxGsA";

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Sign Up Logic ---
const signupForm = document.querySelector("#signup-form");

if (signupForm) {
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get all form field values
    const firstName = document.querySelector("#first-name").value;
    const lastName = document.querySelector("#last-name").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const phoneNumber = document.querySelector("#phone-number").value;
    const age = document.querySelector("#age").value;
    const pinCode = document.querySelector("#pin-code").value;

    // STEP 1: Sign up the user in Supabase Auth
    const { data: authData, error: authError } = await db.auth.signUp({
      email: email,
      password: password,
    });

    if (authError) {
      alert("Error signing up: " + authError.message);
      return; // Stop the function if auth fails
    }

    // Check if user was created successfully
    if (authData.user) {
      // STEP 2: Insert the profile into the 'donor_Profiles' table
      const { error: profileError } = await db.from("donor_Profiles").insert({
        id: authData.user.id, // This links the profile to the auth user
        first_name: firstName,
        last_name: lastName,
        age: age,
        phone_number: phoneNumber,
        pin_code: pinCode,
      });

      if (profileError) {
        alert("Error creating profile: " + profileError.message);
      } else {
        alert("Sign up successful! Redirecting to the dashboard...");
        // --- THIS IS THE UPDATED REDIRECT LINE ---
        window.location.href = "DashboardM.html";
      }
    }
  });
}

// --- Login Logic ---
const loginForm = document.querySelector("#login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    const { data, error } = await db.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert("Error logging in: " + error.message);
    } else {
      // Successful login also redirects to the dashboard
      window.location.href = "DashboardM.html";
    }
  });
}
