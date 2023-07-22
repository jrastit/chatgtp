import {FunctionComponent} from "react";
import {Button} from "react-bootstrap";

interface ActionWidgetProps {
    payload: {
        name: string,
        arguments: string,
    },
}


const ActionWidget: FunctionComponent<ActionWidgetProps> = ({payload}) => {
    const processPayload = () => {
        const args = JSON.parse(payload.arguments);
        switch (payload.name) {
            case 'transfer':
                return {
                    label: `Transfer ${args.amount} ${args.token} to ${args.address}`,
                    onClick: () => {
                        console.log('do the transfer');
                    }
                };
            default:
                return {
                    label: `Transfer ${args.amount} ${args.token} to ${args.address}`,
                    onClick: () => {
                        console.log(`unknown action ${payload.name}`);
                    }
                };
        }
    };

    const {label, onClick} = processPayload();

    return (
        <Button onClick={onClick}>{label}</Button>
    );
};

export default ActionWidget;
