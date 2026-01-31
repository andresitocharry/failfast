
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
    link: new HttpLink({
        uri: 'https://oriented-elephant-77.hasura.app/v1/graphql',
        headers: {
            'x-hasura-admin-secret': 'bg3K9tO9BfSf6uD3Go5Ob6NeLN1jjQgzQYdB30sbCxEXTBjIdP4N755zfwlSlf7B',
        }
    }),
    cache: new InMemoryCache(),
});

export default client;
