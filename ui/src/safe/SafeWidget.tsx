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
                    <div key={safe}>
                        <p>Safe Address: {safe}</p>
                    </div>
                )
            })}
        </div>
    );
};

export default SafeWidget;