import {createRoot} from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';

import App from "./App";

const client = new ApolloClient({
    uri: 'https://api.airstack.xyz/gql',
    cache: new InMemoryCache(),
});

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <ApolloProvider client={client}>
            <App/>
        </ApolloProvider>
    );
}


