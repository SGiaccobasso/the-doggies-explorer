<template>
    <div>
      <h1>The Doggies Explorer</h1>
      <label for="tokenIndex">Token ID:</label>
      <input
        id="tokenIndex"
        type="number"
        v-model="tokenIndex"
        min="0"
        max="9999"
        placeholder="Enter token index"
      />
      <button @click="getTokenURI" :disabled="isLoading">Get Token By ID</button>
  
      <button @click="searchRandomToken" :disabled="isLoading">Search Random Token</button>
  
      <div v-if="isLoading">Loading...</div>
  
      <div v-if="tokenData">
        <h2>{{ tokenData.name }}</h2>
        <p>Owner: {{ tokenData.owner }}</p>
        <p>Description: {{ tokenData.description }}</p>
        <img :src="tokenData.thumbnail" alt="Token Thumbnail" />
  
        <h3>Traits:</h3>
        <ul>
          <li v-for="trait in tokenData.traits" :key="trait.trait_type">
            <strong>{{ trait.trait_type }}:</strong> {{ trait.value }}
          </li>
        </ul>
      </div>
  
      <div v-if="error">
        <p style="color: red;">{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import contract from '~/services/contractService';
  import axios from 'axios';
  import { ref } from 'vue';
  
  const tokenIndex = ref(0);
  const tokenData = ref(null);
  const error = ref(null);
  const isLoading = ref(false);
  
  const getTokenURI = async () => {
    try {
      if (tokenIndex.value < 0 || tokenIndex.value > 9999) {
        error.value = 'Please enter a number between 0 and 9999.';
        return;
      }
  
      isLoading.value = true;
  
      const result = await contract.methods.tokenURI(tokenIndex.value).call();
      await fetchTokenData(result);
  
      error.value = null;
    } catch (error) {
      console.error('Error calling tokenURI:', error);
    } finally {
      isLoading.value = false;
    }
  };
  
  const fetchTokenData = async (URI) => {
    try {
      const response = await axios.get(URI);
      tokenData.value = {
        name: response.data.name,
        owner: response.data.owner,
        description: response.data.description,
        thumbnail: response.data.image_url,
        traits: response.data.attributes,
      };
      error.value = null;
    } catch (error) {
      console.error('Error fetching new data:', error);
    }
  };
  
  const searchRandomToken = () => {
    const randomIndex = Math.floor(Math.random() * 10000);
    tokenIndex.value = randomIndex;
    getTokenURI();
  };
  </script>
  