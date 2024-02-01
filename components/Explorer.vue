<template>
    <div>
        <h1>The Doggies Explorer</h1>
        <label for="tokenIndex">Token Index:</label>
        <input id="tokenIndex" type="number" v-model="tokenIndex" min="0" max="9999" placeholder="Enter token index" />
        <button @click="getTokenURI">Get Token By Index</button>
        <div v-if="tokenURIData">
            <p>Token URI: {{ tokenURIData }}</p>
        </div>
        <div v-if="error">
            <p style="color: red;">{{ error }}</p>
        </div>
    </div>
</template>
  
<script setup>
import contract from '~/services/contractService';
import { ref } from 'vue';

const tokenIndex = ref(0);
const tokenURIData = ref(null);
const error = ref(null);

const getTokenURI = async () => {
    try {
        if (tokenIndex.value < 0 || tokenIndex.value > 9999) {
            error.value = 'Please enter a number between 0 and 9999.';
            return;
        }

        const result = await contract.methods.tokenURI(tokenIndex.value).call();
        tokenURIData.value = result;
        error.value = null;
    } catch (error) {
        console.error('Error calling tokenURI:', error);
    }
};
</script>