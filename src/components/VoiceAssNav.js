document.addEventListener("DOMContentLoaded", function () {
  const voiceButton = document.createElement("button");
  voiceButton.id = "voiceButton";
  voiceButton.innerHTML = "🎤"; // Microphone icon
  document.body.appendChild(voiceButton);

  // Add click event to activate voice assistant
  voiceButton.addEventListener("click", function () {
    startVoiceAssistant();
  });
});

// Function to start the voice assistant
function startVoiceAssistant() {
  console.log("Voice Assistant Activated");

  // Check if Speech Recognition is supported
  if (!("webkitSpeechRecognition" in window)) {
    alert("Voice recognition is not supported in this browser.");
    return;
  }

  const recognition = new webkitSpeechRecognition(); // For Chrome-based browsers
  recognition.continuous = false;
  recognition.lang = "en-US"; // Change language if needed

  recognition.onstart = function () {
    console.log("Listening...");
  };

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    console.log("Recognized: ", transcript);

    // ADD CUSTOM COMMANDS HERE
    handleVoiceCommand(transcript);
  };

  recognition.onerror = function (event) {
    console.error("Speech recognition error:", event);
  };

  recognition.start();
}

// Function to handle voice commands
function handleVoiceCommand(command) {
  command = command.toLowerCase();

  if (command.includes("switch to navigation")) {
    toggleNavigationMode(); // Call your function to enable navigation
  } else if (command.includes("back to photosphere")) {
    returnToPhotosphere(); // Call your function to return to 360° mode
  } else {
    console.log("Command not recognized:", command);
  }
}
