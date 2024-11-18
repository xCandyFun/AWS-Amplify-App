<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

interface DynamoDBItem {
  Id: string;
  Name: string;
  Genre: string;
  Price: string;
}

export default defineComponent({
  name: 'DynamoDBItems',
  setup() {
    // Define the items array as a reactive variable
    const items = ref<DynamoDBItem[]>([]);
    const displayedItems = ref<DynamoDBItem[]>([]);
    const page = ref(1); // Start with the first page
    const itemsPerPage = 5; // Number of items to display at a time
    // The function to fetch the items from your API
    const GetItems = async () => {
      try {
        // Replace with your API URL
        const response = await fetch( import.meta.env.VITE_APP_URL_API, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the response into JSON
        const data = await response.json();

        console.log('Fetched data:', data);

        const parsedData = JSON.parse(data.body);
        
        items.value = parsedData;

        displayedItems.value = items.value.slice(0, itemsPerPage);

      } catch (error) {
        console.error('GET call failed:', error); // Log the error
      }
    };

    const loadMoreItems = () => {
        page.value += 1;
        const startIndex = page.value * itemsPerPage - itemsPerPage;
        const newItems = items.value.slice(startIndex, startIndex + itemsPerPage);
        displayedItems.value = [...displayedItems.value, ...newItems];
    };

    // Call GetItems when the component is mounted
    onMounted(() => {
      GetItems();
    });

    // Return the items to make it available in the template
    return {
        displayedItems,
        items,
        loadMoreItems,
    };
  },
});
</script>

<template>
  <h1>All Available Games</h1>
    <div>
      <ul>
        <!-- Iterate over the items array and display each item's details -->
        <li v-for="item in displayedItems" :key="item.Id">
            {{ item.Name }} - {{ item.Genre }} - {{ item.Price }}kr
        </li>
        </ul>
        <button v-if="displayedItems.length < items.length" @click="loadMoreItems">Load More</button>
    </div>
</template>
<style scoped>
body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f9;
  margin: 0;
  padding: 0;
}

h1 {
    width: 25%;
    margin: 0 auto;
    text-align: center;
    
    margin-top: 2em;
    color: black;
    border:solid black;
    background-color: rgba(255, 255, 255, 0.2);
}

/* Container for the list */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin: 40px;
}

/* Game item card */
li {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  user-select: none;
}

li:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

/* Game name, genre, and price */
h2 {
  font-size: 1.5rem;
  margin: 10px 0;
  color: #333;
}

p {
  font-size: 1.2rem;
  margin: 5px 0;
  color: #666;
}

/* Price styling */
.price {
  font-size: 1.4rem;
  font-weight: bold;
  color: #28a745;
}

/* Load More Button */
button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background-color: #0056b3;
}

/* Loading & Empty Message */
.loading {
  text-align: center;
  font-size: 1.5rem;
  color: #007bff;
  margin-top: 50px;
}
</style>