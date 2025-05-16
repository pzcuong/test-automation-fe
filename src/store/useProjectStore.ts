import {create} from 'zustand'
import {
	Project,
	TestCase,
	TestCaseType,
	TestStatus,
	TestStep,
	TestSuite,
} from '@/types/common.types'
import {mockProjects} from '@/constants/mockData'

interface ProjectState {
	projects: Project[]
	selectedProject: Project | null
	selectedTestSuite: TestSuite | null
	selectedTestCase: TestCase | null

	// Actions
	fetchProjects: () => void
	createProject: (
		project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'testSuites'>
	) => string
	selectProject: (projectId: string) => void
	selectTestSuite: (testSuiteId: string) => void
	selectTestCase: (testCaseId: string) => void
	clearSelection: () => void

	// Test Case CRUD operations
	createTestCase: (
		testSuiteId: string,
		testCase: Omit<TestCase, 'id' | 'createdAt' | 'updatedAt' | 'testSuiteId'>
	) => string
	updateTestCase: (
		testCaseId: string,
		updates: Partial<
			Omit<TestCase, 'id' | 'createdAt' | 'updatedAt' | 'testSuiteId'>
		>
	) => void
	deleteTestCase: (testCaseId: string) => void

	// Test Step CRUD operations
	addTestStep: (
		testCaseId: string,
		step: Omit<TestStep, 'id' | 'testCaseId'>
	) => string
	updateTestStep: (
		testCaseId: string,
		stepId: string,
		updates: Partial<Omit<TestStep, 'id' | 'testCaseId'>>
	) => void
	deleteTestStep: (testCaseId: string, stepId: string) => void
	reorderTestSteps: (testCaseId: string, reorderedSteps: TestStep[]) => void

	// AI Test Generation
	generateTestCaseWithAI: (
		testSuiteId: string,
		prompt: string,
		dependencies?: string[]
	) => Promise<string>
}

export const useProjectStore = create<ProjectState>((set, get) => ({
	projects: [],
	selectedProject: null,
	selectedTestSuite: null,
	selectedTestCase: null,

	fetchProjects: () => {
		// In a real app, this would be an API call
		set({projects: mockProjects})
	},

	createProject: (project) => {
		const {projects} = get()
		const now = new Date().toISOString()
		const newProjectId = `project-${Date.now()}`

		const newProject: Project = {
			id: newProjectId,
			createdAt: now,
			updatedAt: now,
			testSuites: [
				{
					id: `suite-${Date.now()}`,
					name: 'Default Test Suite',
					description: 'Default test suite created with the project',
					testCases: [],
				},
			],
			...project,
		}

		set({
			projects: [...projects, newProject],
			selectedProject: newProject,
		})

		return newProjectId
	},

	selectProject: (projectId: string) => {
		const {projects} = get()
		const project = projects.find((p) => p.id === projectId) || null
		set({
			selectedProject: project,
			selectedTestSuite: null,
			selectedTestCase: null,
		})
	},

	selectTestSuite: (testSuiteId: string) => {
		const {selectedProject} = get()
		if (!selectedProject) return

		const testSuite =
			selectedProject.testSuites.find((ts) => ts.id === testSuiteId) || null
		set({
			selectedTestSuite: testSuite,
			selectedTestCase: null,
		})
	},

	selectTestCase: (testCaseId: string) => {
		const {selectedProject} = get()
		if (!selectedProject) return

		// Find the test suite that contains this test case
		for (const suite of selectedProject.testSuites) {
			const testCase = suite.testCases.find((tc) => tc.id === testCaseId)
			if (testCase) {
				set({
					selectedTestSuite: suite,
					selectedTestCase: testCase,
				})
				return
			}
		}
	},

	clearSelection: () => {
		set({
			selectedProject: null,
			selectedTestSuite: null,
			selectedTestCase: null,
		})
	},

	createTestCase: (testSuiteId: string, testCase) => {
		const {projects} = get()
		const now = new Date().toISOString()
		const newTestCaseId = `tc-${Date.now()}`

		const updatedProjects = projects.map((project) => {
			const updatedTestSuites = project.testSuites.map((suite) => {
				if (suite.id === testSuiteId) {
					return {
						...suite,
						testCases: [
							...suite.testCases,
							{
								id: newTestCaseId,
								createdAt: now,
								updatedAt: now,
								testSuiteId,
								steps: [],
								...testCase,
							},
						],
					}
				}
				return suite
			})

			return {
				...project,
				testSuites: updatedTestSuites,
			}
		})

		set({projects: updatedProjects})
		return newTestCaseId
	},

	updateTestCase: (testCaseId: string, updates) => {
		const {projects} = get()
		const now = new Date().toISOString()

		const updatedProjects = projects.map((project) => {
			const updatedTestSuites = project.testSuites.map((suite) => {
				const updatedTestCases = suite.testCases.map((testCase) => {
					if (testCase.id === testCaseId) {
						return {
							...testCase,
							...updates,
							updatedAt: now,
						}
					}
					return testCase
				})

				return {
					...suite,
					testCases: updatedTestCases,
				}
			})

			return {
				...project,
				testSuites: updatedTestSuites,
			}
		})

		set({projects: updatedProjects})

		// Update selected test case if it's the one being updated
		const {selectedTestCase} = get()
		if (selectedTestCase && selectedTestCase.id === testCaseId) {
			set({
				selectedTestCase: {
					...selectedTestCase,
					...updates,
					updatedAt: now,
				},
			})
		}
	},

	deleteTestCase: (testCaseId: string) => {
		const {projects, selectedTestCase} = get()

		const updatedProjects = projects.map((project) => {
			const updatedTestSuites = project.testSuites.map((suite) => {
				return {
					...suite,
					testCases: suite.testCases.filter((tc) => tc.id !== testCaseId),
				}
			})

			return {
				...project,
				testSuites: updatedTestSuites,
			}
		})

		set({projects: updatedProjects})

		// Clear selection if the deleted test case was selected
		if (selectedTestCase && selectedTestCase.id === testCaseId) {
			set({selectedTestCase: null})
		}
	},

	addTestStep: (testCaseId: string, step) => {
		const {projects} = get()
		const stepId = `step-${Date.now()}`

		const updatedProjects = projects.map((project) => {
			const updatedTestSuites = project.testSuites.map((suite) => {
				const updatedTestCases = suite.testCases.map((testCase) => {
					if (testCase.id === testCaseId) {
						// Calculate the next order number
						const nextOrder =
							testCase.steps.length > 0
								? Math.max(...testCase.steps.map((s) => s.order)) + 1
								: 1

						return {
							...testCase,
							steps: [
								...testCase.steps,
								{
									id: stepId,
									testCaseId,
									order: step.order || nextOrder,
									...step,
								},
							],
							updatedAt: new Date().toISOString(),
						}
					}
					return testCase
				})

				return {
					...suite,
					testCases: updatedTestCases,
				}
			})

			return {
				...project,
				testSuites: updatedTestSuites,
			}
		})

		set({projects: updatedProjects})

		// Update selected test case if it's the one being updated
		const {selectedTestCase} = get()
		if (selectedTestCase && selectedTestCase.id === testCaseId) {
			const nextOrder =
				selectedTestCase.steps.length > 0
					? Math.max(...selectedTestCase.steps.map((s) => s.order)) + 1
					: 1

			set({
				selectedTestCase: {
					...selectedTestCase,
					steps: [
						...selectedTestCase.steps,
						{
							id: stepId,
							testCaseId,
							order: step.order || nextOrder,
							...step,
						},
					],
					updatedAt: new Date().toISOString(),
				},
			})
		}

		return stepId
	},

	updateTestStep: (testCaseId: string, stepId: string, updates) => {
		const {projects} = get()

		const updatedProjects = projects.map((project) => {
			const updatedTestSuites = project.testSuites.map((suite) => {
				const updatedTestCases = suite.testCases.map((testCase) => {
					if (testCase.id === testCaseId) {
						const updatedSteps = testCase.steps.map((step) => {
							if (step.id === stepId) {
								return {
									...step,
									...updates,
								}
							}
							return step
						})

						return {
							...testCase,
							steps: updatedSteps,
							updatedAt: new Date().toISOString(),
						}
					}
					return testCase
				})

				return {
					...suite,
					testCases: updatedTestCases,
				}
			})

			return {
				...project,
				testSuites: updatedTestSuites,
			}
		})

		set({projects: updatedProjects})

		// Update selected test case if it's the one being updated
		const {selectedTestCase} = get()
		if (selectedTestCase && selectedTestCase.id === testCaseId) {
			const updatedSteps = selectedTestCase.steps.map((step) => {
				if (step.id === stepId) {
					return {
						...step,
						...updates,
					}
				}
				return step
			})

			set({
				selectedTestCase: {
					...selectedTestCase,
					steps: updatedSteps,
					updatedAt: new Date().toISOString(),
				},
			})
		}
	},

	deleteTestStep: (testCaseId: string, stepId: string) => {
		const {projects} = get()

		const updatedProjects = projects.map((project) => {
			const updatedTestSuites = project.testSuites.map((suite) => {
				const updatedTestCases = suite.testCases.map((testCase) => {
					if (testCase.id === testCaseId) {
						return {
							...testCase,
							steps: testCase.steps.filter((step) => step.id !== stepId),
							updatedAt: new Date().toISOString(),
						}
					}
					return testCase
				})

				return {
					...suite,
					testCases: updatedTestCases,
				}
			})

			return {
				...project,
				testSuites: updatedTestSuites,
			}
		})

		set({projects: updatedProjects})

		// Update selected test case if it's the one being updated
		const {selectedTestCase} = get()
		if (selectedTestCase && selectedTestCase.id === testCaseId) {
			set({
				selectedTestCase: {
					...selectedTestCase,
					steps: selectedTestCase.steps.filter((step) => step.id !== stepId),
					updatedAt: new Date().toISOString(),
				},
			})
		}
	},

	reorderTestSteps: (testCaseId: string, reorderedSteps: TestStep[]) => {
		const {projects} = get()
		const now = new Date().toISOString()

		const updatedProjects = projects.map((project) => {
			const updatedTestSuites = project.testSuites.map((suite) => {
				const updatedTestCases = suite.testCases.map((testCase) => {
					if (testCase.id === testCaseId) {
						return {
							...testCase,
							steps: reorderedSteps,
							updatedAt: now,
						}
					}
					return testCase
				})

				return {
					...suite,
					testCases: updatedTestCases,
				}
			})

			return {
				...project,
				testSuites: updatedTestSuites,
			}
		})

		set({projects: updatedProjects})

		// Update selected test case if it's the one being updated
		const {selectedTestCase} = get()
		if (selectedTestCase && selectedTestCase.id === testCaseId) {
			set({
				selectedTestCase: {
					...selectedTestCase,
					steps: reorderedSteps,
					updatedAt: now,
				},
			})
		}
	},

	generateTestCaseWithAI: async (
		testSuiteId: string,
		prompt: string,
		dependencies?: string[]
	) => {
		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 1500))

		// In a real app, this would call an AI service
		const now = new Date().toISOString()
		const newTestCaseId = `tc-${Date.now()}`

		// Find dependent test cases if any
		let dependentTestCases: TestCase[] = []
		if (dependencies && dependencies.length > 0) {
			const {projects} = get()

			// Find all dependent test cases
			projects.forEach((project) => {
				project.testSuites.forEach((suite) => {
					suite.testCases.forEach((tc) => {
						if (dependencies.includes(tc.id)) {
							dependentTestCases.push(tc)
						}
					})
				})
			})
		}

		// Generate sample shared data if there are dependencies
		const sharedData: Record<string, any> = {}
		if (dependentTestCases.length > 0) {
			// Example: If this is a product-related test case, share product data
			if (prompt.toLowerCase().includes('product')) {
				sharedData.productId = `prod-${Date.now()}`
				sharedData.productName = 'Sample Product'
				sharedData.productPrice = 99.99
				sharedData.productDescription = 'This is a sample product for testing'
			}

			// Example: If this is an order-related test case, share order data
			if (prompt.toLowerCase().includes('order')) {
				sharedData.orderId = `order-${Date.now()}`
				sharedData.orderTotal = 99.99
				sharedData.orderItems = [
					{name: 'Sample Product', price: 99.99, quantity: 1},
				]
			}

			// Example: If this is a user-related test case, share user data
			if (
				prompt.toLowerCase().includes('user') ||
				prompt.toLowerCase().includes('login')
			) {
				sharedData.userId = `user-${Date.now()}`
				sharedData.username = 'testuser'
				sharedData.email = 'testuser@example.com'
			}
		}

		// Generate a sample test case based on the prompt
		const generatedTestCase: TestCase = {
			id: newTestCaseId,
			name: `AI Generated: ${prompt.slice(0, 30)}...`,
			description: `This test case was automatically generated based on the prompt: "${prompt}"`,
			type: TestCaseType.POSITIVE,
			status: TestStatus.DRAFT,
			createdAt: now,
			updatedAt: now,
			testSuiteId,
			dependencies,
			sharedData: Object.keys(sharedData).length > 0 ? sharedData : undefined,
			steps: [
				{
					id: `step-${Date.now()}-1`,
					order: 1,
					action: 'navigate',
					selector: 'https://example.com',
					testCaseId: newTestCaseId,
				},
				{
					id: `step-${Date.now()}-2`,
					order: 2,
					action: 'click',
					selector: '.login-button',
					testCaseId: newTestCaseId,
				},
				{
					id: `step-${Date.now()}-3`,
					order: 3,
					action: 'fill',
					selector: '#username',
					value: 'testuser',
					testCaseId: newTestCaseId,
				},
				{
					id: `step-${Date.now()}-4`,
					order: 4,
					action: 'fill',
					selector: '#password',
					value: 'password123',
					testCaseId: newTestCaseId,
				},
				{
					id: `step-${Date.now()}-5`,
					order: 5,
					action: 'click',
					selector: 'button[type="submit"]',
					testCaseId: newTestCaseId,
				},
				{
					id: `step-${Date.now()}-6`,
					order: 6,
					action: 'assert',
					selector: '.welcome-message',
					expectedOutcome: 'Welcome to your account',
					testCaseId: newTestCaseId,
				},
			],
		}

		// Add steps that use shared data from dependencies if applicable
		if (dependentTestCases.length > 0) {
			// Example: If this is an order test and depends on a product test
			const productDependency = dependentTestCases.find((tc) =>
				tc.name.toLowerCase().includes('product')
			)

			if (productDependency && prompt.toLowerCase().includes('order')) {
				// Add steps that verify product data consistency
				generatedTestCase.steps.push({
					id: `step-${Date.now()}-7`,
					order: 7,
					action: 'assert',
					selector: '.product-price',
					expectedOutcome: '$99.99', // Should match the price from the product test
					testCaseId: newTestCaseId,
				})

				// Add a note about data consistency in the description
				generatedTestCase.description +=
					'\n\nThis test case verifies data consistency with the product test case.'
			}
		}

		// Add the generated test case to the store
		const {projects} = get()

		const updatedProjects = projects.map((project) => {
			const updatedTestSuites = project.testSuites.map((suite) => {
				if (suite.id === testSuiteId) {
					return {
						...suite,
						testCases: [...suite.testCases, generatedTestCase],
					}
				}
				return suite
			})

			return {
				...project,
				testSuites: updatedTestSuites,
			}
		})

		set({projects: updatedProjects})
		return newTestCaseId
	},
}))
