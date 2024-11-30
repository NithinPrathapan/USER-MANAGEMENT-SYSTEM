async function handleSignup(e) {
  e.preventDefault();
  console.log("handle submit function");
  const form = document.getElementById("signupForm");

  const formData = new FormData(form);
  const signupData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  console.log(signupData);
  try {
    const response = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Success response:", result);

    } else {
      console.error("Error response:", response.statusText);
      const errorData = await response.json();
      console.error("Error details:", errorData.message);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}
