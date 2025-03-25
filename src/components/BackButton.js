document.addEventListener("DOMContentLoaded", function () {
  const backButton = document.createElement("button");
  backButton.id = "backButton";
  backButton.innerHTML = "&#8592;"; // Unicode for back arrow (←)
  document.body.appendChild(backButton);

  // Hide the button initially
  backButton.style.display = "none";

  // Add click event to return to 360° photosphere mode
  backButton.addEventListener("click", function () {
    returnToPhotosphere();
  });
});

function returnToPhotosphere() {
  console.log("Returning to 360° photosphere mode");
  document.body.classList.remove("navigation-active");

  // Hide the back button and show the nav button
  document.getElementById("backButton").style.display = "none";
  document.getElementById("navButton").style.display = "block";

  // ADD YOUR CODE HERE TO RETURN TO 360° PHOTOSPHERE MODE
}

// Modify toggleNavigationMode to show/hide the back button correctly
function toggleNavigationMode() {
  navigationMode = !navigationMode;

  if (navigationMode) {
    console.log("Switching to Google Maps-style navigation mode");
    enableNavigation();

    // Show the back button and hide the nav button
    document.getElementById("backButton").style.display = "block";
    document.getElementById("navButton").style.display = "none";
  } else {
    returnToPhotosphere();
  }
}
