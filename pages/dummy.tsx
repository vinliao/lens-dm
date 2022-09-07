// import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { useSignMessage, useAccount } from "wagmi";
// import { useState, useEffect } from "react";
// import EthCrypto from "eth-crypto";
// import supabase from "../components/db";

// export default function Dummy() {
//   const [localPrivkey, setLocalPrivkey] = useState("");
//   const [localPubkey, setLocalPubkey] = useState("");

//   // can do: useEffect status == connected, then signMessage()
//   const { address, status } = useAccount();

//   const localKeyMessage = {
//     address: address,
//     localPubkey: localPubkey,
//     localPrivkey: localPrivkey,
//   };

//   const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
//     message: EthCrypto.hash.keccak256(JSON.stringify(localKeyMessage)),
//   });

//   // on render, get private key from localStorage to react
//   // if privkey doesn't exist on localStorage, generate
//   useEffect(() => {
//     const storagePrivkey = localStorage.getItem("localPriv1234");

//     if (!storagePrivkey) {
//       const localKeypair = EthCrypto.createIdentity();
//       setLocalPrivkey(localKeypair.privateKey);
//       setLocalPubkey(localKeypair.publicKey);
//     } else {
//       setLocalPrivkey(storagePrivkey);
//       const pubkeyHex = EthCrypto.publicKeyByPrivateKey(storagePrivkey);
//       setLocalPubkey(pubkeyHex);
//     }
//   }, []);

//   // on sig success
//   useEffect(() => {
//     if (data) {
//       localStorage.setItem("localPriv1234", localPrivkey);
//       const ownershipProof = { body: localKeyMessage, sig: data };
//       localStorage.setItem(
//         "ownershipProof1234",
//         JSON.stringify(ownershipProof)
//       );
//     }
//   }, [isSuccess]);

//   async function createHandshakeMessage() {
//     const handshakeRecipient = "0x13AD05E3C2Ca995A91e1f8067ef470695cA63859"; // dummy

//     const handshakeMessage = {
//       message: "establishing handshake",
//       toEthAddress: handshakeRecipient,
//       fromEthAddress: address,
//       fromLocalPubkey: localPubkey,
//     };

//     const handshakePayload = {
//       handshakeMessage,
//       sig: EthCrypto.sign(
//         localPrivkey,
//         EthCrypto.hash.keccak256(JSON.stringify(handshakeMessage))
//       ),
//     };

//     console.log(handshakePayload);

//     const dbData = [
//       {
//         is_handshake: true,
//         handshake_recipient: handshakeRecipient,
//         handshake: handshakePayload,
//       },
//     ];

//     const { data, error } = await supabase.from("dm").insert(dbData);
//     console.log(data);
//     console.log(error);
//   }

//   async function createEncryptedMessage() {
//     const secretMessage = "supersecret";
//     const signature = EthCrypto.sign(
//       localPrivkey,
//       EthCrypto.hash.keccak256(secretMessage)
//     );
//     const payload = {
//       message: secretMessage,
//       signature,
//     };

//     // something along this line
//     // const encrypted = await EthCrypto.encryptWithPublicKey(
//     //   bob.publicKey, // by encrypting with bobs publicKey, only bob can decrypt the payload with his privateKey
//     //   JSON.stringify(payload) // we have to stringify the payload before we can encrypt it
//     // );
//   }

//   async function createMessageAfterHandshake() {
//     const { data, error } = await supabase
//       .from("dm")
//       .select("handshake")
//       .eq("handshake_recipient", address)
//       .eq("is_handshake", true);
//     console.log(data);

//     const senderLocalPubkey = data![0].handshake.handshakeMessage
//       .fromLocalPubkey;

//     const senderEthAddress = data![0].handshake.handshakeMessage.fromEthAddress;

//     const secretMessage = "supersecret";
//     const signature = EthCrypto.sign(
//       localPrivkey,
//       EthCrypto.hash.keccak256(secretMessage)
//     );

//     const payload = {
//       message: secretMessage,
//       signature,
//     };

//     const encrypted = await EthCrypto.encryptWithPublicKey(
//       senderLocalPubkey,
//       JSON.stringify(payload) // we have to stringify the payload before we can encrypt it
//     );
//     // {
//     //   iv: "c66fbc24cc7ef520a7...",
//     //   ephemPublicKey: "048e34ce5cca0b69d4e1f5...",
//     //   ciphertext: "27b91fe986e3ab030...",
//     //   mac: "dd7b78c16e462c42876745c7...",
//     // };

//     // we convert the object into a smaller string-representation
//     const encryptedString = EthCrypto.cipher.stringify(encrypted);
//     console.log(encryptedString);
//     console.log(encrypted);

//     sendDM(encryptedString, senderEthAddress);
//   }

//   async function sendDM(encryptedString: string, senderEthAddress: string) {
//     const dbData = [
//       {
//         dm_ciphertext: encryptedString,
//         dm_recipient: senderEthAddress,
//       },
//     ];

//     const { data, error } = await supabase.from("dm").insert(dbData);
//     console.log(data);
//   }

//   async function parseDM() {
//     const { data, error } = await supabase
//       .from("dm")
//       .select("dm_ciphertext")
//       .eq("dm_recipient", address)
//       .eq("is_handshake", false);
//     console.log(data);

//     const ciphertext = data![0].dm_ciphertext;

//     const encryptedObject = EthCrypto.cipher.parse(ciphertext);

//     const decrypted = await EthCrypto.decryptWithPrivateKey(
//       localPrivkey,
//       encryptedObject
//     );

//     const decryptedPayload = JSON.parse(decrypted);
//     console.log(decryptedPayload);
//   }

//   return (
//     <div className="flex flex-col items-center mx-auto max-w-md py-3 px-2">
//       <div className="mb-10">
//         <ConnectButton></ConnectButton>
//       </div>
//       <p>{localPrivkey}</p>
//       <p className="break-words">{localPubkey}</p>

//       <button onClick={() => signMessage()}>sign</button>
//       <button onClick={() => createHandshakeMessage()}>asdf</button>
//       <button onClick={() => createMessageAfterHandshake()}>
//         from another screen
//       </button>
//       <button onClick={() => parseDM()}>parse from chrome</button>
//     </div>
//   );
// }
