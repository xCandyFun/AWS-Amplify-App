<script setup lang="ts">
import { ref } from 'vue'; // the import is '$amplify/env/<function-name>'

// Reactive reference for user input and response message
const name = ref("");
const genre = ref("");
const price = ref("");
const responseMessage = ref<string | null>(null);  // Holds feedback for the user
const alertType = ref<'success' | 'error' | 'info' | null>(null); // For different types of alerts

// Step Function ARN (change it to match your actual ARN)
const stateMachineArn = import.meta.env.VITE_APP_STEP_FUNCTION_URL;

// Function to send POST request to API Gateway using Amplify's API
const sendPostRequest = async () => {
  if (!name.value) {
    responseMessage.value = "Please enter a name before submitting.";
    alertType.value = 'error';
    return;
  }

  try {
    const response = await fetch(import.meta.env.VITE_APP_URL_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: JSON.stringify({ name: name.value,  genre: genre.value, price: price.value}),  // input should be a stringified JSON object
        stateMachineArn: stateMachineArn,
      }) // Sending the JSON payload
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    //const data = await response.json();
    responseMessage.value = "Request was successful!"; // Display success message
    alertType.value = 'success';
    name.value = ""; // Clear the input field for the next entry
    genre.value = "";
    price.value = "";

  } catch (error) {
    console.error("Error in API request:", error);
    responseMessage.value = "Error in API request. Please try again."; // Error message
    alertType.value = 'error';
  }


   // Optional: Hide the alert after 3 seconds
    setTimeout(() => {
        alertType.value = null;
        responseMessage.value = null;
    }, 3000);
};
</script>

<template>
  <main>
    <p v-if="responseMessage" :class="['alert', alertType]">{{responseMessage }}</p> <!-- User feedback message -->
    <div class="container">
        <label for="name-input">Enter name:</label>
        <input
        id="name-input"
        type="text"
        v-model="name"
        placeholder="Type a name..."
        />
        <label for="genre-input">Enter genre:</label>
        <input
        id="genre-input"
        type="text"
        v-model="genre"
        placeholder="Type a genre..."
        />
        <label for="price-input">Enter price:</label>
        <input
        id="price-input"
        type="text"
        v-model="price"
        placeholder="Type a price..."
        />
        <button @click="sendPostRequest" :disabled="!name && !genre && !price">Send POST Request</button>
    </div>
  </main>
</template>

<style scoped>
/* Basic alert styling */
.alert {
  display: flex; /* Use flexbox */
  align-items: center; /* Vertically center the text */
  justify-content: center; /* Horizontally center the text */
  width: 25%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  font-weight: bold;
  text-align: center; /* Ensure the text is centered within the div */
}

.success {
  background-color: #4CAF50;
  color: white;
}

.error {
  background-color: #f44336;
  color: white;
}

.info {
  background-color: #2196F3;
  color: white;
}
</style>