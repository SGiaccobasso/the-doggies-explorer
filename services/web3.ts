
import Web3 from 'web3';

let web3: Web3;

if (process.client && typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccounts(accounts);
        } catch (error) {
            if (error.code === 4001) {
                console.error('User rejected request')
            }
        }
    }
} else {
    web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/c8b2c897a5dd47849a5924f20707ed44'));
}

export default web3;