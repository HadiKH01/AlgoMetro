// src/Home.tsx
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { sha512_256 } from 'js-sha512'
import { useSnackbar } from 'notistack'
import React, { useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import NFTmint from './components/NFTmint'
import Tokenmint from './components/Tokenmint'
import Transact from './components/Transact'
import { getAlgodConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  // Page navigation state
  const [currentPage, setCurrentPage] = useState('home')
  
  // Bus booking state
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null)
  const [bookedSeats, setBookedSeats] = useState<number[]>([5, 12, 18, 23])
  const [userTickets, setUserTickets] = useState<any[]>([])
  
  // Modal states
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openTransactModal, setOpenTransactModal] = useState<boolean>(false)
  const [openNFTModal, setOpenNFTModal] = useState<boolean>(false)
  const [openTokenModal, setOpenTokenModal] = useState<boolean>(false)
  
  const { activeAddress } = useWallet()

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage setPage={setCurrentPage} toggleWalletModal={toggleWalletModal} activeAddress={activeAddress} />
      case 'bus':
        return <BusView 
          setPage={setCurrentPage} 
          selectedSeat={selectedSeat}
          setSelectedSeat={setSelectedSeat}
          bookedSeats={bookedSeats}
          activeAddress={activeAddress}
        />
      case 'payment':
        return <PaymentPage 
          setPage={setCurrentPage}
          selectedSeat={selectedSeat}
          setBookedSeats={setBookedSeats}
          setUserTickets={setUserTickets}
          activeAddress={activeAddress}
        />
      case 'tickets':
        return <MyTickets 
          setPage={setCurrentPage}
          userTickets={userTickets}
        />
      default:
        return <HomePage setPage={setCurrentPage} toggleWalletModal={toggleWalletModal} activeAddress={activeAddress} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-purple-600 cursor-pointer" onClick={() => setCurrentPage('home')}>
                🚌 AlgoMetro
              </h1>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => setCurrentPage('home')}
                className={`px-3 py-2 rounded-md font-medium ${currentPage === 'home' ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:text-purple-600'}`}
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentPage('bus')}
                className={`px-3 py-2 rounded-md font-medium ${currentPage === 'bus' ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:text-purple-600'}`}
              >
                Book Seat
              </button>
              <button 
                onClick={() => setCurrentPage('tickets')}
                className={`px-3 py-2 rounded-md font-medium ${currentPage === 'tickets' ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:text-purple-600'}`}
              >
                My Tickets
              </button>
              {activeAddress ? (
                <div className="bg-green-100 px-3 py-2 rounded-md cursor-pointer" onClick={toggleWalletModal}>
                  <span className="text-green-700 text-sm font-medium">
                    🟢 {activeAddress.substring(0, 6)}...
                  </span>
                </div>
              ) : (
                <button 
                  onClick={toggleWalletModal}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md font-medium hover:bg-purple-700"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      {renderPage()}

      {/* Modal Components */}
      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
      <Transact openModal={openTransactModal} setModalState={setOpenTransactModal} />
      <Tokenmint openModal={openTokenModal} setModalState={setOpenTokenModal} />
      <NFTmint openModal={openNFTModal} setModalState={setOpenNFTModal} />
    </div>
  )
}

// ==================== HOME PAGE ====================
interface HomePageProps {
  setPage: (page: string) => void
  toggleWalletModal: () => void
  activeAddress: string | null
}

const HomePage: React.FC<HomePageProps> = ({ setPage, toggleWalletModal, activeAddress }) => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 mt-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Welcome to AlgoMetro 🚌
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Book your seat on the blockchain bus! Pay with crypto, get your NFT ticket, and enjoy the ride.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
              <div className="text-4xl mb-3">🪑</div>
              <h3 className="font-bold text-lg mb-2">Choose Your Seat</h3>
              <p className="text-gray-600 text-sm">Select from available seats in our virtual bus</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl">
              <div className="text-4xl mb-3">💳</div>
              <h3 className="font-bold text-lg mb-2">Pay with Crypto</h3>
              <p className="text-gray-600 text-sm">Secure payment through Pera Wallet (1 ALGO)</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-2xl">
              <div className="text-4xl mb-3">🎟️</div>
              <h3 className="font-bold text-lg mb-2">Get NFT Ticket</h3>
              <p className="text-gray-600 text-sm">Receive a unique NFT as your seat verification</p>
            </div>
          </div>

          {!activeAddress ? (
            <>
              <button
                onClick={toggleWalletModal}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg transform transition hover:scale-105 mb-4"
              >
                🔗 Connect Wallet to Start
              </button>
              <p className="text-sm text-gray-500">Connect your Pera Wallet to book your seat</p>
            </>
          ) : (
            <button
              onClick={() => setPage('bus')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg transform transition hover:scale-105"
            >
              🚀 Book Your Seat Now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ==================== BUS VIEW PAGE ====================
interface BusViewProps {
  setPage: (page: string) => void
  selectedSeat: number | null
  setSelectedSeat: (seat: number | null) => void
  bookedSeats: number[]
  activeAddress: string | null
}

const BusView: React.FC<BusViewProps> = ({ setPage, selectedSeat, setSelectedSeat, bookedSeats, activeAddress }) => {
  const seats = Array.from({ length: 40 }, (_, i) => i + 1)
  
  const handleSeatSelect = (seatNumber: number) => {
    if (bookedSeats.includes(seatNumber)) return
    setSelectedSeat(seatNumber)
  }

  const handleContinue = () => {
    if (!activeAddress) {
      alert('Please connect your wallet first!')
      return
    }
    if (!selectedSeat) {
      alert('Please select a seat!')
      return
    }
    setPage('payment')
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Select Your Seat</h2>
        <p className="text-gray-600 mb-8 text-center">Choose an available seat on the AlgoMetro bus</p>

        {/* Bus Layout */}
        <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl p-8 mb-6">
          {/* Driver Section */}
          <div className="flex justify-end mb-8">
            <div className="bg-gray-800 text-white px-6 py-3 rounded-lg font-bold">
              🚗 Driver
            </div>
          </div>

          {/* Seats Grid */}
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            {seats.map((seat) => {
              const isBooked = bookedSeats.includes(seat)
              const isSelected = selectedSeat === seat
              
              return (
                <button
                  key={seat}
                  onClick={() => handleSeatSelect(seat)}
                  disabled={isBooked}
                  className={`
                    aspect-square rounded-xl font-bold text-lg transition-all transform
                    ${isBooked 
                      ? 'bg-red-300 text-red-800 cursor-not-allowed opacity-50' 
                      : isSelected
                      ? 'bg-green-500 text-white scale-110 shadow-lg'
                      : 'bg-blue-200 text-blue-800 hover:bg-blue-300 hover:scale-105'
                    }
                  `}
                >
                  {seat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-200 rounded"></div>
            <span className="text-sm text-gray-700">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-300 rounded"></div>
            <span className="text-sm text-gray-700">Booked</span>
          </div>
        </div>

        {/* Selected Seat Info */}
        {selectedSeat && (
          <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4 mb-6">
            <p className="text-center text-purple-800 font-semibold">
              ✓ You selected Seat #{selectedSeat} | Price: 1 ALGO
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => setPage('home')}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-xl"
          >
            ← Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedSeat}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Payment →
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== PAYMENT PAGE ====================
interface PaymentPageProps {
  setPage: (page: string) => void
  selectedSeat: number | null
  setBookedSeats: React.Dispatch<React.SetStateAction<number[]>>
  setUserTickets: React.Dispatch<React.SetStateAction<any[]>>
  activeAddress: string | null
}

const PaymentPage: React.FC<PaymentPageProps> = ({ setPage, selectedSeat, setBookedSeats, setUserTickets, activeAddress }) => {
  const [processing, setProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [ticketNFTId, setTicketNFTId] = useState('')

  const { enqueueSnackbar } = useSnackbar()
  const { signer, transactionSigner } = useWallet()

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({ algodConfig })
  algorand.setDefaultSigner(transactionSigner || signer)

  const handlePayment = async () => {
    if (!activeAddress) {
      enqueueSnackbar('Please connect your wallet!', { variant: 'error' })
      return
    }

    if (!transactionSigner && !signer) {
      enqueueSnackbar('Wallet signer not available. Please reconnect your wallet.', { variant: 'error' })
      return
    }

    setProcessing(true)

    try {
      // Step 1: Send payment (1 ALGO)
      enqueueSnackbar('Processing payment...', { variant: 'info' })
      
      const paymentResult = await algorand.send.payment({
        sender: activeAddress,
        receiver: activeAddress, // In production, send to your treasury address
        amount: (1).algo(), // 1 ALGO
      })

      enqueueSnackbar('Payment successful! Creating your NFT ticket...', { variant: 'success' })

      // Step 2: Try to fetch the base metadata from your public folder
      let baseMetadata = {
        name: "AlgoMetro Ticket",
        description: "Official AlgoMetro bus ticket - Your pass to ride the blockchain bus!",
        image: "https://gateway.pinata.cloud/ipfs/bafkreih5aznjvttude6c3wbvqeebb6rlx5wkbzyppv7garjiubll2ceym4",
        decimals: 0,
        properties: {
          type: "Bus Ticket",
          service: "AlgoMetro Express"
        }
      }
      
      try {
        const response = await fetch('/AlgoMetroNft.json')
        const contentType = response.headers.get('content-type')
        
        if (response.ok && contentType && contentType.includes('application/json')) {
          const jsonData = await response.json()
          baseMetadata = jsonData
          console.log('✅ Loaded custom metadata from AlgoMetroNft.json')
        } else {
          console.log('ℹ️ Using default metadata (file not found or invalid)')
        }
      } catch (error) {
        console.log('ℹ️ Using default metadata')
      }

      // Step 3: Customize metadata with seat-specific information
      const metadata = {
        ...baseMetadata,
        name: `${baseMetadata.name || 'AlgoMetro'} - Seat #${selectedSeat}`,
        description: `${baseMetadata.description || 'AlgoMetro bus ticket'} - Seat ${selectedSeat}`,
        properties: {
          ...(baseMetadata.properties || {}),
          seat_number: selectedSeat?.toString(),
          route: "AlgoMetro Express",
          booking_date: new Date().toISOString(),
          payment_txn: paymentResult.txIds[0],
        }
      }

      // Step 4: Upload customized metadata to Pinata IPFS
      enqueueSnackbar('Uploading ticket metadata to IPFS...', { variant: 'info' })
      
      let metadataIpfsHash = ''
      let metadataHash = new Uint8Array(32)
      
      try {
        // Upload to Pinata using their API
        const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY || ''
        const pinataSecretKey = import.meta.env.VITE_PINATA_SECRET_KEY || ''
        
        if (!pinataApiKey || !pinataSecretKey) {
          console.log('⚠️ Pinata keys not configured - using placeholder')
          enqueueSnackbar('Note: Configure Pinata keys for production use', { variant: 'warning' })
          // Use a placeholder that won't break the minting
          metadataIpfsHash = 'QmPlaceholder' + Date.now()
          const metadataString = JSON.stringify(metadata)
          metadataHash = new Uint8Array(Buffer.from(sha512_256.digest(metadataString)))
        } else {
          const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'pinata_api_key': pinataApiKey,
              'pinata_secret_api_key': pinataSecretKey,
            },
            body: JSON.stringify({
              pinataContent: metadata,
              pinataMetadata: {
                name: `algometro-seat-${selectedSeat}-${Date.now()}.json`
              },
              pinataOptions: {
                cidVersion: 0
              }
            })
          })

          if (!response.ok) {
            throw new Error('Pinata upload failed')
          }

          const result = await response.json()
          metadataIpfsHash = result.IpfsHash
          
          const metadataString = JSON.stringify(metadata)
          metadataHash = new Uint8Array(Buffer.from(sha512_256.digest(metadataString)))
          
          enqueueSnackbar('✅ Metadata uploaded to IPFS!', { variant: 'success' })
        }
      } catch (error) {
        console.error('Pinata upload error:', error)
        enqueueSnackbar('Using local metadata (Pinata upload failed)', { variant: 'warning' })
        // Continue with placeholder
        metadataIpfsHash = 'QmPlaceholder' + Date.now()
        const metadataString = JSON.stringify(metadata)
        metadataHash = new Uint8Array(Buffer.from(sha512_256.digest(metadataString)))
      }

      // Step 5: Mint ARC-3 compliant NFT ticket with IPFS URL
      enqueueSnackbar('Minting your NFT ticket...', { variant: 'info' })
      
      // Use the proper IPFS URL format that Pera Wallet can resolve
      const nftUrl = `ipfs://${metadataIpfsHash}#arc3`
      const createNFTResult = await algorand.send.assetCreate({
        sender: activeAddress,
        total: 1n,
        decimals: 0,
        assetName: `AlgoMetro #${selectedSeat}`,
        unitName: 'AMTKT',
        url: nftUrl, // ARC-3 compliant URL with #arc3 fragment
        metadataHash: metadataHash,
        defaultFrozen: false,
      })

      const nftAssetId = createNFTResult.assetId

      enqueueSnackbar(`🎉 Success! NFT Ticket #${nftAssetId} is now in your Pera Wallet!`, { variant: 'success' })
      
      console.log('NFT Details:', {
        assetId: nftAssetId,
        metadataUrl: nftUrl,
        pinataGateway: `https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`,
        explorerUrl: `https://testnet.algoexplorer.io/asset/${nftAssetId}`
      })

      // Step 4: Update state
      setBookedSeats(prev => [...prev, selectedSeat!])
      
      const ticket = {
        id: Date.now(),
        seat: selectedSeat,
        date: new Date().toLocaleDateString(),
        nftId: `ASA-${nftAssetId}`,
        assetId: nftAssetId,
        verified: true,
        paymentTxn: paymentResult.txIds[0],
        mintTxn: createNFTResult.txIds[0]
      }
      setUserTickets(prev => [...prev, ticket])
      
      setTicketNFTId(`ASA-${nftAssetId}`)
      setPaymentComplete(true)

    } catch (error) {
      console.error('Error during payment/minting:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      enqueueSnackbar(`Transaction failed: ${errorMessage}`, { variant: 'error' })
    } finally {
      setProcessing(false)
    }
  }

  if (paymentComplete) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your NFT ticket has been minted and sent to your wallet!
          </p>
          <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 mb-6">
            <p className="text-green-800 font-semibold mb-2">Seat #{selectedSeat}</p>
            <p className="text-green-700 text-sm">NFT ID: {ticketNFTId}</p>
          </div>
          <button
            onClick={() => setPage('tickets')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl mb-3"
          >
            View My Tickets
          </button>
          <button
            onClick={() => setPage('home')}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-xl"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Complete Payment</h2>
        
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <div className="flex justify-between mb-4">
            <span className="text-gray-600">Seat Number:</span>
            <span className="font-bold text-gray-800">#{selectedSeat}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-600">Route:</span>
            <span className="font-bold text-gray-800">AlgoMetro Express</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-600">Date:</span>
            <span className="font-bold text-gray-800">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="border-t-2 border-gray-300 pt-4 mt-4">
            <div className="flex justify-between text-lg">
              <span className="font-bold text-gray-800">Total:</span>
              <span className="font-bold text-purple-600">1 ALGO</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mb-6">
          <p className="text-blue-800 text-sm">
            💡 After payment, you'll receive an NFT ticket as verification of your seat booking.
          </p>
        </div>

        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl mb-3 disabled:opacity-50"
        >
          {processing ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2">⏳</span>
              Processing Payment...
            </span>
          ) : (
            '💳 Pay with Pera Wallet'
          )}
        </button>

        <button
          onClick={() => setPage('bus')}
          disabled={processing}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-xl"
        >
          ← Back to Seat Selection
        </button>
      </div>
    </div>
  )
}

// ==================== MY TICKETS PAGE ====================
interface MyTicketsProps {
  setPage: (page: string) => void
  userTickets: any[]
}

const MyTickets: React.FC<MyTicketsProps> = ({ setPage, userTickets }) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-8 text-center">My Tickets 🎟️</h2>
        
        {userTickets.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Tickets Yet</h3>
            <p className="text-gray-600 mb-6">Book your first seat on the AlgoMetro bus!</p>
            <button
              onClick={() => setPage('bus')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl"
            >
              Book a Seat
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {userTickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-purple-600">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Seat #{ticket.seat}</h3>
                    <p className="text-gray-600 text-sm">{ticket.date}</p>
                  </div>
                  {ticket.verified && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-600 mb-1">NFT Asset ID:</p>
                  <p className="font-mono text-sm text-gray-800 break-all">{ticket.nftId}</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-purple-100 text-purple-700 py-2 rounded-lg text-sm font-semibold hover:bg-purple-200">
                    View NFT
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200">
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home