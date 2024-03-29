import React, { useEffect, useState } from 'react'
import Cards from './Cards'
import Info from './Info';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';

function NFTs({ marketplace}) {

  useEffect(()=>{
    document.title = "NFT Museum ETH"
}, []);

  const [toggle, setToggle] = useState(false)
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [nftitem, setNFTitem] = useState({})

  const loadMarketplaceItems = async () => {
   
    const itemCount = await marketplace.itemCount()
    let items = []
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i)
      if (!item.sold) {
       
        const uri = await marketplace.tokenURI(item.tokenId)
        
        const response = await fetch(uri)
        const metadata = await response.json()
      
        const totalPrice = await marketplace.getTotalPrice(item.itemId)
       
        items.push({
          totalPrice,
          itemId: item.itemId,
          owner: metadata.owner,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          viewitem:false,
        })
      }
    }
    setLoading(false)
    setItems(items)
    
  }

  const buyMarketItem = async (item) => {
    console.log(item);
   const tx = await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice }))

   toast.info("Wait till transaction Confirms....", {
    position: "top-center"
  })

  await tx.wait();

    setNFTitem(item)
    setToggle(true);
    item.viewitem =true;
  }



  useEffect(() => {
    loadMarketplaceItems()
  }, [])

  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2 className='text-white font-bold pt-24 text-2xl text-center'>Loading...</h2>
    </main>
  )

  return (
    <>
    {toggle ? <Info nftitem={nftitem} setToggle={setToggle} /> :
   ( <div className='flex flex-wrap gradient-bg-welcome   gap-10 justify-center pt-24 pb-5 px-16'>
         {
     ( items.length > 0 ?
    
            items.map((item, idx) => (
              
              <Cards item={item} buyMarketItem={buyMarketItem} setToggle={setToggle} marketplace={marketplace} />

             
            ))
            
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2 className='text-white'>No listed assets</h2>
          </main>
        ) )}
    </div>)
     }
     </>
  )
}

export default NFTs