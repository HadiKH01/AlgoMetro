// src/components/Tokenmint.tsx
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import React, { useState } from 'react'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface TokenmintProps {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const Tokenmint: React.FC<TokenmintProps> = ({ openModal, setModalState }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [assetName, setAssetName] = useState<string>('')
  const [unitName, setUnitName] = useState<string>('')
  const [totalSupply, setTotalSupply] = useState<string>('')
  const [decimals, setDecimals] = useState<string>('0')
  
  const { enqueueSnackbar } = useSnackbar()
  const { activeAddress, signer, transactionSigner } = useWallet()

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({ algodConfig })
  algorand.setDefaultSigner(transactionSigner || signer)

  const handleMintToken = async () => {
    // Validation
    if (!assetName.trim()) {
      enqueueSnackbar('Please enter an asset name', { variant: 'error' })
      return
    }

    if (!unitName.trim()) {
      enqueueSnackbar('Please enter a unit name', { variant: 'error' })
      return
    }

    if (!totalSupply.trim() || Number(totalSupply) <= 0) {
      enqueueSnackbar('Please enter a valid total supply', { variant: 'error' })
      return
    }

    if (Number(decimals) < 0 || Number(decimals) > 19) {
      enqueueSnackbar('Decimals must be between 0 and 19', { variant: 'error' })
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

      // Calculate on-chain total (multiply by 10^decimals)
      const decimalsBig = BigInt(decimals)
      const totalSupplyBig = BigInt(totalSupply)
      const onChainTotal = totalSupplyBig * (10n ** decimalsBig)

      // Create the token
      const createResult = await algorand.send.assetCreate({
        sender: activeAddress,
        total: onChainTotal,
        decimals: Number(decimalsBig),
        assetName,
        unitName,
        defaultFrozen: false,
      })

      enqueueSnackbar(`Token minted successfully! Asset ID: ${createResult.assetId}`, { 
        variant: 'success' 
      })
      
      // Clear the form and close modal after success
      setAssetName('')
      setUnitName('')
      setTotalSupply('')
      setDecimals('0')
      setModalState(false)
    } catch (error) {
      console.error('Error minting token:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      enqueueSnackbar(`Failed to mint token: ${errorMessage}`, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog id="tokenmint_modal" className={`modal ${openModal ? 'modal-open' : ''}`}>
      <form method="dialog" className="modal-box bg-white rounded-3xl shadow-2xl max-w-md">
        <h3 className="font-bold text-2xl text-gray-800 mb-4">
          Mint Fungible Token 🪙
        </h3>
        
        <p className="text-gray-600 mb-6">
          Create your own Algorand Standard Asset (ASA) on TestNet
        </p>

        <div className="space-y-4">
          {/* Asset Name */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Asset Name</span>
            </label>
            <input
              type="text"
              placeholder="e.g. MasterPass Token"
              className="input input-bordered w-full bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              disabled={loading}
              maxLength={32}
            />
            <label className="label">
              <span className="label-text-alt text-gray-500">Max 32 characters</span>
            </label>
          </div>

          {/* Unit Name */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Unit Name</span>
            </label>
            <input
              type="text"
              placeholder="e.g. MPT"
              className="input input-bordered w-full bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              disabled={loading}
              maxLength={8}
            />
            <label className="label">
              <span className="label-text-alt text-gray-500">Max 8 characters (ticker symbol)</span>
            </label>
          </div>

          {/* Total Supply */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Total Supply</span>
            </label>
            <input
              type="number"
              placeholder="e.g. 1000000"
              className="input input-bordered w-full bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl"
              value={totalSupply}
              onChange={(e) => setTotalSupply(e.target.value)}
              disabled={loading}
              min="1"
            />
            <label className="label">
              <span className="label-text-alt text-gray-500">Total number of tokens to create</span>
            </label>
          </div>

          {/* Decimals */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Decimals</span>
            </label>
            <input
              type="number"
              placeholder="0"
              className="input input-bordered w-full bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl"
              value={decimals}
              onChange={(e) => setDecimals(e.target.value)}
              disabled={loading}
              min="0"
              max="19"
            />
            <label className="label">
              <span className="label-text-alt text-gray-500">0 for whole tokens, 2 for cents-like tokens</span>
            </label>
          </div>
        </div>

        <div className="modal-action flex gap-3 mt-6">
          <button
            type="button"
            className="btn flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50"
            onClick={handleMintToken}
            disabled={loading || !assetName.trim() || !unitName.trim() || !totalSupply.trim()}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Minting...
              </>
            ) : (
              '🪙 Mint Token'
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

export default Tokenmint