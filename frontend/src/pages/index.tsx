import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { NextSeo } from "next-seo";
import { useCallback, useEffect, useState } from "react";
import { db, rafflesInstance } from "../api/firebase";
import CollectionRegister from "../components/CollectionRegister";
import CreateRaffle from "../components/CreateRaffle";
import Footer from "../components/Footer";
import Header from "../components/Header";
import MyRaffleList from "../components/MyRaffleList";
import NFTCard from "../components/NFTCard";
import NFTCardSkeleton from "../components/NFTCardSkeleton";
import RaffleDetail from "../components/RaffleDetail";
import { LIVE_URL } from "../config";
import { getGlobalAllData } from "../contexts/transaction";
import { RaffleDetailType } from "../contexts/types";

export default function HomePage(props: {
  startLoading: Function,
  closeLoading: Function
}) {
  const { startLoading, closeLoading } = props;
  const [showDetail, setShowDetail] = useState(false);
  const [showMineDetail, setShowMineDetail] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [raffles, setRaffles] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [raffleDetail, setRaffleDetail] = useState<RaffleDetailType>({
    nftMint: "",
    raffleKey: "",
    image: "",
    name: "",
    maxEntrants: 0,
    endTimestamp: 0,
    ticketPriceSol: 0,
    winner: "",
    count: 0,
    raffleId: "",
    creator: "",
    twitter: ""
  });
  const [raffleMineDetail, setRaffleMineDetail] = useState<RaffleDetailType>({
    nftMint: "",
    raffleKey: "",
    image: "",
    name: "",
    maxEntrants: 0,
    endTimestamp: 0,
    ticketPriceSol: 0,
    winner: "",
    count: 0,
    raffleId: "",
    creator: "",
    twitter: ""
  });
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("Recently Added");
  const [headTab, setHeadTab] = useState("all");
  const wallet = useWallet();

  const handleDetail = (status: boolean) => {
    const bodyElement = window.document.getElementById("__next");
    if (showDetail) {
      setShowDetail(status);
      if (bodyElement) {
        window.document.body.classList.remove("overflow-hidden");
      }
    } else {
      setShowDetail(status);
      if (bodyElement) {
        window.document.body.classList.add("overflow-hidden");
      }
    }
  }

  const handleMineDetail = (status: boolean) => {
    const bodyElement = window.document.getElementById("__next");
    if (showMineDetail) {
      setShowMineDetail(status);
      if (bodyElement) {
        window.document.body.classList.remove("overflow-hidden");
      }
    } else {
      setShowMineDetail(status);
      if (bodyElement) {
        window.document.body.classList.add("overflow-hidden");
      }
    }
  }

  const handleCreate = (status: boolean) => {
    const bodyElement = window.document.getElementById("__next");
    if (showCreate) {
      setShowCreate(status);
      if (bodyElement) {
        window.document.body.classList.remove("overflow-hidden");
      }
    } else {
      setShowCreate(status);
      if (bodyElement) {
        window.document.body.classList.add("overflow-hidden");
      }
    }
  }

  const getGlobalData = async () => {
    setIsLoading(true);
    const now = new Date().getTime();
    const data = await getGlobalAllData();
    const filterData: any = [];
    if (data && data?.length !== 0) {
      for (let item of data) {
        if (item) {
          let dbData: any = [];
          const q = query(collection(db, "raffles"), where("raffleKey", "==", item?.raffleKey));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            dbData = doc.data();
            dbData.id = doc.id;
          });
          if (headTab === "all") {
            filterData.push({
              nftMint: item.nftMint.toBase58(),
              raffleKey: item.raffleKey,
              endTimestamp: item.endTimestamp.toNumber(),
              createTimeStamp: dbData.createTimeStamp,
              twitter: dbData.twitter,
              ticketPriceSol: item.ticketPriceSol.toNumber() / LAMPORTS_PER_SOL,
              id: dbData.id,
            })
          } else if (headTab === "past") {
            if (item.endTimestamp.toNumber() < now / 1000) {
              filterData.push({
                nftMint: item.nftMint.toBase58(),
                raffleKey: item.raffleKey,
                endTimestamp: item.endTimestamp.toNumber(),
                createTimeStamp: dbData.createTimeStamp,
                twitter: dbData.twitter,
                ticketPriceSol: item.ticketPriceSol.toNumber() / LAMPORTS_PER_SOL,
                id: dbData.id,
              })
            }
          }
        }
      }
      if (sort === "recent") {
        filterData.sort((a: any, b: any) => b.createTimeStamp - a.createTimeStamp);
      } else if (sort === "older") {
        filterData.sort((a: any, b: any) => a.createTimeStamp - b.createTimeStamp);
      } else if (sort === "price-l-h") {
        filterData.sort((a: any, b: any) => a.ticketPriceSol - b.ticketPriceSol);
      } else if (sort === "price-h-l") {
        filterData.sort((a: any, b: any) => b.ticketPriceSol - a.ticketPriceSol);
      }

      setRaffles(filterData);
    }
    setIsLoading(false);
  }

  const handleRegister = (status: boolean) => {
    setShowRegister(status);
  }

  useEffect(() => {
    getGlobalData();
    // eslint-disable-next-line
  }, [sort, headTab]);

  useEffect(() => {
    const collectionRefCollections = collection(db, "collections");
    const qCollections = query(collectionRefCollections);
    const collectionRefRaffles = collection(db, "raffles");
    const qRaffles = query(collectionRefRaffles);
    onSnapshot(qCollections, () => {
      getGlobalData();
    });
    onSnapshot(qRaffles, () => {
      getGlobalData();
    });
    return;
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <NextSeo
        title="Mindfolk | NFT Raffle"
        description="There is magic in their pipes, and more ideas in their minds! Some say it is from the wood found in the forests of the lush Peninsula, upon which their Schooners wrecked. Having left their over-populated lands in search of greener shores, the 777 hatted individuals known as the Mindfolk have set-out to introduce new architectural structures within their environment."
        openGraph={{
          url: `${LIVE_URL}`,
          title: 'Mindfolk | NFT Raffle',
          description: 'There is magic in their pipes, and more ideas in their minds! Some say it is from the wood found in the forests of the lush Peninsula, upon which their Schooners wrecked. Having left their over-populated lands in search of greener shores, the 777 hatted individuals known as the Mindfolk have set-out to introduce new architectural structures within their environment.',
          images: [
            {
              url: `${LIVE_URL}og-cover.png`,
              width: 1200,
              height: 600,
              alt: 'Mindfolk',
              type: 'image/png',
            }
          ],
          site_name: 'Mindfolk',
        }}
      />
      <main>
        <div className="container">
          <Header
            onKeyword={(value: string) => setKeyword(value)}
            onHeadTab={(value: string) => setHeadTab(value)}
            onSort={(value: string) => setSort(value)}
            headTab={headTab}
          />
          {!isLoading ?
            <div className="nft-box">
              {raffles && raffles.map((item: any, key: number) => (
                <NFTCard
                  key={key}
                  mint={item.nftMint}
                  raffleKey={item.raffleKey}
                  twitter={item.twitter}
                  raffleId={item.id}
                  showedDetail={showDetail}
                  showDetail={() => handleDetail(true)}
                  closeDetail={() => handleDetail(false)}
                  setDetail={(e: any) => setRaffleDetail(e)}
                  wallet={wallet}
                  startLoading={() => startLoading()}
                  closeLoading={() => closeLoading()}
                  updatePage={() => getGlobalData()}
                  keyword={keyword}
                  headTab={headTab}
                />
              ))}
            </div>
            :
            <div className="nft-box">
              {[1, 2, 3, 4, 5].map((item, key) => (
                <div className="nft-card" key={key} >
                  <NFTCardSkeleton />
                </div>
              ))}
            </div>
          }
        </div>
        <RaffleDetail
          showedDetail={showDetail}
          showDetail={() => setShowDetail(true)}
          closeDetail={() => handleDetail(false)}
          raffleDetail={raffleDetail}
          startLoading={() => startLoading()}
          closeLoading={() => closeLoading()}
          getGlobalData={() => getGlobalData()}
          setDetail={(e: any) => setRaffleDetail(e)}
        />
        <MyRaffleList
          showedDetail={showMineDetail}
          showDetail={() => handleMineDetail(true)}
          closeDetail={() => handleMineDetail(false)}
          raffleDetail={raffleMineDetail}
          startLoading={() => startLoading()}
          closeLoading={() => closeLoading()}
          getGlobalData={() => getGlobalData()}
          setDetail={(e: any) => setRaffleMineDetail(e)}
        />
        <CreateRaffle
          showCreated={showCreate}
          closeCreate={() => handleCreate(false)}
          showRegistered={showRegister}
          showRegister={() => handleRegister(true)}
          closeRegister={() => handleRegister(false)}
          startLoading={() => startLoading()}
          closeLoading={() => closeLoading()}
          getAllData={() => getGlobalData()}
        />
        <CollectionRegister
          showRegister={showRegister}
          closeRegister={() => handleRegister(false)}
          startLoading={() => startLoading()}
          closeLoading={() => closeLoading()}
        />
      </main>
      <Footer
        showProfile={() => setShowMineDetail(true)}
        showCreate={() => handleCreate(true)}
      />
    </>
  )
}
