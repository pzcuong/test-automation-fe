import {Navigate} from 'react-router-dom'
import {APP_URL} from '@/configs/app-url.config'

const HomePage = () => {
	// Redirect to dashboard
	return <Navigate to={APP_URL.HOME} replace />
}

export default HomePage
