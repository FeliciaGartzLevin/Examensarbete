import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'
import { AuthContextProvider } from './contexts/AuthContextProvider.tsx'
import { PreferencesContextProvider } from './contexts/PreferencesContextProvider.tsx'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: 1000 * 60 * 15, // 15 minutes
		}
	}
})

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<AuthContextProvider>
					<PreferencesContextProvider>
						<App />
					</PreferencesContextProvider>
				</AuthContextProvider>
			</BrowserRouter>
		</QueryClientProvider>
	</React.StrictMode>,
)
