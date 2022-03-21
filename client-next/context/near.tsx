// import NearWalletSelector from "near-wallet-selector";
import dynamic from "next/dynamic";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";



type BuiltInWalletId = "near-wallet" | "sender-wallet" | "ledger-wallet";
type NetworkId = "mainnet" | "betanet" | "testnet";
type Theme = "dark" | "light" | "auto";

interface Options {
  // List of wallets you want to support in your dApp.
  wallets: Array<BuiltInWalletId>;
  // Network ID matching that of your dApp.
  networkId: NetworkId;
  contract: {
    // Account ID of the Smart Contract used for 'view' and 'signAndSendTransaction' calls.
    contractId: string;
    // Optional: Specify limited access to particular methods on the Smart Contract.
    methodNames?: Array<string>;
  };
  ui?: {
    // Optional: Specify light/dark theme for UI. Defaults to the browser configuration when
    // omitted or set to 'auto'.
    theme?: Theme;
    // Optional: Provides customisation description text in the UI.
    description?: string;
  };
}




type nearContextType = {
  accountId: string | null;
  isLoggedIn: boolean;
  wallet: object;
  view: (methodName: string, args?: any) => Promise<any>;
  hide: () => void;
  show: () => void;
  login: () => void;
  logout: () => void;
};

const nearContextDefaultValues: nearContextType = {
  accountId: null,
  isLoggedIn: false,
  wallet: {},
  view: () => Promise.resolve(),
  hide: () => { },
  show: () => { },
  login: () => { },
  logout: () => { },
};

const NearContext = createContext<nearContextType>(nearContextDefaultValues);

export function useNear() {
  return useContext(NearContext);
}

type Props = {
  children: ReactNode;
};

export function NearProvider({ children }: Props) {
  const [selector, setSelector] = useState<any>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [wallet, setWallet] = useState<object>({});

  useEffect(() => {
    const initWallet = async () => {
      const walletSelector = await import("near-wallet-selector")
      const NearWalletSelector = walletSelector.default
      const selector = new NearWalletSelector({
        networkId: "testnet",
        ui: {
          theme: "dark",
        },
        wallets: ["near-wallet", "sender-wallet", "ledger-wallet"],
        contract: { contractId: "dev-1642161678245-56022227209898" },
      });
      await selector.init();
      setSelector(selector);
      const handleSignIn = async () => {
        if (!selector) {
          return;
        }
        const account = await selector.getAccount();
        console.log("account", account);
        setIsLoggedIn(await selector.isSignedIn());
        setAccountId(account ? account.accountId : null);
      }
      handleSignIn();
      const subscription = selector.on("signIn", handleSignIn);
    }
    initWallet();
  }, []);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await selector.signOut();
    setIsLoggedIn(await selector.isSignedIn());
    setAccountId(null);
  };
  const show = () => {
    selector.show();
  };
  const hide = () => {
    selector.hide();
  };

  const view = async (methodName: string, args?: any) => {
    console.log("selector.contract", selector.contract)
    return await selector.contract.view({
      methodName,
      args: args
    });
  }

  async function get(account_id: string) {
    console.log("selector.contract", selector.contract)
    return await selector.contract.view({
      methodName: "get",
      args: { account_id }
    });
  }


  const value = {
    accountId,
    isLoggedIn,
    wallet,
    login,
    logout,
    show,
    hide,
    view
  };

  return (
    <>
      <NearContext.Provider value={value}>
        {children}
      </NearContext.Provider>
    </>
  );
}


export default NearProvider;