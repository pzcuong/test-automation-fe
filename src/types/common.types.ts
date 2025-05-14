// User related interfaces
export interface User {
	id: string
	username: string
	email: string
	role: UserRole
	createdAt: string
	lastLogin?: string
}

export enum UserRole {
	ADMIN = 'admin',
	TESTER = 'tester',
	DEVELOPER = 'developer',
	VIEWER = 'viewer',
}

// Project related interfaces
export interface Project {
	id: string
	name: string
	description: string
	createdAt: string
	updatedAt: string
	ownerId: string
	teamMembers: string[] // User IDs
	testSuites: TestSuite[]
}

export interface TestSuite {
	id: string
	name: string
	description: string
	createdAt: string
	updatedAt: string
	projectId: string
	testCases: TestCase[]
}

export interface TestCase {
	id: string
	name: string
	description: string
	requirement: string // What is being tested
	target: string // Expected outcome or goal
	type: TestCaseType
	status: TestStatus
	createdAt: string
	updatedAt: string
	testSuiteId: string
	steps: TestStep[]
}

export enum TestCaseType {
	POSITIVE = 'positive',
	NEGATIVE = 'negative',
	EDGE_CASE = 'edge_case',
}

export enum TestStatus {
	DRAFT = 'draft',
	READY = 'ready',
	RUNNING = 'running',
	PASSED = 'passed',
	FAILED = 'failed',
	BLOCKED = 'blocked',
}

export interface TestStep {
	id: string
	order: number
	action: string
	selector: string
	value?: string
	expectedOutcome?: string
	screenshot?: string
	testCaseId: string
}

// UI Component related interfaces
export interface UIElement {
	id: string
	type: UIElementType
	selector: string
	label?: string
	placeholder?: string
	value?: string
	required?: boolean
	disabled?: boolean
	x: number
	y: number
	width: number
	height: number
	screenId: string
}

export enum UIElementType {
	BUTTON = 'button',
	INPUT = 'input',
	CHECKBOX = 'checkbox',
	RADIO = 'radio',
	SELECT = 'select',
	LINK = 'link',
	TEXT = 'text',
	IMAGE = 'image',
	CONTAINER = 'container',
}

export interface Screen {
	id: string
	name: string
	description?: string
	imageUrl: string
	elements: UIElement[]
	projectId: string
}

// Flow related interfaces
export interface Flow {
	id: string
	name: string
	description?: string
	screens: Screen[]
	connections: Connection[]
	projectId: string
}

export interface Connection {
	id: string
	sourceScreenId: string
	targetScreenId: string
	sourceElementId: string
	label?: string
}

// Test data related interfaces
export interface TestData {
	id: string
	name: string
	description?: string
	data: Record<string, any>[]
	projectId: string
}

// Report related interfaces
export interface TestReport {
	id: string
	testCaseId: string
	status: TestStatus
	startTime: string
	endTime: string
	duration: number
	browser: BrowserType
	screenshots: Screenshot[]
	logs: LogEntry[]
	errors?: string[]
}

export enum BrowserType {
	CHROME = 'chrome',
	FIREFOX = 'firefox',
	SAFARI = 'safari',
	EDGE = 'edge',
}

export interface Screenshot {
	id: string
	testReportId: string
	stepId: string
	timestamp: string
	imageUrl: string
}

export interface LogEntry {
	id: string
	testReportId: string
	timestamp: string
	level: LogLevel
	message: string
}

export enum LogLevel {
	INFO = 'info',
	WARNING = 'warning',
	ERROR = 'error',
	DEBUG = 'debug',
}

// Component props interfaces
export interface ButtonProps {
	children: React.ReactNode
	variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger'
	size?: 'sm' | 'md' | 'lg'
	disabled?: boolean
	isLoading?: boolean
	onClick?: () => void
	className?: string
	type?: 'button' | 'submit' | 'reset'
}

export interface InputProps {
	id: string
	label?: string
	placeholder?: string
	type?: string
	value?: string
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	error?: string
	disabled?: boolean
	required?: boolean
	className?: string
}

export interface SelectProps {
	id: string
	label?: string
	value?: string
	onChange?: (value: string) => void
	options: {label: string; value: string}[]
	placeholder?: string
	error?: string
	disabled?: boolean
	required?: boolean
	className?: string
}

export interface CardProps {
	title?: string
	children: React.ReactNode
	footer?: React.ReactNode
	className?: string
}
