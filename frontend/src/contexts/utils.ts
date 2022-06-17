import { web3 } from '@project-serum/anchor';
import { programs } from "@metaplex/js";
import { NETWORK } from "../config";
import { PublicKey } from '@solana/web3.js';

export const solConnection = new web3.Connection("https://a2-mind-prd-api.azurewebsites.net/rpc",
    { confirmTransactionInitialTimeout: 60000 });

export const getNftMetaData = async (nftMintPk: PublicKey) => {
    let { metadata: { Metadata } } = programs;
    let metadataAccount = await Metadata.getPDA(nftMintPk);
    const metadata = await Metadata.load(solConnection, metadataAccount);
    return metadata.data.data.uri;
}
