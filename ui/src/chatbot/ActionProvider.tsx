import React, {cloneElement, FunctionComponent, ReactElement} from 'react';

interface ActionProviderProps {
    children: ReactElement,
}

const ActionProvider: FunctionComponent<ActionProviderProps> = ({children}) => {
    return (
        <div>
            {React.Children.map(children, (child) => {
                return cloneElement(child, {
                    actions: {},
                });
            })}
        </div>
    );
};

export default ActionProvider;
