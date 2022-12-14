import { useEffect, useState } from "react"
import { Web3Auth } from "@web3auth/web3auth"
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base"
// import RPC, { ExternalProvider } from "../lib/ethersRPC"
import RPC, { ExternalProvider } from "../lib/web3RPC"
import { apiKey } from "../constants/config/biconomy"
import { HelloWriter, NFTest } from "../constants/deployments"
import { Biconomy } from "@biconomy/mexa"

const clientId = "BORM_trX_nKcp_60_gUJ3f0a0AJY-joB2WJdIxO2HyXfyQUaYdybZIK8QciNCFPPAK6iz8jbRFEqz487GYi2qkA" // get from https://dashboard.web3auth.io

function App() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null)
  const [biconomy, setBiconomy] = useState<Biconomy | null>(null)
  const [provider, setProvider] = useState<ExternalProvider | null>(null)
  const [outputTxt, setOutputTxt] = useState("")

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x13881",
            rpcTarget: "https://matic-mumbai.chainstacklabs.com",
          },
        })

        setWeb3auth(web3auth)

        await web3auth.initModal()
        if (web3auth.provider) {
          const biconomy = new Biconomy(web3auth.provider, {
            apiKey: apiKey,
            debug: true,
            contractAddresses: [NFTest, HelloWriter], // list of contract address you want to enable gasless on
          })
          await biconomy.init()

          setBiconomy(biconomy)
          // setProvider(web3auth.provider)
          setProvider(biconomy.provider)
        }
      } catch (error) {
        console.error(error)
      }
    }

    init()
  }, [])

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet")
      return
    }
    const web3authProvider = await web3auth.connect()
    setProvider(web3authProvider)
  }

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet")
      return
    }
    const user = await web3auth.getUserInfo()
    console.log(user)
  }

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet")
      return
    }
    await web3auth.logout()
    setProvider(null)
  }

  const getChainId = async () => {
    if (!provider) {
      console.log("provider not initialized yet")
      return
    }
    const rpc = new RPC(provider)
    const chainId = await rpc.getChainId()
    console.log(chainId)
    setOutputTxt(JSON.stringify(["Chain ID", chainId], null, 2))
  }
  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialized yet")
      return
    }
    const rpc = new RPC(provider)
    const address = await rpc.getAccounts()
    console.log(address)
    setOutputTxt(JSON.stringify(["Address", address], null, 2))
  }

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet")
      return
    }
    const rpc = new RPC(provider)
    const balance = await rpc.getBalance()
    console.log(balance)
    setOutputTxt(JSON.stringify(["Balance", balance], null, 2))
  }

  const sendTransaction = async () => {
    if (!provider) {
      console.log("provider not initialized yet")
      return
    }
    const rpc = new RPC(provider)
    const receipt = await rpc.sendTransaction()
    console.log(receipt)
  }

  const writeContract = async () => {
    if (!provider) {
      console.log("provider not initialized yet")
      return
    }
    const rpc = new RPC(provider)
    const receipt = await rpc.writeContract()
    console.log(receipt)
    setOutputTxt(JSON.stringify(["Message from RPC node", receipt], null, 2))
  }

  const mintNft = async () => {
    if (!provider) {
      console.log("provider not initialized yet")
      return
    }
    const rpc = new RPC(provider)
    const receipt = await rpc.mintNft()
    console.log(receipt)
    setOutputTxt(JSON.stringify(["Message from RPC node", receipt], null, 2))
  }

  const signMessage = async () => {
    if (!provider) {
      console.log("provider not initialized yet")
      return
    }
    const rpc = new RPC(provider)
    const signedMessage = await rpc.signMessage()
    console.log(signedMessage)
  }

  const loggedInView = (
    <>
      <button onClick={getUserInfo} className="card">
        Get User Info
      </button>
      <button onClick={getChainId} className="card">
        Get Chain ID
      </button>
      <button onClick={getAccounts} className="card">
        Get Accounts
      </button>
      <button onClick={getBalance} className="card">
        Get Balance
      </button>
      <button onClick={writeContract} className="card">
        Write to contract
      </button>
      <button onClick={mintNft} className="card">
        Mint NFT
      </button>
      {/* <button onClick={signMessage} className="card">
        Sign Message
      </button> */}
      <button onClick={logout} className="card">
        Log Out
      </button>

      <div id="console" className="code" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}>{outputTxt}</p>
      </div>
    </>
  )

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  )

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
          Web3Auth + ERC2771 relay
        </a>
        & ReactJS Example
      </h1>

      <div className="grid">{provider ? loggedInView : unloggedInView}</div>
    </div>
  )
}

export default App
