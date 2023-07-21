import { Button } from "react-bootstrap"
import { web3AuthModalPack } from "./safe"
import { useState } from "react";

const SafeWidget= () => {

    const [authKitSignData, setAuthKitSignData] = useState<any>(null)
    
    const openSafe = async () => {
        const authKitSignData = await web3AuthModalPack.signIn()
        setAuthKitSignData(authKitSignData)
    }

    return (
        <div>
            <Button onClick={() => openSafe()}>Login</Button>
            {authKitSignData && authKitSignData.safes && authKitSignData.safes.map((safe: any) => {
                return (
                    <div key={safe.safeAddress}>
                        <p>Safe Address: {safe.safeAddress}</p>
                        <p>Safe Name: {safe.safeName}</p>
                        <p>Safe Owner: {safe.safeOwner}</p>
                    </div>
                )
            }
        </div>
    );
};

export default SafeWidget;