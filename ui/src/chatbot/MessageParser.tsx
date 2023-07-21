import React, {cloneElement, FunctionComponent, ReactElement} from 'react';

interface MessageParserProps {
    children: ReactElement,
}

const MessageParser: FunctionComponent<MessageParserProps> = ({ children }) => {
    const parse = (message: string) => {
        console.log(message);
    };

    return (
        <div>
            {React.Children.map(children, (child) => {
                return cloneElement(child, {
                    parse: parse,
                    actions: {},
                });
            })}
        </div>
    );
};

export default MessageParser;