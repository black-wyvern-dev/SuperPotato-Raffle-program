# Alfred-Raffle-program
This is the raffle program by using $SOL to buy tickets

## Install Dependencies
- Install `node` and `yarn`
- Install `ts-node` as global command
- Confirm the solana wallet preparation: `/home/---/.config/solana/id.json` in test case

## Usage
- Main script source for all functionality is here: `/cli/script.ts`
- Program account types are declared here: `/cli/types.ts`
- Idl to make the JS binding easy is here: `/cli/raffle.json`

Able to test the script functions working in this way.
- Change commands properly in the main functions of the `script.ts` file to call the other functions
- Confirm the `ANCHOR_WALLET` environment variable of the `ts-node` script in `package.json`
- Run `yarn ts-node`

## Features

### - As a Smart Contract Owner
For the first time use, the Smart Contract Owner should `initialize` the Smart Contract for global account allocation.
```js
initProject()
```

To add collections who will use this raffle site, Admin should call `addCollection` function.(In this collectionId is the verified creator of this collection NFTs)
```js
addCollection(
    userAddress: PublicKey,
    collectionId: PublicKey
)
```

### - As the Creator of Raffle
The NFTs will be stored in the globalAuthority address.
When the admin creates a raffle, call the `createRaffle` function, the NFT will be sent to the PDA and the data of this raffle is stored on blockchain.
```js
createRaffle(
    userAddress: PublicKey,
    nft_mint: PublicKey,
    ticketPriceSol: number,
    endTimestamp: number,
    max: number
)
```

The creator can withdraw NFT from the PDA if nobody buys tickets and the time exceeds the endTime of raffle. 
```js
withdrawNft(
    userAddress: PublicKey,
    nft_mint: PublicKey
)
```

### - As the User of Raffle
When users buy tickets, call the `buyTicket` function, users will send $SOL to the raffle creator.
```js
buyTicket(
    userAddress: PublicKey,
    nft_mint: PublicKey,
    amount: number
)
```

To see the winner of the raffle, someone should call `revealWinnner` function. If then, in the `RafflePool` account, `winner`  field will be charged with winner's address.
```js
revealWinner(
    userAddress: PublicKey,
    nft_mint: PublicKey
)
```


### - As the Winner of Raffle 
Winners can claim rewards by calling `claimReward` function.
```js
claimReward(
    userAddress: PublicKey,
    nft_mint: PublicKey
)
```
