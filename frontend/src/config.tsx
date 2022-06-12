import { PublicKey } from "@solana/web3.js";
export const NETWORK = "devnet"; //mainnet-beta | devnet
export const ADMINS = [
    "Fe4KejEc1pgo6MxjfRGYL1u5qMpYN7FMxPKYjbrdsFFE",
    "7TSu5dSRbnbxRgYb1bwwAELyP5bWWugRCug8vqg1UL7V"
]
export const LIVE_URL = "https://mindfolk-raffle.herokuapp.com/"

export const GLOBAL_AUTHORITY_SEED = "global-authority";
export const TREASURY_WALLET = new PublicKey('Am9xhPPVCfDZFDabcGgmQ8GTMdsbqEt1qVXbyhTxybAp');
export const PROGRAM_ID = "CPEUbGdMBQRsPbhvJKd8CsQVcdkC44cgtZvC9fEH3JJh";

export const METAPLEX = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

export const RAFFLE_SIZE = 64168;
export const COLLECTION_SIZE = 12816;
export const DECIMALS = 1000000000;