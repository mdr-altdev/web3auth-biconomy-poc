import type { SafeEventEmitterProvider } from "@web3auth/base"
import { ethers } from "ethers"
import { ERC721ABI } from "../constants/abi"
import { NFTest } from "../constants/deployments"

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

  async getChainId(): Promise<any> {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(this.provider)
      // Get the connected Chain's ID
      const networkDetails = await ethersProvider.getNetwork()
      return networkDetails.chainId
    } catch (error) {
      return error
    }
  }

  async getAccounts(): Promise<any> {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(this.provider)
      const signer = ethersProvider.getSigner()

      // Get user's Ethereum public address
      const address = await signer.getAddress()

      return address
    } catch (error) {
      return error
    }
  }

  async getBalance(): Promise<string> {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(this.provider)
      const signer = ethersProvider.getSigner()

      // Get user's Ethereum public address
      const address = await signer.getAddress()

      // Get user's balance in ether
      const balance = ethers.utils.formatEther(
        await ethersProvider.getBalance(address) // Balance is in wei
      )

      return balance
    } catch (error) {
      return error as string
    }
  }

  async sendTransaction(): Promise<any> {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(this.provider)
      const signer = ethersProvider.getSigner()

      const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56"

      // Convert 1 ether to wei
      const amount = ethers.utils.parseEther("0.001")

      // Submit transaction to the blockchain
      const tx = await signer.sendTransaction({
        to: destination,
        value: amount,
        maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
        maxFeePerGas: "6000000000000", // Max fee per gas
      })

      // Wait for transaction to be mined
      const receipt = await tx.wait()

      return receipt
    } catch (error) {
      return error as string
    }
  }

  async mintNft(): Promise<any> {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(this.provider)
      const signer = ethersProvider.getSigner()

      const selfAddress = await signer.getAddress()
      const nfTestContract = new ethers.Contract(NFTest, ERC721ABI, signer)
      const tx = await nfTestContract.safeMint(selfAddress)

      // const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56";

      // // Convert 1 ether to wei
      // const amount = ethers.utils.parseEther("0.001");

      // Submit transaction to the blockchain
      // const tx = await signer.sendTransaction({
      //   to: destination,
      //   value: amount,
      //   maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
      //   maxFeePerGas: "6000000000000", // Max fee per gas
      // });

      // Wait for transaction to be mined
      const receipt = await tx.wait()

      return receipt
    } catch (error) {
      return error as string
    }
  }

  async signMessage() {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(this.provider)
      const signer = ethersProvider.getSigner()

      const originalMessage = "YOUR_MESSAGE"

      // Sign the message
      const signedMessage = await signer.signMessage(originalMessage)

      return signedMessage
    } catch (error) {
      return error as string
    }
  }
}
