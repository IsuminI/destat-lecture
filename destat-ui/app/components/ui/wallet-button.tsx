import { useAccount, useDisconnect } from "wagmi";
import { Button } from "./button";
import { rabbykit } from "~/root";

export default function WalletButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  console.log(isConnected);
  return (
    <div>
      {isConnected ? (
        <Button onClick={() => disconnect()}>Disconnect</Button>
      ) : (
        <Button onClick={() => rabbykit.open()}>Connect</Button>
      )}
    </div>
  );
}
