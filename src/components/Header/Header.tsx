import React from 'react'
import {Link} from 'react-router-dom'
import {APP_URL} from '@/configs/app-url.config'
import {Button} from '@/components/ui'
import {getCurrentUser} from '@/constants/mockData'

const Header: React.FC = () => {
	const currentUser = getCurrentUser()

	return (
		<header className='bg-white border-b border-gray-200'>
			<div className='container mx-auto px-4 py-3'>
				<div className='flex justify-between items-center'>
					<div className='flex items-center space-x-8'>
						<Link to={APP_URL.HOME} className='flex items-center space-x-2'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-8 w-8 text-blue-600'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							>
								<path d='M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z' />
								<path d='M12 18l-4-4h8l-4 4z' />
								<path d='M12 6v8' />
							</svg>
							<span className='text-xl font-bold text-gray-900'>
								TestAutomation
							</span>
						</Link>

						<nav className='hidden md:flex items-center space-x-4'>
							<Link
								to={APP_URL.HOME}
								className='text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium'
							>
								Dashboard
							</Link>
							<Link
								to='/projects'
								className='text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium'
							>
								Projects
							</Link>
							<Link
								to={APP_URL.TESTS}
								className='text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium'
							>
								Tests
							</Link>
							<Link
								to='/reports'
								className='text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium'
							>
								Reports
							</Link>
						</nav>
					</div>

					<div className='flex items-center space-x-4'>
						<Button variant='outline' size='sm'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5 mr-1'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							>
								<path d='M12 5v14M5 12h14' />
							</svg>
							New Test
						</Button>

						<div className='relative'>
							<button className='flex items-center space-x-2 text-sm focus:outline-none'>
								<div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium'>
									{currentUser.username.charAt(0).toUpperCase()}
								</div>
								<span className='hidden md:inline-block font-medium'>
									{currentUser.username}
								</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</header>
	)
}

export default Header
