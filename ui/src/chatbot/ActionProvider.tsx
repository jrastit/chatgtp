import React, {cloneElement, FunctionComponent, ReactElement, useRef} from 'react';
import {IMessageOptions} from "react-chatbot-kit/src/interfaces/IMessages";
import {mint_gold, transfer_gold} from "../action/action";
import {IContext} from "../type/blockchain";
import {getGoldBalance} from "../action/view";

interface StateItem {
    [key: string]: any,
}

interface BotState {
    messages: StateItem[]
}

export interface ActionProviderPropsBase {
    createChatBotMessage: (message: string, options: IMessageOptions) => any,
    setState: (fun: (prev: BotState) => BotState) => void,
    children: ReactElement,
}

interface ActionProviderProps extends ActionProviderPropsBase {
    setContext: (context: IContext) => void,
    getContext: () => IContext,
}

export interface Actions {
    handleUserMessage: (message: string) => Promise<void>;
}

interface HistoryItem {
    role: string,
    content: string | null,
    function_call?: {
        name: string,
        arguments: string,
    } | undefined,
}

const ActionProvider: FunctionComponent<ActionProviderProps> = ({
                                                                    createChatBotMessage,
                                                                    setState,
                                                                    setContext,
                                                                    getContext,
                                                                    children
                                                                }) => {
    const history = useRef<HistoryItem[]>([]);

    const handleUserMessage: Actions['handleUserMessage'] = async (message: string) => {
        history.current.push({role: 'user', content: message});
        const chatBotMessage = createChatBotMessage('', {loading: true, delay: 500});
        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, chatBotMessage],
        }));

        const botResponse = await fetch('/api/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: history.current,
            }),
        });
        const {answer} = (await botResponse.json()) as { answer: HistoryItem };
        history.current.push(answer);

        if (answer.function_call) {
            const args = JSON.parse(answer.function_call.arguments);
            if (answer.function_call.name === 'mint') {
                if (args.token.toUpperCase() !== 'GOLD') {
                    chatBotMessage.message = 'I can only mint GOLD for now';
                } else {
                    chatBotMessage.message = `Mint in progress...`;
                    (async () => {
                        await mint_gold(args.amount, null, getContext(), 5);
                        const callbackMessage = createChatBotMessage(`${args.amount} ${args.token} have been minted in your wallet`, {delay: 0});
                        setState((prev) => ({
                            ...prev,
                            messages: [...prev.messages, callbackMessage],
                        }));
                        setContext(getContext());
                    })();
                }
            } else if (answer.function_call.name === 'transfer') {
                if (args.token.toUpperCase() !== 'GOLD') {
                    chatBotMessage.message = 'I can only mint GOLD for now';
                } else {
                    chatBotMessage.message = 'I have prepared the transaction for you, click to validate it';
                    chatBotMessage.widget = 'actionWidget';
                    chatBotMessage.payload = {
                        name: answer.function_call.name,
                        args,
                        action: async () => {
                            try {
                                await transfer_gold(args.amount, args.address, null, getContext(), 5);
                                const callbackMessage = createChatBotMessage(`${args.amount} ${args.token} have been transferred to ${args.address}`, {delay: 0});
                                setState((prev) => ({
                                    ...prev,
                                    messages: [...prev.messages, callbackMessage],
                                }));
                            } catch (e) {
                                const callbackMessage = createChatBotMessage(`Error occured during transfer : ${e.message}`, {delay: 0});
                                setState((prev) => ({
                                    ...prev,
                                    messages: [...prev.messages, callbackMessage],
                                }));
                            }
                        },
                    };
                }
            } else if (answer.function_call.name === 'showWallet') {
                chatBotMessage.message = 'Here is your wallet';
                const context = getContext();
                context.otherWalletAddress = args.address;
                setContext(context);
            } else if (answer.function_call.name === 'showBalance') {
                const allWallets = getContext().blockchainList.flatMap((b) => b.walletList);
                const allAddresses = allWallets.map((w) => w.address);
                const ownerFromContext = allAddresses[0];
                if (ownerFromContext) {
                    const bal = (await getGoldBalance(ownerFromContext, getContext(), 5)).toString();
                    chatBotMessage.message = `Your balance is ${bal} GOLD`;
                    if (Number(bal) > 1000000) {
                        const callbackMessage = createChatBotMessage(`You are rich 💸`, {});
                        setState((prev) => ({
                            ...prev,
                            messages: [...prev.messages, callbackMessage],
                        }));
                    }
                } else {
                    chatBotMessage.message = 'You need to connect your wallet first';
                }
            }
        } else {
            chatBotMessage.message = answer.content;
        }
        chatBotMessage.loading = false;
        setState((prev) => ({...prev}));
    };

    return (
        <div>
            {React.Children.map(children, (child) => {
                return cloneElement(child, {
                    actions: {
                        handleUserMessage,
                    },
                });
            })}
        </div>
    );
};

export default ActionProvider;
