<script setup lang="ts">
import { ref } from 'vue';
import { OutputFormat, PollyClient, SynthesizeSpeechCommand, VoiceId, type SynthesizeSpeechCommandInput } from '@aws-sdk/client-polly';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

// Define the text input as a ref of string type
const textInput = ref<string>('');

// Define AWS region
const regionAWS = 'eu-north-1';

// Create the PollyClient with the appropriate type
const pollyClient = new PollyClient({
  region: regionAWS,
  credentials: fromCognitoIdentityPool({
    identityPoolId: import.meta.env.VITE_APP_USERPOOL_ID_Region as string, // Ensure the environment variable is treated as a string
    clientConfig: { region: regionAWS },
  }),
});

// Define the function for speaking text, ensuring proper type for the params object
const speakText = async (): Promise<void> => {
  if (!textInput.value) return;

  // Define params with the correct types
  const params: SynthesizeSpeechCommandInput = {
    Text: textInput.value,
    OutputFormat: 'mp3' as OutputFormat, // Specify that OutputFormat is 'mp3'
    VoiceId: 'Joanna' as VoiceId, // Specify the voice ID
  };

  try {
    const command = new SynthesizeSpeechCommand(params);
    const data = await pollyClient.send(command);

    console.log(data);

    if (data.AudioStream) {
      // Convert the AudioStream to a Blob
      const audioBlob = await streamToBlob(data.AudioStream);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } else {
      console.error('No audio stream returned');
    }
  } catch (error) {
    console.error('Polly synthesis error:', error);
  }

  // Helper function to convert the stream to a Blob
  function streamToBlob(stream: any): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];

      // Convert the AWS SDK stream to a standard ReadableStream
      const reader = stream.getReader();

      const processStream = ({ done, value }: { done: boolean, value: Uint8Array }) => {
        if (done) {
          resolve(new Blob(chunks));
          return;
        }
        chunks.push(value);
        reader.read().then(processStream).catch(reject);
      };

      reader.read().then(processStream).catch(reject);
    });
  }
}
</script>
<template>
    <div class="container">
        <textarea v-model="textInput" placeholder="Enter text to speak" class="TextArea"></textarea>
        
    </div>
    <button @click="speakText" class="SpeakButton">Speak</button>
</template>
<style scoped>
.container {
    display: flex;
    justify-content: center; 
    align-items: center; 
}
.TextArea{
    width: 20%;
    margin-top: 2em;
    padding-bottom: 4em;
}

button {
    display: flex;
    margin: 0.2em auto;
    padding: 0.3em 0.6em;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 0.3em;
    cursor: pointer;
    font-size: 1rem;
}

button:hover { 
  background-color: #0056b3;
}
</style>
