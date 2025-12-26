// src/components/NFTmint.tsx
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { sha512_256 } from 'js-sha512'
import { useSnackbar } from 'notistack'
import React, { useState } from 'react'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface NFTmintProps {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const NFTmint: React.FC<NFTmintProps> = ({ openModal, setModalState }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [metadataUrl, setMetadataUrl] = useState<string>('')
  
  const { enqueueSnackbar } = useSnackbar()
  const { activeAddress, signer, transactionSigner } = useWallet()

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({ algodConfig })
  algorand.setDefaultSigner(transactionSigner || signer)

  const handleMintNFT = async () => {
    if (!metadataUrl.trim()) {
      enqueueSnackbar('Please enter a metadata URL', { variant: 'error' })
      return
    }

    if (!activeAddress) {
      enqueueSnackbar('Please connect your wallet first', { variant: 'error' })
      return
    }

    setLoading(true)

    try {
      // Check if we have a signer
      if (!transactionSigner && !signer) {
        enqueueSnackbar('Wallet signer not available. Please reconnect your wallet.', { variant: 'error' })
        return
      }

      // Mint the NFT using the provided logic
      const createNFTResult = await algorand.send.assetCreate({
        sender: activeAddress,
        total: 1n,
        decimals: 0,
        assetName: 'MasterPass Ticket',
        unitName: 'MTK',
        url: metadataUrl,
        metadataHash: new Uint8Array(Buffer.from(sha512_256.digest(metadataUrl))),
        defaultFrozen: false,
      })

      enqueueSnackbar(`NFT minted successfully! Asset ID: ${createNFTResult.assetId}`, { 
        variant: 'success' 
      })
      
      // Clear the input and close modal after success
      setMetadataUrl('')
      setModalState(false)
    } catch (error) {
      console.error('Error minting NFT:', error)
      enqueueSnackbar('Failed to mint NFT. Please try again.', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog id="nftmint_modal" className={`modal ${openModal ? 'modal-open' : ''}`}>
      <form method="dialog" className="modal-box bg-white rounded-3xl shadow-2xl max-w-md">
        <h3 className="font-bold text-2xl text-gray-800 mb-4">
          Mint Your AlgoMetro NFT 🎟️
        </h3>
        
        <p className="text-gray-600 mb-6">
          Paste your IPFS metadata URL from Pinata to mint your unique AlgoMetro ticket NFT!
        </p>

        <div className="form-control w-full mb-6">
          <label className="label">
            <span className="label-text font-semibold text-gray-700">Metadata URL (IPFS)</span>
          </label>
          <input
            type="text"
            placeholder="ipfs://..."
            className="input input-bordered w-full bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl"
            value={metadataUrl}
            onChange={(e) => setMetadataUrl(e.target.value)}
            disabled={loading}
          />
          <label className="label">
            <span className="label-text-alt text-gray-500">
              Example: ipfs://QmYourHashHere
            </span>
          </label>
        </div>

        <div className="modal-action flex gap-3">
          <button
            type="button"
            className="btn flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50"
            onClick={handleMintNFT}
            disabled={loading || !metadataUrl.trim()}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Minting...
              </>
            ) : (
              '✨ Mint NFT'
            )}
          </button>
          
          <button
            type="button"
            className="btn flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl"
            onClick={() => setModalState(false)}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
      
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setModalState(false)}>close</button>
      </form>
    </dialog>
  )
}

export default NFTmint