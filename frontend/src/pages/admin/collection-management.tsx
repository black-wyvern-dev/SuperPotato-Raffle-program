import { useWallet, Wallet, WalletContextState } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import CopyAddress from "../../components/CopyAddress";
import { ADMINS } from "../../config";
import { Dialog } from "@mui/material";
import { collection, doc, getDocs, onSnapshot, query, updateDoc } from "firebase/firestore";
import { collectionsInstance, database, db } from "../../api/firebase";
import { successAlert } from "../../components/toastGroup";
import { addCollection, getCollectionState } from "../../contexts/transaction";
import { PublicKey } from "@solana/web3.js";

export default function CollectionManagement(props: {
    startLoading: Function,
    closeLoading: Function
}) {
    const { startLoading, closeLoading } = props;
    const router = useRouter();
    const wallet = useWallet();
    const [collections, setCollections] = useState<any>();

    const getCollections = async () => {
        await getDocs(collectionsInstance)
            .then(async (data) => {
                const collections = (data.docs.map((item: any) => {
                    return ({ ...item.data(), id: item.id })
                }));
                console.log(collections, "collections")
                setCollections(collections)
            }).catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        if (wallet.publicKey !== null) {
            getCollections();
            if (ADMINS.indexOf(wallet.publicKey.toBase58()) !== -1) {
                router.push("/admin/collection-management");
            } else {
                router.push("/")
            }
        } else {
            // router.push("/");
        }
        // eslint-disable-next-line
    }, [wallet.connected, wallet.publicKey]);

    useEffect(() => {
        const collectionRefToken = collection(db, "collections");
        const q = query(collectionRefToken);
        onSnapshot(q, () => {
            getCollections();
        });
        return;
        // eslint-disable-next-line
    }, [])

    return (
        <main className="collection-management">
            <div className="container">
                <div className="wallet-header">
                    <WalletModalProvider>
                        <WalletMultiButton />
                    </WalletModalProvider>
                </div>
                <div className="management-content">
                    <table>
                        <thead>
                            <tr>
                                <th align="left">Project Name</th>
                                <th align="left">Creator ID</th>
                                <th align="right">Twitter URL</th>
                                <th align="right">Marketplace</th>
                                {wallet.publicKey &&
                                    <th align="right">Actions</th>
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {collections && collections.length !== 0 && collections.map((item: any, key: number) => (
                                <ManageRow
                                    key={key}
                                    accepted={item.accepted}
                                    collectionId={item.collectionId}
                                    collectionName={item.collectionName}
                                    id={item.id}
                                    marketplace={item.marketplace}
                                    twitter={item.twitter}
                                    wallet={wallet}
                                    startLoading={() => startLoading()}
                                    closeLoading={() => closeLoading()}
                                />
                            ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    )
}

const ManageRow = (props: {
    collectionName: string,
    collectionId: string,
    twitter: string,
    marketplace: string,
    accepted: boolean,
    id: string,
    wallet: WalletContextState,
    startLoading: Function,
    closeLoading: Function
}) => {
    const [projectName, setProjectName] = useState(props.collectionName);
    const [showApprove, setShowApprove] = useState(false);
    const [showDeny, setShowDeny] = useState(false);
    const handleProjectName = (e: any) => {
        setProjectName(e.target.value);
    }
    const handleAction = async (status: boolean) => {
        const collectionById = doc(database, 'collections', props.id)
        await updateDoc(collectionById, {
            accepted: status,
            updateTimeStamp: new Date().getTime()
        })
            .then(() => {
                successAlert("Edit success!");
            })
            .catch((error) => {
                console.log(error)
            })
    }
    return (
        <tr>
            <td>
                <input
                    value={projectName}
                    onChange={handleProjectName}
                    className="td-name"
                    disabled
                />
            </td>
            <td>
                <CopyAddress address={props.collectionId} />
            </td>
            <td className="td-link">{props.twitter}</td>
            <td className="td-link">{props.marketplace}</td>
            {props.wallet.publicKey &&

                <td>
                    <div className="td-action">
                        <button
                            className="btn-accept"
                            onClick={() => setShowApprove(true)}
                            disabled={props.accepted}
                        >
                            {props.accepted ? "Accepted" : "Accept"}
                        </button>
                        <button
                            className="btn-deny"
                            onClick={() => setShowDeny(true)}
                            disabled={!props.accepted}
                        >
                            Deny
                        </button>
                        <ApproveDialog
                            opened={showApprove}
                            onClose={() => setShowApprove(false)}
                            saveDataBase={() => handleAction(true)}
                            wallet={props.wallet}
                            collectionId={props.collectionId}
                            startLoading={() => props.startLoading()}
                            closeLoading={() => props.closeLoading()}
                        />
                        <CancelDialog
                            opened={showDeny}
                            onClose={() => setShowDeny(false)}
                            saveDataBase={() => handleAction(false)}
                            wallet={props.wallet}
                            collectionId={props.collectionId}
                            startLoading={() => props.startLoading()}
                            closeLoading={() => props.closeLoading()}
                        />
                    </div>
                </td>
            }
        </tr>
    )
}

const ApproveDialog = (props: { opened: boolean, onClose: Function, saveDataBase: Function, wallet: WalletContextState, collectionId: string, startLoading: Function, closeLoading: Function }) => {
    const saveCollection = async () => {
        props.onClose();
        try {
            const collectionData = await getCollectionState();
            let able = false;
            if (collectionData && collectionData.count.toNumber() !== 0) {
                for (let item of collectionData.collections) {
                    console.log(item.toBase58())
                    if (item.toBase58() === props.collectionId) {
                        able = true;
                    }
                }
            }
            if (!able) {
                await addCollection(props.wallet, new PublicKey(props.collectionId), () => props.startLoading(), () => props.closeLoading(), () => props.saveDataBase());
            } else {
                props.saveDataBase();
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Dialog
            open={props.opened}
            onClose={() => props.onClose()}
        >
            <div className="table-dialog-content">
                <p>Are you sure to want to approve this?</p>
                <div className="dialog-action">
                    <button className="btn-approve" onClick={() => saveCollection()}>
                        Approve
                    </button>
                    <button className="btn-cancel" onClick={() => props.onClose()}>
                        Cancel
                    </button>
                </div>
            </div>
        </Dialog>
    )
}

const CancelDialog = (props: { opened: boolean, onClose: Function, saveDataBase: Function, wallet: WalletContextState, collectionId: string, startLoading: Function, closeLoading: Function }) => {
    const saveCollection = async () => {
        props.onClose();
        await props.saveDataBase();
    }
    return (
        <Dialog
            open={props.opened}
            onClose={() => props.onClose()}
        >
            <div className="table-dialog-content">
                <p>Are you sure to want to deny this?</p>
                <div className="dialog-action">
                    <button className="btn-deny" onClick={() => saveCollection()}>
                        Deny
                    </button>
                    <button className="btn-cancel" onClick={() => props.onClose()}>
                        Cancel
                    </button>
                </div>
            </div>
        </Dialog >
    )
}