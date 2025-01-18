import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as Provider,
} from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Replace with your server's URL
  cache: new InMemoryCache(),
});

const ApolloProvider = ({children}) => (
  <Provider client={client}>{children}</Provider>
);

export default ApolloProvider;
