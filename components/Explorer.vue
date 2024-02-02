<template>
  <div class="dog-explorer">
    <h1 class="dog-explorer__title">The Doggies Explorer</h1>
    <label for="tokenIndex" class="dog-explorer__label">Token ID:</label>
    <div class="dog-explorer__input-container">
      <input
        id="tokenIndex"
        type="number"
        v-model="tokenIndex"
        min="0"
        max="9999"
        placeholder="Enter token index"
        class="dog-explorer__input"
      />
      <button
        @click="getTokenURI"
        :disabled="isLoading"
        class="dog-explorer__button"
      >
        Get Token By ID
      </button>
    </div>
    <button
      @click="searchRandomToken"
      :disabled="isLoading"
      class="dog-explorer__button"
    >
      Search Random Token
    </button>

    <div v-if="isLoading" class="dog-explorer__loading">Loading...</div>

    <div v-if="tokenData" class="dog-explorer__token-info">
      <h2 class="dog-explorer__token-name">{{ tokenData.name }}</h2>
      <p class="dog-explorer__token-description">
        Description: {{ tokenData.description }}
      </p>
      <img
        :src="tokenData.thumbnail"
        alt="Token Thumbnail"
        class="dog-explorer__token-thumbnail"
      />

      <h3 class="dog-explorer__token-traits-title">Traits:</h3>
      <ul class="dog-explorer__token-traits-list">
        <li
          v-for="trait in tokenData.traits"
          :key="trait.trait_type"
          class="dog-explorer__token-trait"
        >
          <strong class="dog-explorer__token-trait-type"
            >{{ trait.trait_type }}:</strong
          >
          {{ trait.value }}
        </li>
      </ul>
    </div>

    <div v-if="error" class="dog-explorer__error">
      <p class="dog-explorer__error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import contract from "~/services/contractService";
import axios from "axios";
import { ref } from "vue";

const tokenIndex = ref(0);
const tokenData = ref(null);
const error = ref(null);
const isLoading = ref(false);

const getTokenURI = async () => {
  try {
    if (tokenIndex.value < 0 || tokenIndex.value > 9999) {
      error.value = "Please enter a number between 0 and 9999.";
      return;
    }

    isLoading.value = true;

    const result = await contract.methods.tokenURI(tokenIndex.value).call();
    await fetchTokenData(result);

    error.value = null;
  } catch (error) {
    console.error("Error calling tokenURI:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchTokenData = async (URI) => {
  try {
    const response = await axios.get(URI);
    tokenData.value = {
      name: response.data.name,
      description: response.data.description,
      thumbnail: response.data.image_url,
      traits: response.data.attributes,
    };
    error.value = null;
  } catch (error) {
    console.error("Error fetching new data:", error);
  }
};

const searchRandomToken = () => {
  const randomIndex = Math.floor(Math.random() * 10000);
  tokenIndex.value = randomIndex;
  getTokenURI();
};
</script>

<style scoped>
.dog-explorer {
  color: white;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #89cff3;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.dog-explorer__title {
  font-size: 24px;
  margin-bottom: 16px;
}

.dog-explorer__label {
  font-weight: bold;
  margin-bottom: 8px;
  display: block;
}

.dog-explorer__input {
  padding: 8px;
  margin-bottom: 16px;
  width: 70%;
}

.dog-explorer__input-container {
  display: flex;
  width: 100%;
}

.dog-explorer__button {
  padding: 10px;
  margin-bottom: 16px;
  background-color: #3498db;
  color: #fff;
  border: none;
  cursor: pointer;
  width: 100%;
  display: block;
}

.dog-explorer__loading {
  color: #3498db;
  margin-bottom: 16px;
}

.dog-explorer__token-info {
  margin-top: 16px;
  text-align: center;
}

.dog-explorer__token-name {
  font-size: 20px;
  margin-bottom: 8px;
}

.dog-explorer__token-thumbnail {
  max-width: 100%;
  height: auto;
  margin-bottom: 16px;
}

.dog-explorer__token-traits-title {
  font-size: 18px;
  margin-bottom: 8px;
}

.dog-explorer__token-traits-list {
  list-style-type: none;
  padding: 0;
}

.dog-explorer__token-trait {
  margin-bottom: 8px;
}

.dog-explorer__token-trait-type {
  margin-right: 8px;
  font-weight: bold;
}

.dog-explorer__error {
  color: red;
}
</style>
