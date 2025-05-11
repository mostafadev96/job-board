import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import ApplicationRouter from './routes/application-router';
import { AuthProvider } from './contexts/auth-context';
import { setContext } from '@apollo/client/link/context';
import { getStoredUser } from './utils/auth-util';

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = getStoredUser()?.access_token; // or sessionStorage, or from a context

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
      <ApolloProvider client={client}>
        <ApplicationRouter />
      </ApolloProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
