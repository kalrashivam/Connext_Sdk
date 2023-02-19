import { create, SdkConfig } from "@connext/sdk";
import { ethers, Wallet } from "ethers";

let mnemonic: string;
if (!process.env.MNEMONIC) {
    throw new Error("Please set your MNEMONIC in a .env file");
} else {
    mnemonic = process.env.MNEMONIC;
}

const connextDomain: { [key: number]: number} = {
    5: 1735353714,
    420: 1735356532,
    80001: 9991,
    421613: 421613
}

enum ChainId {
    GOERLI = 5,
    OPTIMISM = 420,
    MUMBAI = 80001,
    ARBITRUM = 421613
}

export const providerUrls: Record<number, string> = {
    [ChainId.OPTIMISM]: 'https://opt-goerli.g.alchemy.com/v2/ZIZkXJUsv7NZ0UkYgtXhVT3IikhTqjNq',
    [ChainId.GOERLI]: 'https://goerli.infura.io/v3/2a03dbc0d02945709182ed26b52cffd5',
    [ChainId.MUMBAI]: 'https://polygon-mumbai.g.alchemy.com/v2/LWVjQQnv7tndzlugPWpFMDxDG--F7NYH',
    [ChainId.ARBITRUM]: 'https://arb-goerli.g.alchemy.com/v2/4roOugVBSjCuI0vXsAWVR4c__GN40Z0v'
}


export const getRelayerFee = async (fromChain:number, toChain:number): Promise<string> => {
  // Instantiate a Wallet object using your private key (i.e. from Metamask) and use it as a Signer.
  const wallet = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/1`);

  // Connext to a Provider on the sending chain. You can use a provider like Infura (https://infura.io/) or Alchemy (https://www.alchemy.com/).
  const provider = new ethers.providers.JsonRpcProvider(providerUrls[fromChain]);
  const signer = wallet.connect(provider);
  const signerAddress = await signer.getAddress();
  const originDomain = connextDomain[fromChain];
  const destinationDomain = connextDomain[toChain];

  // Construct the `SdkConfig`. You can reference chain IDs in the "Resources" tab of the docs.
  const sdkConfig: SdkConfig = {
    signerAddress: signerAddress,
    network: "testnet", // can be "mainnet" or "testnet"
    chains: {
      [originDomain]: {
        providers: [providerUrls[fromChain]],
      },
      [destinationDomain]: {
        providers: [providerUrls[toChain]],
      },
    },
  };

  // Create the SDK instance.
  const {sdkBase} = await create(sdkConfig);

  // Estimate the relayer fee
  const relayerFee = (await sdkBase.estimateRelayerFee({originDomain: originDomain.toString(), destinationDomain: destinationDomain.toString()})).toString();
  return relayerFee
}
