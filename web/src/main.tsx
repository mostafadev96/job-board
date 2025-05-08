import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import ApplicationRouter from './routes/application-router';
import { AuthProvider } from './contexts/auth-context';


// const client = new ApolloClient({
//   uri: `${process.env.REACT_APP_BASE_URL}/graphql`,
//   cache: new InMemoryCache(),
// });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
      {/* <ApolloProvider client={client}> */}
        <ApplicationRouter />
      {/* </ApolloProvider> */}
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
