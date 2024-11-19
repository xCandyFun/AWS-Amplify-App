<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import {
  OutputFormat,
  PollyClient,
  SynthesizeSpeechCommand,
  type SynthesizeSpeechCommandInput,
  DescribeVoicesCommand,
  type Voice,
} from '@aws-sdk/client-polly';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

// Define AWS region
const regionAWS = 'eu-north-1';

// Initialize the Polly client
const pollyClient = new PollyClient({
  region: regionAWS,
  credentials: fromCognitoIdentityPool({
    identityPoolId: import.meta.env.VITE_APP_USERPOOL_ID_Region as string,
    clientConfig: { region: regionAWS },
  }),
});

// State variables for user input
const textInput = ref<string>(''); // Text to synthesize
const selectedLanguage = ref<string>(''); // Selected language
const selectedVoice = ref<string>(''); // Selected voice

// Data for languages and voices
const voices = ref<Voice[]>([]); // All voices from Polly
const languages = computed(() =>
  [...new Set(voices.value.map((voice) => voice.LanguageName))]
); // Unique languages
const filteredVoices = computed(() =>
  voices.value.filter((voice) => voice.LanguageName === selectedLanguage.value)
); // Voices matching selected language

// Fetch Polly voices and populate data
const fetchVoices = async () => {
  try {
    const command = new DescribeVoicesCommand({});
    const data = await pollyClient.send(command);
    voices.value = data.Voices || [];
  } catch (error) {
    console.error('Error fetching voices:', error);
  }
};

// Function to play synthesized speech
const speakText = async (): Promise<void> => {
  if (!textInput.value || !selectedVoice.value) return;

  // Synthesize speech with selected voice
  const params: SynthesizeSpeechCommandInput = {
    Text: textInput.value,
    OutputFormat: 'mp3' as OutputFormat,
    VoiceId: selectedVoice.value as any, // Specify the selected voice
  };

  try {
    const command = new SynthesizeSpeechCommand(params);
    const data = await pollyClient.send(command);

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

  // Helper function to convert stream to Blob
  function streamToBlob(stream: any): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      const reader = stream.getReader();

      const processStream = ({ done, value }: { done: boolean; value: Uint8Array }) => {
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
};

// Fetch voices on component mount
fetchVoices();
</script>


<template>
  <div class="containerForLang">
    <label for="language">Select Language:</label>
    <select id="language" v-model="selectedLanguage">
      <option v-for="lang in languages" :key="lang" :value="lang">{{ lang }}</option>
    </select>
    <div class="voice">
      <label for="voice">Select Voice:</label>
      <select id="voice" v-model="selectedVoice" :disabled="!selectedLanguage">
        <option v-for="voice in filteredVoices" :key="voice.Id" :value="voice.Id">
          {{ voice.Name }} ({{ voice.Gender }})
        </option>
      </select>
    </div>

  </div>
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
.containerForLang {
    display: flex;
    justify-content: center; 
    align-items: center; 
    border: solid black;
    border-top: none;
    background-color: rgba(255, 255, 255, 0.3);
    margin-left: 40em;
    margin-right: 40em;
}
.voice{
  padding-left: 1em;
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
