import { Keypair } from '@solana/web3.js';
import buy from './buy'
import fs from 'fs';
require('dotenv').config();

const runOne = async ()=> {
    const keypairFile = fs.readFileSync(process.env.ANCHOR_WALLET);
    const user: Keypair = Keypair.fromSecretKey(Buffer.from(JSON.parse(keypairFile.toString())));

    const currentTime = Math.floor(new Date().getTime() / 1000);
    const gameEnd = false
    
        buy.buy(user, 6, 1);
}

const runService = async (milleseconds) => {
    setInterval(runOne, milleseconds);
}

runService(6000);
runOne();
