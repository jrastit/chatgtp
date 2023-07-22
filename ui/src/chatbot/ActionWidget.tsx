import {FunctionComponent} from "react";
import {Button} from "react-bootstrap";
import Biconomy from "../biconomy/Biconomy";
import SafeWidget from "../safe/SafeWidget";
import {IContext} from "../type/blockchain";

interface ActionWidgetProps {
    payload: {
        name: string,
        arguments: string,
    },
    setContext: (context: IContext) => void,
    getContext: () => IContext,
}

const ActionWidget: FunctionComponent<ActionWidgetProps> = ({payload, setContext, getContext}) => {
    const processPayload = () => {
        const args = JSON.parse(payload.arguments);
        switch (payload.name) {
            case 'transfer':
                return (
                    <Button
                        onClick={() => console.log('do transfer')}
                    >
                        {`Transfer ${args.amount} ${args.token} to ${args.address}`}
                    </Button>
                );
            case 'connectWallet':
                return (
                    <>
                        <Biconomy context={getContext()} setContext={setContext} chainId={5}/>
                        <SafeWidget/>
                    </>
                );
            default:
                return <div>{`Unknown action ${payload.name}`}</div>;
        }
    };

    return processPayload();
};

export default ActionWidget;
