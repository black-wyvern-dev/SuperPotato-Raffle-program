import { Skeleton } from "@mui/material";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import moment from "moment";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { claimReward, getStateByKey } from "../contexts/transaction";
import { getNftMetaData } from "../contexts/utils";
import CopyAddress from "./CopyAddress";
import EndTimeCountdown from "./EndTimeCountdown";
import NFTCardSkeleton from "./NFTCardSkeleton";
import { SolanaIcon, VerifiedIcon } from "./svgIcons";
import { errorAlert } from "./toastGroup";

export default function NFTCard(props: {
    mint: string,
    raffleKey: string,
    twitter: string,
    showedDetail: boolean,
    showDetail: Function,
    setDetail: Function,
    raffleId: string,
    closeDetail: Function,
    wallet: WalletContextState,
    startLoading: Function,
    closeLoading: Function,
    updatePage: Function,
    keyword: string,
    headTab: string
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    const [maxEntrants, setMaxEntrants] = useState(0);
    const [endTimestamp, setEndTimeStamp] = useState(new Date().getTime() / 1000);
    const [ticketPriceSol, setTicketPriceSol] = useState(0);
    const [winner, setWinner] = useState("");
    const [count, setCount] = useState(0);
    const [creator, setCreator] = useState("");
    const [claimed, setClaimed] = useState(0);

    const onClaimNft = async () => {
        if (props.wallet.publicKey !== null) {
            try {
                await claimReward(
                    props.wallet,
                    new PublicKey(props.mint),
                    new PublicKey(props.raffleKey),
                    () => props.startLoading(),
                    () => props.closeLoading(),
                    () => props.updatePage(),
                    props.raffleId
                )
            } catch (error) {
                console.log(error);
            }
        } else {
            errorAlert("Pleace connect wallet!")
        }
    }

    const getNFTdetail = async () => {
        setIsLoading(true);
        const uri = await getNftMetaData(new PublicKey(props.mint))
        await fetch(uri)
            .then(resp =>
                resp.json()
            ).then((json) => {
                setImage(json.image);
                setName(json.name);
            })
            .catch((error) => {
                console.log(error);
            })
        const raffleDetail = await getStateByKey(new PublicKey(props.raffleKey));
        if (raffleDetail) {
            setMaxEntrants(raffleDetail.maxEntrants.toNumber());
            setEndTimeStamp(raffleDetail.endTimestamp.toNumber());
            setTicketPriceSol(raffleDetail.ticketPriceSol.toNumber() / LAMPORTS_PER_SOL);
            setWinner(raffleDetail.winner.toBase58());
            setCount(raffleDetail.count.toNumber());
            setCreator(raffleDetail.creator.toBase58());
            setClaimed(raffleDetail.claimed.toNumber());
        }
        setIsLoading(false);
    }

    const enterDetail = () => {
        props.setDetail({
            nftMint: props.mint,
            raffleKey: props.raffleKey,
            image: image,
            name: name,
            maxEntrants: maxEntrants,
            endTimestamp: endTimestamp,
            ticketPriceSol: ticketPriceSol,
            winner: winner,
            raffleId: props.raffleId,
            count: count,
            creator: creator,
            twitter: props.twitter
        })
        props.showDetail();
    }

    useEffect(() => {
        getNFTdetail();
        // eslint-disable-next-line
    }, [])

    const cardRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        if (cardRef.current) {
            setDimensions({
                width: cardRef.current.offsetWidth,
                height: cardRef.current.offsetHeight
            });
        }
    }, []);

    return (
        name.toLowerCase().indexOf(props.keyword.toLowerCase()) !== -1 ?
            <div className="nft-card">
                {!isLoading ?
                    <div className="nft-card-content">
                        <div
                            className="media"
                            ref={cardRef}
                        >
                            {/* eslint-disable-next-line */}
                            <img
                                src={image}
                                alt=""
                                style={{ height: dimensions.width }}
                            />

                            {new Date() < new Date(endTimestamp * 1000) ?
                                <button className="btn-round btn-dark" onClick={() => enterDetail()}>
                                    Enter Raffle
                                </button>
                                :
                                count !== 0 ?
                                    (
                                        (claimed === 2) ?
                                            (
                                                props.wallet.publicKey?.toBase58() === winner ?
                                                    <button className="btn-round btn-blue" onClick={() => onClaimNft()}>
                                                        Claim NFT
                                                    </button>
                                                    :
                                                    <div className="btn-round button-winner" >
                                                        <label>Winner</label>
                                                        <CopyAddress address={winner} length={3} />
                                                    </div>
                                            )
                                            :
                                            (
                                                (claimed === 1 && props.wallet.publicKey?.toBase58() === winner) ?
                                                    <button className="btn-round btn-blue" disabled>
                                                        Claimed
                                                    </button>
                                                    :
                                                    <button className="btn-round btn-dark" onClick={() => enterDetail()}>
                                                        Enter Raffle
                                                    </button>
                                            )
                                    )
                                    :
                                    <button className="btn-round btn-dark" onClick={() => enterDetail()}>
                                        Enter Raffle
                                    </button>
                            }
                        </div>
                        <div className="card-content">
                            <p className="collection">
                                Collection <span><VerifiedIcon /></span>
                            </p>
                            <p className="nft-name">
                                {name}
                            </p>
                            <div className="entries-price">
                                {new Date() > new Date(endTimestamp * 1000) ?
                                    (
                                        count === 0 ?
                                            <div className="entries">
                                                <label>Tickets Sold</label>
                                                <p>Not sold</p>
                                            </div>
                                            :
                                            <div className="entries">
                                                <label>Tickets Sold</label>
                                                <p>{count} / {maxEntrants}</p>
                                            </div>
                                    )
                                    :
                                    <div className="entries">
                                        <label>Entries Left</label>
                                        <p>{count} / {maxEntrants}</p>
                                    </div>
                                }
                                <div className="price">
                                    <label>Ticket Price</label>
                                    <p>{ticketPriceSol} <SolanaIcon /></p>
                                </div>
                            </div>
                            <div className="card-bottom">

                                {new Date() < new Date(endTimestamp * 1000) ?
                                    <button className="btn-round btn-dark" onClick={() => enterDetail()}>
                                        Enter Raffle
                                    </button>
                                    :
                                    count !== 0 ?
                                        (
                                            (claimed === 2) ?
                                                (
                                                    props.wallet.publicKey?.toBase58() === winner ?
                                                        <button className="btn-round btn-blue" onClick={() => onClaimNft()}>
                                                            Claim NFT
                                                        </button>
                                                        :
                                                        <div className="btn-round button-winner" >
                                                            <label>Winner</label>
                                                            <CopyAddress address={winner} length={3} />
                                                        </div>
                                                )
                                                :
                                                (
                                                    (claimed === 1 && props.wallet.publicKey?.toBase58() === winner) ?
                                                        <button className="btn-round btn-blue" disabled>
                                                            Claimed
                                                        </button>
                                                        :
                                                        <button className="btn-round btn-dark" onClick={() => enterDetail()}>
                                                            Enter Raffle
                                                        </button>
                                                )
                                        )
                                        :
                                        <button className="btn-round btn-dark" onClick={() => enterDetail()}>
                                            Enter Raffle
                                        </button>
                                }
                                <div className="end-time">
                                    <label>
                                        {new Date() > new Date(endTimestamp * 1000) ?
                                            "Ended"
                                            :
                                            "Ends in"
                                        }
                                    </label>
                                    {endTimestamp &&
                                        <p>
                                            <EndTimeCountdown endTime={moment(endTimestamp * 1000).format("yyyy-MM-DD HH:mm")} endAction={() => getNFTdetail()} />
                                        </p>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <NFTCardSkeleton />
                }
            </div >
            :
            <span style={{ display: "none" }}></span>
    )
}
