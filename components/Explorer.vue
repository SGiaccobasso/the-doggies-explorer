<template>
  <div class="dog-explorer">
    <Typography variant="h1"> The Doggies Explorer </Typography>
    <div class="dog-explorer__input-container">
      <input
        id="tokenIndex"
        type="number"
        v-model="tokenIndex"
        min="0"
        max="9999"
        class="dog-explorer__input"
      />
      <Button @click="getTokenURI" :disabled="isLoading"> Search By ID </Button>
      <Button @click="searchRandomToken" :disabled="isLoading">
        Random Search
      </Button>
    </div>

    <div v-if="error && !isLoading" class="dog-explorer__error">
      <Typography variant="error">
        {{ error }}
      </Typography>
    </div>

    <div v-if="isLoading" class="dog-explorer__loading">
      <Typography variant="p">Loading...</Typography>
    </div>

    <div v-if="!tokenData" class="dog-explorer__home">
      <img
        class="dog-explorer__gif"
        src="https://i.seadn.io/gae/ufumJQN9NwT0U5jh_suJP5cLRIjyE38hirVdBChQLe-ghnt1RomIARfxSNmR6fdMQC0OIgjVQHhhduUfcxiRVrfHpihrXSW-SU5J?auto=format&dpr=1&w=256"
      />
      <Typography variant="h2">
        🐶 The Doggies - Snoop Dogg Avatars 🐶
      </Typography>
      <Typography variant="p">
        10,000 metaverse-ready Avatars, playable in The Sandbox. Each Doggy has
        been generated from over 150+ traits, curated by Snoop Dogg himself.
        Owning a Doggy provides access to a playable The Sandbox avatar, as well
        as access to future features inside the metaverse.
      </Typography>
    </div>

    <div v-if="tokenData" class="dog-explorer__token-info">
      <Typography variant="h2">
        {{ tokenData.name }}
      </Typography>
      <img
        :src="tokenData.thumbnail"
        alt="Token Thumbnail"
        class="dog-explorer__token-thumbnail"
      />
      <Description :paragraph="tokenData.description" />
      <table class="dog-explorer__token-traits-table">
        <thead>
          <tr>
            <th class="dog-explorer__token-trait-type-header">
              <Typography variant="strong">Trait</Typography>
            </th>
            <th class="dog-explorer__token-trait-value-header">
              <Typography variant="strong">Value</Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="trait in tokenData.traits"
            :key="trait.trait_type"
            class="dog-explorer__token-trait"
          >
            <td class="dog-explorer__token-trait-type">
              <Typography variant="strong">{{ trait.trait_type }}</Typography>
            </td>
            <td class="dog-explorer__token-trait-value">
              <Typography variant="p">
                {{ trait.value ? trait.value : "-" }}
              </Typography>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";

import contract from "~/services/contractService";
import Typography from "~/components/common/Typography.vue";
import Description from "./Description.vue";
import Button from "./common/Button.vue";
import type { TokenData } from "~/typings/types.ts";

const tokenIndex = ref<number>(0);
const tokenData = ref<TokenData | null>(null);
const error = ref<string | null>(null);
const isLoading = ref<boolean>(false);

const getTokenURI = async () => {
  try {
    if (tokenIndex.value < 0 || tokenIndex.value > 9999) {
      error.value = " ⚠️ Please enter a number between 0 and 9999.";
      return;
    }

    isLoading.value = true;

    const result: string = await contract.methods
      .tokenURI(tokenIndex.value)
      .call();
    await fetchTokenData(result);

    error.value = null;
  } catch (error) {
    console.error("Error calling tokenURI:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchTokenData = async (URI: string) => {
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
  font-family: Inter;
  color: white;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #273549;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 6px;
}

.dog-explorer__input {
  border-radius: 6px;
  padding: 8px;
  width: 50%;
}

.dog-explorer__input-container {
  display: flex;
  width: 100%;
  gap: 8px;
}

.dog-explorer__token-info {
  margin-top: 16px;
  text-align: left;
}

.dog-explorer__home {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dog-explorer__gif {
  border-radius: 8px;
  max-width: 100%;
  height: auto;
}

.dog-explorer__token-thumbnail {
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
}

.dog-explorer__token-traits-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 32px;
}

.dog-explorer__loading {
  margin-top: 16px;
}

.dog-explorer__token-traits-table th,
.dog-explorer__token-traits-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #3282b8;
}

.dog-explorer__token-traits-table th {
  background-color: #3282b8;
  color: #fff;
}

.dog-explorer__token-trait-value {
  padding: 12px;
}

.dog-explorer__token-traits-table tbody tr:last-child td {
  border-bottom: none;
}
</style>
