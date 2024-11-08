<script setup lang="ts">
import { ref } from 'vue'; // the import is '$amplify/env/<function-name>'

// Reactive reference for user input and response message
const name = ref("");
const responseMessage = ref(""); // Holds feedback for the user

// Step Function ARN (change it to match your actual ARN)
const stateMachineArn = process.env.VUE_APP_STEP_FUNCTION_URL;

// Function to send POST request to API Gateway using Amplify's API
const sendPostRequest = async () => {
  console.log("Name value being sent:", name.value); // Debug: log name value
  if (!name.value) {
    responseMessage.value = "Please enter a name before submitting.";
    return;
  }

  try {
    const response = await fetch("https://k96vgg4sf8.execute-api.eu-north-1.amazonaws.com/dev/execution", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: JSON.stringify({ name: name.value }),  // input should be a stringified JSON object
        stateMachineArn: stateMachineArn,
      }) // Sending the JSON payload
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Response from API:", data);
    responseMessage.value = "Request was successful!"; // Display success message
    name.value = ""; // Clear the input field for the next entry

  } catch (error) {
    console.error("Error in API request:", error);
    responseMessage.value = "Error in API request. Please try again."; // Error message
  }
};
</script>

<template>
  <main>
    <label for="name-input">Enter name:</label>
    <input
      id="name-input"
      type="text"
      v-model="name"
      placeholder="Type a name..."
    />
    <button @click="sendPostRequest" :disabled="!name">Send POST Request</button>
    <p v-if="responseMessage">{{ responseMessage }}</p> <!-- User feedback message -->
  </main>
</template>