import { Button } from "react-bootstrap"
import { web3AuthModalPack } from "./safe"
import { useState } from "react";

const SafeWidget= () => {

    const [authKitSignData, setAuthKitSignData] = useState<any>(null)
    
    const openSafe = async () => {
        const authKitSignData = await web3AuthModalPack.signIn()
        setAuthKitSignData(authKitSignData)
    }

    const closeSafe = async () => {
        await web3AuthModalPack.signOut()
        setAuthKitSignData(null)
    }

    return (
        <div>
            {!authKitSignData &&
                <Button onClick={() => openSafe()}>Login</Button>
            }
            
            {!!authKitSignData &&
                <Button onClick={() => closeSafe()}>Logout</Button>
            }
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