import './App.css';
import Nav from './components/Nav';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer} from 'react-toastify';
import Home from './components/Home';
import NFTs from './components/NFTs';
import {marketplace_abi} from "./Abi.js"
import Create from './components/Create';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import 'react-toastify/dist/ReactToastify.css';
import Info from './components/Info.jsx';


function App() {

  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState("");
  const [marketplace, setMarketplace]= useState({});
  



  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload()
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setLoading(false)
        let marketplaceAddress = "0x5B020e60691BaA4A388D153d4Db204f5ab028853";
       

        const marketplacecontract = new ethers.Contract(
          marketplaceAddress,
          marketplace_abi,
          signer
        );

       

        //console.log(contract);
        setMarketplace(marketplacecontract);
     
       
      } else {
        console.error("Metamask is not installed");
      }
    };

    provider && loadProvider();
  }, []);




  return (
    <BrowserRouter>
    <ToastContainer/>
    <div className="App min-h-screen">
      <div className='gradient-bg-welcome h-screen w-screen'>
      <Nav account={account}/>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/all-nft" element={<NFTs marketplace={marketplace} />}></Route>
        {/* <Route path="/all-nft" element={<NFTs marketplace={marketplace} setNFTitem={setNFTitem} />}></Route> */}
        <Route path="/create" element={<Create marketplace={marketplace}  />}></Route>
        {/* <Route path="/info" element={<Info nftitem={nftitem} />}></Route> */}
      </Routes>
      </div>
    </div>
  
    </BrowserRouter>
  );
}

export default App;
