import React, {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {Button, Input, ActionButton, PlusIcon} from '@/components/ui'
import ProjectCard from '@/components/ProjectCard/ProjectCard'
import {useProjectStore} from '@/store'
import {APP_URL} from '@/configs/app-url.config'

const ProjectsView: React.FC = () => {
	const navigate = useNavigate()
	const {projects, fetchProjects} = useProjectStore()

	useEffect(() => {
		fetchProjects()
	}, [fetchProjects])

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-gray-900'>Projects</h1>
				<ActionButton
					icon={<PlusIcon />}
					onClick={() => navigate(APP_URL.NEW_PROJECT)}
				>
					Create New Project
				</ActionButton>
			</div>

			<div className='bg-white rounded-lg border border-gray-200 p-4'>
				<div className='flex flex-col md:flex-row gap-4'>
					<div className='flex-grow'>
						<Input id='search' placeholder='Search projects...' type='search' />
					</div>
					<div className='flex gap-2'>
						<Button variant='outline'>Filter</Button>
						<Button variant='outline'>Sort</Button>
					</div>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{projects.map((project) => (
					<ProjectCard
						key={project.id}
						project={project}
						onClick={(project) => navigate(`/projects/${project.id}`)}
					/>
				))}

				{projects.length === 0 && (
					<div className='col-span-3 text-center py-12'>
						<p className='text-gray-500'>
							No projects found. Create your first project to get started.
						</p>
						<ActionButton
							icon={<PlusIcon />}
							className='mt-4'
							onClick={() => navigate(APP_URL.NEW_PROJECT)}
						>
							Create New Project
						</ActionButton>
					</div>
				)}
			</div>
		</div>
	)
}

export default ProjectsView
