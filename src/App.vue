<script setup lang="ts">
import { useRouter } from "vue-router";
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css"
import { signOut } from "aws-amplify/auth";

const router = useRouter();

const signOutHandler = async () => {
    await signOut();
    router.push('/');
  
}

</script>

<template>
  <main>
    <authenticator>
      <template v-slot="{ signOut }">
        <div>
    
          <h1 id="Title">Welcome To Game-shop</h1>
          <nav class="Navbar">
            <router-link to="/"><button>Home</button></router-link>
            <router-link to="/ShowGames"><button>Game List</button></router-link>
            <router-link to="/AddGame"><button>Add Game</button></router-link>
            <button @click="signOutHandler">Sign Out</button>
          </nav>

        </div>

        <router-view></router-view>

        <!-- <HomePageVue /> -->
        <!-- <Todos /> -->

      </template>
    </authenticator>
  </main>
</template>
<style lang="css" scoped>
body{
  position: relative;
  background-image: url('./assets/images/background-image.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  margin: 0;
}
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
</style>

