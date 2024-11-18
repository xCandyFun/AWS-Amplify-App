<script setup>
import { ref } from 'vue';
import { OutputFormat, PollyClient, SynthesizeSpeechCommand, VoiceId } from '@aws-sdk/client-polly';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

const textInput = ref('');
const regionAWS = 'eu-north-1';

const pollyClient = new PollyClient({
    region: regionAWS,
    credentials: fromCognitoIdentityPool({
        identityPoolId: import.meta.env.VITE_APP_USERPOOL_ID_Region,
        clientConfig: { region: regionAWS },
    }),
});

const speakText = async () =>{
    if(!textInput.value) return;

    const params = {
        Text: textInput.value,
        OutputFormat: 'mp3',
        VoiceId: 'Joanna',
    };

    try{
        const command = new SynthesizeSpeechCommand(params);
        const data = await pollyClient.send(command);

        console.log(data);

        if (data.AudioStream) {
            //const audioBlob = new Blob([data.AudioStream], { type: 'audio/mpeg' });
            const audioBlob = await streamToBlob(data.AudioStream);
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
        }else {
            console.error('No audio stream returned');
        }
    }catch (error) {
        console.error('Polly synthesis error:', error);
    }

    function streamToBlob(stream) {
    return new Promise((resolve, reject) => {
        const reader = stream.getReader();
        const chunks = [];
        
        reader.read().then(function process({ done, value }) {
            if (done) {
                resolve(new Blob(chunks));
                return;
            }
            chunks.push(value);
            reader.read().then(process).catch(reject);
        }).catch(reject);
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
