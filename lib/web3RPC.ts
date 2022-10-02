import type { SafeEventEmitterProvider } from "@web3auth/base"
import Web3 from "web3"
import { ERC721ABI } from "../constants/abi"
import { HelloWriter, NFTest } from "../constants/deployments"

export type ExternalProvider = {
  isMetaMask?: boolean
  isStatus?: boolean
  host?: string
  path?: string
  sendAsync?: (request: { method: string; params?: Array<any> }, callback: (error: any, response: any) => void) => void
  send?: (request: { method: string; params?: Array<any> }, callback: (error: any, response: any) => void) => void
  request?: (request: { method: string; params?: Array<any> }) => Promise<any>
}

export default class EthereumRpc {
  private provider: ExternalProvider

  constructor(provider: ExternalProvider) {
    this.provider = provider
  }

  async getChainId(): Promise<string> {
    try {
      const web3 = new Web3(this.provider as any)

      // Get the connected Chain's ID
      const chainId = await web3.eth.getChainId()

      return chainId.toString()
    } catch (error) {
      return error as string
    }
  }

  async getAccounts(): Promise<any> {
    try {
      const web3 = new Web3(this.provider as any)

      // Get user's Ethereum public address
      const address = (await web3.eth.getAccounts())[0]

      return address
    } catch (error) {
      return error
    }
  }

  async getBalance(): Promise<string> {
    try {
      const web3 = new Web3(this.provider as any)

      // Get user's Ethereum public address
      const address = (await web3.eth.getAccounts())[0]

      // Get user's balance in ether
      const balance = web3.utils.fromWei(
        await web3.eth.getBalance(address) // Balance is in wei
      )

      return balance
    } catch (error) {
      return error as string
    }
  }

  async sendTransaction(): Promise<any> {
    try {
      const web3 = new Web3(this.provider as any)

      // Get user's Ethereum public address
      const fromAddress = (await web3.eth.getAccounts())[0]

      const destination = fromAddress

      const amount = web3.utils.toWei("0.001") // Convert 1 ether to wei

      // Submit transaction to the blockchain and wait for it to be mined
      const receipt = await web3.eth.sendTransaction({
        from: fromAddress,
        to: destination,
        value: amount,
        maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
        maxFeePerGas: "6000000000000", // Max fee per gas
      })

      return receipt
    } catch (error) {
      return error as string
    }
  }

  async signMessage() {
    try {
      const web3 = new Web3(this.provider as any)

      // Get user's Ethereum public address
      const fromAddress = (await web3.eth.getAccounts())[0]

      const originalMessage = "YOUR_MESSAGE"

      // Sign the message
      const signedMessage = await web3.eth.personal.sign(
        originalMessage,
        fromAddress,
        "test password!" // configure your own password here.
      )

      return signedMessage
    } catch (error) {
      return error as string
    }
  }

  async mintNft(): Promise<any> {
    try {
      const web3 = new Web3(this.provider as any)
      const selfAddress = (await web3.eth.getAccounts())[0]
      const nfTestContract = new web3.eth.Contract(ERC721ABI as any, NFTest)

      const receipt = await nfTestContract.methods.safeMint(selfAddress).send({
        from: selfAddress,
      })

      return receipt
    } catch (error) {
      return error as string
    }
  }

  async writeContract(): Promise<any> {
    const web3 = new Web3(this.provider as any)
    const fromAddress = (await web3.eth.getAccounts())[0]

    const contractABI =
      '[ { "inputs": [ { "internalType": "string", "name": "initMessage", "type": "string" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "string", "name": "newMessage", "type": "string" } ], "name": "update", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "message", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" } ]'
    const contractAddress = HelloWriter
    const contract = new web3.eth.Contract(JSON.parse(contractABI), contractAddress)
    // Send transaction to smart contract to update message and wait to finish
    const receipt = await contract.methods.update("Journey to Web3Auth begins.").send({
      from: fromAddress,
    })
    return receipt
  }
}
