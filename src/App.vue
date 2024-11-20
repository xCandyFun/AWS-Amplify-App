<script setup lang="ts">
import { useRouter } from "vue-router";
import { signOut } from "aws-amplify/auth";

const router = useRouter();

const signOutHandler = async () => {
    await signOut();
    router.push('/AddGame');
  
}

</script>
<template>
<main>
  <div>
    <h1 id="Title">Welcome To Game-shop</h1>
    <nav class="Navbar">
      <router-link to="/"><button class="NavButton">Home</button></router-link>
      <router-link to="/ShowGames"><button class="NavButton">Game List</button></router-link>
      <router-link to="/AddGame"><button class="NavButton">Add Game</button></router-link>
      <router-link to="/"><button class="NavButton">About</button></router-link>
      <button @click="signOutHandler" id="SignOutButton">Logout</button>
    </nav>
  </div>
  <router-view></router-view>
</main>
</template>
<style scoped>
h1#Title{
    width: 25%;
    margin: 0 auto;
    text-align: center;
    border:solid black;
    background-color: rgba(255, 255, 255, 0.2);
    border-bottom: none;
    margin-top: 1em;
}
.Navbar{
    border: solid black;
    background-color: rgba(255, 255, 255, 0.3);
}
button#SignOutButton{
  float: right;
  margin-right: 0.5em;
}
.NavButton{
  margin-left: 2em;
}

button {
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

