import React, {cloneElement, FunctionComponent, ReactElement} from 'react';
import {Actions} from "./ActionProvider";

interface MessageParserProps {
    actions: Actions,
    children: ReactElement,
}

const MessageParser: FunctionComponent<MessageParserProps> = ({actions, children}) => {
    const parse = async (message: string) => {
        await actions.handleUserMessage(message);
    };

    return (
        <div>
            {React.Children.map(children, (child) => {
                return cloneElement(child, {
                    parse: parse,
                    actions,
                });
            })}
        </div>
    );
};

export default MessageParser;