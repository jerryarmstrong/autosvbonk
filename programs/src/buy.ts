import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Keypair, clusterApiUrl, Connection, SystemProgram, TransactionSignature, sendAndConfirmTransaction, VersionedTransaction, TransactionMessage } from '@solana/web3.js'
import { Account, TOKEN_PROGRAM_ID, createApproveInstruction, createAssociatedTokenAccount, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
require('dotenv').config();
import fs from 'fs';

import {
    ThreadProgram as ThreadProgramType,
    IDL as ThreadProgramIdl_v1_3_15, 
  } from './thread_program';
import { connect } from "http2";
anchor.setProvider(anchor.AnchorProvider.env());

export const IDL = {
  "version": "1.0.1",
  "name": "bot",
  "instructions": [
    {
      "name": "buy",
      "accounts": [
        {
          "name": "dev",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameUser",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contractTokenAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "buyerTokenAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "instructionSysvarAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "raffle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whirlpoolProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "threadProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "gameIndex",
          "type": "u32"
        },
        {
          "name": "qty",
          "type": "u32"
        },
        {
          "name": "version",
          "type": "u8"
        },
        {
          "name": "seconds",
          "type": "u8"
        }
      ],
      "returns": {
        "defined": "ThreadResponse"
      }
    }
  ],
  "accounts": [
    {
      "name": "Authority",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
}
const programId = new anchor.web3.PublicKey('JqVpRRhEPXpc9zDZWNWKpsBHAESEft7ogXGjH7MV4bS');
let connection = new Connection("https://rpc.helius.xyz/?api-key=ff85b650-739a-416c-b02e-002cda578d43")
const token = new PublicKey('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'); 

const CONTRACT_SEED = 'contract';
const GAME_USER_SEED = 'gameuser';
const VERSION = 1;
const versionSeed = new anchor.BN(VERSION).toBuffer('le', 1);


const buy = async (user: Keypair, gameIndex: number, qty: number) => {
  let proivder =new anchor.AnchorProvider(connection, new anchor.Wallet(user), {})
  const program2 = new anchor.Program({"version":"0.2.0","name":"fomo","instructions":[{"name":"initializeContract","accounts":[{"name":"contract","isMut":true,"isSigner":false},{"name":"authority","isMut":true,"isSigner":true},{"name":"systemProgram","isMut":false,"isSigner":false}],"args":[{"name":"version","type":"u8"}]},{"name":"updateContract","accounts":[{"name":"authority","isMut":true,"isSigner":true},{"name":"contract","isMut":true,"isSigner":false},{"name":"systemProgram","isMut":false,"isSigner":false}],"args":[{"name":"autoStartNextGame","type":"bool"}]},{"name":"updateGame","accounts":[{"name":"authority","isMut":true,"isSigner":true},{"name":"contract","isMut":true,"isSigner":false},{"name":"systemProgram","isMut":false,"isSigner":false}],"args":[{"name":"gameIndex","type":"u32"},{"name":"blocktimeEnd","type":"i64"}]},{"name":"buy","accounts":[{"name":"authority","isMut":true,"isSigner":true},{"name":"contract","isMut":true,"isSigner":false},{"name":"gameUser","isMut":true,"isSigner":false},{"name":"contractTokenAccount","isMut":true,"isSigner":false},{"name":"buyerTokenAccount","isMut":true,"isSigner":false},{"name":"instructionSysvarAccount","isMut":false,"isSigner":false},{"name":"raffle","isMut":true,"isSigner":false},{"name":"tokenProgram","isMut":false,"isSigner":false},{"name":"systemProgram","isMut":false,"isSigner":false}],"args":[{"name":"gameIndex","type":"u32"},{"name":"qty","type":"u32"}]},{"name":"claim","accounts":[{"name":"authority","isMut":true,"isSigner":true},{"name":"contract","isMut":true,"isSigner":false},{"name":"gameUser","isMut":true,"isSigner":false},{"name":"contractTokenAccount","isMut":true,"isSigner":false},{"name":"claimTokenAccount","isMut":true,"isSigner":false},{"name":"tokenProgram","isMut":false,"isSigner":false},{"name":"systemProgram","isMut":false,"isSigner":false}],"args":[{"name":"gameIndex","type":"u32"}]},{"name":"initializeRaffle","accounts":[{"name":"authority","isMut":true,"isSigner":true},{"name":"raffle","isMut":true,"isSigner":false},{"name":"contract","isMut":true,"isSigner":false},{"name":"systemProgram","isMut":false,"isSigner":false}],"args":[{"name":"gameIndex","type":"u32"},{"name":"participantsSize","type":"u32"},{"name":"winnersSize","type":"u32"}]},{"name":"addRaffle","accounts":[{"name":"authority","isMut":true,"isSigner":true},{"name":"raffle","isMut":true,"isSigner":false},{"name":"contract","isMut":true,"isSigner":false},{"name":"systemProgram","isMut":false,"isSigner":false}],"args":[{"name":"gameIndex","type":"u32"},{"name":"user","type":"publicKey"},{"name":"qty","type":"u32"}]},{"name":"updateRaffle","accounts":[{"name":"authority","isMut":true,"isSigner":true},{"name":"raffle","isMut":true,"isSigner":false},{"name":"contract","isMut":true,"isSigner":false},{"name":"systemProgram","isMut":false,"isSigner":false}],"args":[{"name":"gameIndex","type":"u32"},{"name":"active","type":"bool"}]},{"name":"pickRaffleWinner","accounts":[{"name":"authority","isMut":true,"isSigner":true},{"name":"raffle","isMut":true,"isSigner":false},{"name":"contract","isMut":true,"isSigner":false},{"name":"systemProgram","isMut":false,"isSigner":false}],"args":[{"name":"gameIndex","type":"u32"},{"name":"limit","type":"u16"}]},{"name":"sendToRaffleWinner","accounts":[{"name":"authority","isMut":true,"isSigner":true},{"name":"raffle","isMut":true,"isSigner":false},{"name":"contract","isMut":true,"isSigner":false},{"name":"contractTokenAccount","isMut":true,"isSigner":false},{"name":"winnerTokenAccount","isMut":true,"isSigner":false},{"name":"tokenProgram","isMut":false,"isSigner":false},{"name":"systemProgram","isMut":false,"isSigner":false}],"args":[{"name":"gameIndex","type":"u32"}]}],"accounts":[{"name":"Contract","type":{"kind":"struct","fields":[{"name":"activeGameIndex","type":"u32"},{"name":"bump","type":"u8"},{"name":"games","type":{"vec":{"defined":"Game"}}},{"name":"version","type":"u8"},{"name":"autoStartNextGame","type":"bool"}]}},{"name":"GameUser","type":{"kind":"struct","fields":[{"name":"gameIndex","type":"u32"},{"name":"qty","type":"u32"},{"name":"claimedAmount","type":"u64"},{"name":"authority","type":"publicKey"},{"name":"bump","type":"u8"},{"name":"version","type":"u8"}]}},{"name":"RaflStak","type":{"kind":"struct","fields":[{"name":"active","type":"bool"},{"name":"participantsSize","type":"u16"},{"name":"winnersSize","type":"u16"},{"name":"bump","type":"u8"},{"name":"gameIndex","type":"u32"},{"name":"version","type":"u8"},{"name":"authority","type":"publicKey"},{"name":"winnerTotal","type":"u64"},{"name":"participants","type":{"vec":{"defined":"RaffleParticipant"}}},{"name":"winners","type":{"vec":{"defined":"RaffleWinner"}}}]}}],"types":[{"name":"Game","type":{"kind":"struct","fields":[{"name":"winner","type":"publicKey"},{"name":"keysPurchased","type":"u32"},{"name":"revShareTotal","type":"u64"},{"name":"winnerTotal","type":"u64"},{"name":"blocktimeStart","type":"i64"},{"name":"blocktimeEnd","type":"i64"}]}},{"name":"RaffleParticipant","type":{"kind":"struct","fields":[{"name":"user","type":"publicKey"},{"name":"qty","type":"u32"},{"name":"lastBlocktime","type":"u32"}]}},{"name":"RaffleWinner","type":{"kind":"struct","fields":[{"name":"user","type":"publicKey"},{"name":"qty","type":"u32"},{"name":"claimedAmount","type":"u64"}]}}],"errors":[{"code":6000,"name":"RaffleIsActive","msg":"Raffle is active"},{"code":6001,"name":"RaffleNotActive","msg":"Raffle is not active"},{"code":6002,"name":"CodeIsTooLong","msg":"Code is too long"},{"code":6003,"name":"InvalidQty","msg":"Invalid qty"},{"code":6004,"name":"WinnersAreAlreadyPicked","msg":"Winners are already picked"},{"code":6003,"name":"AlreadyWon","msg":"Already won"},{"code":6006,"name":"NoCandidates","msg":"No candidates"},{"code":6007,"name":"LimitIsGreaterThanCandidates","msg":"Limit is greater than candidates"},{"code":6008,"name":"GameNotActive","msg":"Game is not active"},{"code":6009,"name":"InvalidGameIndex","msg":"Invalid game index"},{"code":6010,"name":"GameIsNotClaimable","msg":"Game is not claimable"},{"code":6011,"name":"GameNotStarted","msg":"Game has not started"},{"code":6012,"name":"GameNotEnded","msg":"Game not ended"},{"code":6013,"name":"NoKeysPurchased","msg":"No keys purchased"},{"code":6014,"name":"NoClaimableAmount","msg":"No claimable amount"},{"code":6013,"name":"NotWinner","msg":"Sorry, You are not the winner"},{"code":6016,"name":"GameIndexLessThanZero","msg":"Game index less than zero"},{"code":6017,"name":"InvalidRoyaltyAddy","msg":"Invalid royalty addy"},{"code":6018,"name":"InvalidRoyaltyLen","msg":"Invalid royalty length"},{"code":6019,"name":"NegativeClaimableAmount","msg":"Negative claimable amount"},{"code":6020,"name":"GameAutoStartOff","msg":"Game Auto Start is off"},{"code":6021,"name":"GameEnded","msg":"Game Ended"},{"code":6022,"name":"CpiForbidden","msg":"CPI is forbidden"},{"code":6023,"name":"MemoNotFound","msg":"Memo instruction not found"},{"code":6024,"name":"MemoIncorrect","msg":"Memo not correct"},{"code":6023,"name":"LastInstructionShouldBeMemo","msg":"Last instruction should be memo"},{"code":6026,"name":"TooManyInstructions","msg":"Too many instructions"},{"code":6027,"name":"NotEnoughKeys","msg":"Not enough keys"},{"code":6028,"name":"NotValidWinner","msg":"Not valid winner"}],"metadata":{"address":"SVBzw5fZRY9iNRwy5JczFYni2X9aDqur6HhAP1CXX7T"}} as anchor.Idl, new PublicKey("SVBzw5fZRY9iNRwy5JczFYni2X9aDqur6HhAP1CXX7T"), new anchor.AnchorProvider(connection, new anchor.Wallet(user), {}))
  const program = new anchor.Program(IDL as anchor.Idl, new PublicKey("JqVpRRhEPXpc9zDZWNWKpsBHAESEft7ogXGjH7MV4bS"),proivder)
const findPdaAddressByStringSeeds = (seeds:string[], version: Buffer) => {
  const seedBuffers = seeds.map((seedString) => {
      return Buffer.from(anchor.utils.bytes.utf8.encode(seedString));
  });
  seedBuffers.push(version);
  const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(seedBuffers, new anchor.web3.PublicKey(programId.toString()));
  const pdaAddress = new anchor.web3.PublicKey(pda);
  return pdaAddress;
}

const findGameUserPdaAddress = (stringSeed, gameIndex: number, user: PublicKey) => {
  const gameUserSeed = Buffer.from(anchor.utils.bytes.utf8.encode(stringSeed));
  const gameIndexSeed = new anchor.BN(gameIndex).toBuffer('le', 4); /// tobuffer isn't a function
  const userSeed = user.toBuffer();
  const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [gameUserSeed, gameIndexSeed, userSeed, versionSeed], 
      new anchor.web3.PublicKey((new PublicKey("SVBzw5fZRY9iNRwy5JczFYni2X9aDqur6HhAP1CXX7T")).toString()));
  console.log(`Bump: `, bump);
  console.log(`PDA: `, pda.toString());
  return pda;
}

    const contractPdaAddress = findPdaAddressByStringSeeds([CONTRACT_SEED], versionSeed);
    const gameUserPdaAddress = findGameUserPdaAddress(GAME_USER_SEED, gameIndex, user.publicKey);
    const contractTokenAccount = findGameUserPdaAddress(GAME_USER_SEED,gameIndex, user.publicKey)
    let fata2
    const SEED_QUEUE = 'thread';
    const CLOCKWORK_THREAD_PROGRAM_ID = new PublicKey(
        '3XXuUFfweXBwFgFfYaejLvZE4cGZiHgKiGfMtdxNzYmv',
      );
    var threadName = (Math.floor(Math.random()*9999999)).toString()
    var [hydra, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from(SEED_QUEUE, 'utf-8'), user.publicKey.toBuffer(), Buffer.from(threadName, 'utf-8')],
      CLOCKWORK_THREAD_PROGRAM_ID,
    );
    let signature: TransactionSignature = '';
    try {
      const ix = await program.methods
      .buy(6,1, VERSION, 5)
      .accounts(
          {
            dev: new PublicKey("Gf3sbc5Jb62jH7WcTr3WSNGDQLk1w6wcKMZXKK1SC1E6"),
              authority: hydra,
              user: user.publicKey,
              contract: contractPdaAddress,
              gameUser: gameUserPdaAddress,
              contractTokenAccount: contractTokenAccount,
              buyerTokenAccount: new PublicKey("3a6vmVLpwXueJn68LWxtjbwhGaEWGJm4h34KgzXUmyyR"),
              tokenProgram: TOKEN_PROGRAM_ID,
              systemProgram: SystemProgram.programId,
              instructionSysvarAccount: new PublicKey("Sysvar1nstructions1111111111111111111111111"),
              raffle: new PublicKey("7hNd2ywLecRyTxBg58JQCnjL6aDQZQ7BH9J9PDv3WGdH"),
              whirlpoolProgram: new PublicKey("SVBzw5fZRY9iNRwy5JczFYni2X9aDqur6HhAP1CXX7T"),
              threadProgram: CLOCKWORK_THREAD_PROGRAM_ID
          })
      .remainingAccounts([
        { pubkey: new PublicKey('68Cj4MgS3KgRMwfKPbrPVekBNijNNg27Pu8F3bCRG2rX'), isWritable: true, isSigner: false },
      { pubkey: new PublicKey('F8FqZuUKfoy58aHLW6bfeEhfW9sTtJyqFTqnxVmGZ6dU'), isWritable: true, isSigner: false },
      { pubkey: new PublicKey('76JQzVkqHsWWXA3z4WvzzwnxVD4M1tFmFfp4NhnfcrUH'), isWritable: true, isSigner: false },
      { pubkey: new PublicKey('9dKYKpinYRdC21CYqAW2mwEpZuPwBN6wkoswsvpHXioA'), isWritable: true, isSigner: false },
      { pubkey: new PublicKey('9dKYKpinYRdC21CYqAW2mwEpZuPwBN6wkoswsvpHXioA'), isWritable: true, isSigner: false },
      { pubkey: new PublicKey('9dKYKpinYRdC21CYqAW2mwEpZuPwBN6wkoswsvpHXioA'), isWritable: true, isSigner: false },
      { pubkey: new PublicKey('86C3VW44St7Nrgd3vAkwJaQuFZWYWmKCr97sJHrHfEm5'), isWritable: true, isSigner: false },
      { pubkey: new PublicKey('DveZWxw2nBDSNdqPmUmZMaxniqobWkTZdBBjvQaE2Bjx'), isWritable: true, isSigner: false },
      { pubkey: new PublicKey('EefQxy3SUAHWN7bURnMZzXXyp3BNaD73QmaMn7Do1sAc'), isWritable: true, isSigner: false },
      { pubkey: new PublicKey('FrPSjSDWsRth6euNiaGAkzv6cYHgQysbWS9xMgkQcHXk'), isWritable: true, isSigner: false },
      ])
      .instruction();
     
      
      let tokens = (await connection.getParsedTokenAccountsByOwner(user.publicKey, { mint: new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263") })).value
      let m = 0
      let fata
      for (var token2 of tokens){
        console.log(token2)
        if (parseInt(token2.account.data.parsed.info.tokenAmount.amount) > m && token2.account.data.parsed.info.mint == token.toString()){
            console.log(token2.account.data.parsed.info.mint == token.toString())
            m = parseInt(token2.account.data.parsed.info.tokenAmount.amount)
            fata = token2.pubkey
        }
      }
      var trigger = {
        cron:
        {
          schedule: "1 * * * * *",
          skippable: true
        }
        };
        const threadProgram = await new anchor.Program(
          IDL as anchor.Idl,
          CLOCKWORK_THREAD_PROGRAM_ID,
          )
        var instructions = [
          SystemProgram.transfer({
              fromPubkey: user.publicKey,
              toPubkey: hydra,
              lamports: 0.0138 * 10 ** 9,
              }),
          createApproveInstruction(
            new PublicKey("3a6vmVLpwXueJn68LWxtjbwhGaEWGJm4h34KgzXUmyyR"),
          hydra, 
          user.publicKey,
          m
        ),
        
        await threadProgram.methods
        .threadCreate(
          // @ts-ignore
          threadName,
          {
            accounts: ix.keys,
            programId: new PublicKey(ix.programId),
            data: ix.data,
          },
           trigger
        )
        .accounts({
          authority: user.publicKey,
          payer: user.publicKey,
          thread: hydra,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .instruction(),]
let latestBlockhash = (await connection.getLatestBlockhash())
  // Get the lates block hash to use on our transaction and confirmation
  // Create a new TransactionMessage with version and compile it to legacy
let messageLegacy    = new TransactionMessage({
      payerKey: user.publicKey,
      recentBlockhash: latestBlockhash.blockhash,
      instructions,
  }).compileToV0Message()
  // Create a new VersionedTransacction which supports legacy and v0
  const transation = new VersionedTransaction(messageLegacy)

  // Send transaction and await for signature
  signature = await proivder.sendAndConfirm(transation)

  // Send transaction and await for signature
  await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');

  console.log(signature);
}
 catch (err){
  console.log(err)
 }
}

export default { buy};