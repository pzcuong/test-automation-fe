import React, {useEffect, useRef, useState} from 'react'
import {TestCase, TestStatus} from '@/types/common.types'
import {useProjectStore} from '@/store'
import {Button} from '@/components/ui'

interface TestDependencyGraphProps {
	testCaseId: string
	width?: number
	height?: number
}

const TestDependencyGraph: React.FC<TestDependencyGraphProps> = ({
	testCaseId,
	width = 600,
	height = 400,
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const {projects} = useProjectStore()
	
	// Find the test case and its dependencies
	const findTestCase = (id: string): TestCase | null => {
		for (const project of projects) {
			for (const suite of project.testSuites) {
				const testCase = suite.testCases.find(tc => tc.id === id)
				if (testCase) return testCase
			}
		}
		return null
	}
	
	const testCase = findTestCase(testCaseId)
	
	// Build the dependency tree
	const buildDependencyTree = (
		rootId: string,
		visited = new Set<string>()
	): any => {
		if (visited.has(rootId)) return null // Prevent circular dependencies
		
		visited.add(rootId)
		const tc = findTestCase(rootId)
		if (!tc) return null
		
		const dependencies =
			tc.dependencies?.map((depId) =>
				buildDependencyTree(depId, new Set(visited))
			) || []
		return {
			id: tc.id,
			name: tc.name,
			type: tc.type,
			status: tc.status,
			dependencies: dependencies.filter(Boolean),
		}
	}
	
	useEffect(() => {
		if (!canvasRef.current || !testCase) return
		
		const ctx = canvasRef.current.getContext('2d')
		if (!ctx) return
		
		// Clear canvas
		ctx.clearRect(0, 0, width, height)
		
		// Set canvas DPI for better rendering
		const dpr = window.devicePixelRatio || 1;
		const rect = canvasRef.current.getBoundingClientRect();
		canvasRef.current.width = rect.width * dpr;
		canvasRef.current.height = rect.height * dpr;
		ctx.scale(dpr, dpr);
		
		// Build dependency tree
		const tree = buildDependencyTree(testCaseId)
		if (!tree) return
		
		// Draw the graph
		const drawNode = (node: any, x: number, y: number, level = 0) => {
			const nodeRadius = 35;
			const nodeSpacing = 180;
			const levelHeight = 120;
			
			// Draw node shadow
			ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
			ctx.shadowBlur = 10;
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 4;
			
			// Draw node background
			ctx.fillStyle = getNodeColor(node.status);
			ctx.beginPath();
			ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
			ctx.fill();
			
			// Reset shadow
			ctx.shadowColor = 'transparent';
			ctx.shadowBlur = 0;
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			
			// Draw node border
			ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
			ctx.stroke();
			
			// Draw node text
			ctx.fillStyle = '#fff';
			ctx.font = 'bold 12px Arial';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			
			// Split text into multiple lines if needed
			const words = node.name.split(' ');
			let line = '';
			let lines = [];
			
			for (let i = 0; i < words.length; i++) {
				const testLine = line + words[i] + ' ';
				if (ctx.measureText(testLine).width > nodeRadius * 1.5) {
					lines.push(line);
					line = words[i] + ' ';
				} else {
					line = testLine;
				}
			}
			lines.push(line);
			
			// Draw each line of text
			const lineHeight = 14;
			const startY = y - ((lines.length - 1) * lineHeight) / 2;
			
			lines.forEach((line, i) => {
				ctx.fillText(line.trim(), x, startY + i * lineHeight);
			});
			
			// Draw dependencies
			if (node.dependencies && node.dependencies.length > 0) {
				// Calculate positions for child nodes
				const totalWidth = (node.dependencies.length - 1) * nodeSpacing;
				const startX = x - totalWidth / 2;
				
				node.dependencies.forEach((dep: any, i: number) => {
					const depX = startX + i * nodeSpacing;
					const depY = y + levelHeight;
					
					// Draw connecting line
					ctx.strokeStyle = '#aaa';
					ctx.lineWidth = 2;
					ctx.beginPath();
					ctx.moveTo(x, y + nodeRadius);
					
					// Create a curved line
					const controlX = (x + depX) / 2;
					const controlY = y + levelHeight / 2;
					ctx.quadraticCurveTo(controlX, controlY, depX, depY - nodeRadius);
					ctx.stroke();
					
					// Draw arrow
					const arrowSize = 8;
					const angle = Math.atan2(depY - nodeRadius - controlY, depX - controlX);
					
					ctx.fillStyle = '#aaa';
					ctx.beginPath();
					ctx.moveTo(depX, depY - nodeRadius);
					ctx.lineTo(
						depX - arrowSize * Math.cos(angle - Math.PI / 6),
						depY - nodeRadius - arrowSize * Math.sin(angle - Math.PI / 6)
					);
					ctx.lineTo(
						depX - arrowSize * Math.cos(angle + Math.PI / 6),
						depY - nodeRadius - arrowSize * Math.sin(angle + Math.PI / 6)
					);
					ctx.closePath();
					ctx.fill();
					
					// Draw dependency node
					drawNode(dep, depX, depY, level + 1);
				});
			}
		};
		
		const getNodeColor = (status: string) => {
			switch (status) {
				case 'passed':
					return '#4CAF50'; // Green
				case 'failed':
					return '#F44336'; // Red
				case 'running':
					return '#FFC107'; // Amber
				case 'blocked':
					return '#9E9E9E'; // Gray
				default:
					return '#2196F3'; // Blue
			}
		};
		
		// Start drawing from the root node
		drawNode(tree, width / 2, 70);
	}, [testCaseId, testCase, projects, width, height]);
	
	const [showLegend, setShowLegend] = useState(true);
	
	if (!testCase) {
		return <div className='text-gray-500'>Test case not found</div>
	}
	
	return (
		<div className="border border-gray-200 rounded-md p-4">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-lg font-medium">Dependency Graph</h3>
				<div className="flex space-x-2">
					<Button 
						variant="outline" 
						size="sm"
						onClick={() => setShowLegend(!showLegend)}
					>
						{showLegend ? 'Hide Legend' : 'Show Legend'}
					</Button>
				</div>
			</div>
			
			{showLegend && (
				<div className="mb-4 p-3 bg-gray-50 rounded-md">
					<h4 className="text-sm font-medium mb-2">Legend</h4>
					<div className="grid grid-cols-2 gap-2">
						<div className="flex items-center">
							<div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
							<span className="text-sm">Passed</span>
						</div>
						<div className="flex items-center">
							<div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
							<span className="text-sm">Failed</span>
						</div>
						<div className="flex items-center">
							<div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
							<span className="text-sm">Running</span>
						</div>
						<div className="flex items-center">
							<div className="w-4 h-4 rounded-full bg-gray-500 mr-2"></div>
							<span className="text-sm">Blocked</span>
						</div>
						<div className="flex items-center">
							<div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
							<span className="text-sm">Other</span>
						</div>
					</div>
				</div>
			)}
			
			{!testCase.dependencies || testCase.dependencies.length === 0 ? (
				<div className="text-center py-6 bg-gray-50 rounded-md">
					<p className="text-gray-500">This test case has no dependencies</p>
				</div>
			) : (
				<div>
					<canvas 
						ref={canvasRef} 
						width={width} 
						height={height}
						className="bg-white border border-gray-200 rounded-md"
					/>
					<div className="mt-4 text-sm text-gray-600">
						<p>This test case depends on {testCase.dependencies.length} other test case(s).</p>
						<p className="mt-1">Click on a node in the graph to view details about that test case.</p>
					</div>
				</div>
			)}
		</div>
	)
}

export default TestDependencyGraph
