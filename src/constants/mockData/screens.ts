import { Screen, UIElementType } from '@/types/common.types';

export const mockScreens: Screen[] = [
  {
    id: '1',
    name: 'Login Screen',
    description: 'User login screen with email and password fields',
    imageUrl: '/mockups/login-screen.png',
    projectId: '1',
    elements: [
      {
        id: '101',
        type: UIElementType.INPUT,
        selector: '#email',
        label: 'Email',
        placeholder: 'Enter your email',
        required: true,
        x: 100,
        y: 150,
        width: 300,
        height: 40,
        screenId: '1'
      },
      {
        id: '102',
        type: UIElementType.INPUT,
        selector: '#password',
        label: 'Password',
        placeholder: 'Enter your password',
        required: true,
        x: 100,
        y: 220,
        width: 300,
        height: 40,
        screenId: '1'
      },
      {
        id: '103',
        type: UIElementType.BUTTON,
        selector: 'button[type="submit"]',
        label: 'Sign In',
        x: 100,
        y: 300,
        width: 300,
        height: 50,
        screenId: '1'
      },
      {
        id: '104',
        type: UIElementType.LINK,
        selector: '.forgot-password',
        label: 'Forgot Password?',
        x: 250,
        y: 370,
        width: 150,
        height: 20,
        screenId: '1'
      }
    ]
  },
  {
    id: '2',
    name: 'Dashboard',
    description: 'Main dashboard after login',
    imageUrl: '/mockups/dashboard.png',
    projectId: '1',
    elements: [
      {
        id: '201',
        type: UIElementType.TEXT,
        selector: '.dashboard-welcome',
        label: 'Welcome back',
        x: 100,
        y: 100,
        width: 300,
        height: 40,
        screenId: '2'
      },
      {
        id: '202',
        type: UIElementType.BUTTON,
        selector: '.new-test-btn',
        label: 'Create New Test',
        x: 700,
        y: 100,
        width: 150,
        height: 40,
        screenId: '2'
      },
      {
        id: '203',
        type: UIElementType.CONTAINER,
        selector: '.recent-tests',
        label: 'Recent Tests',
        x: 100,
        y: 200,
        width: 800,
        height: 400,
        screenId: '2'
      }
    ]
  },
  {
    id: '3',
    name: 'Product Listing',
    description: 'E-commerce product listing page',
    imageUrl: '/mockups/product-listing.png',
    projectId: '1',
    elements: [
      {
        id: '301',
        type: UIElementType.TEXT,
        selector: '.page-title',
        label: 'Products',
        x: 100,
        y: 100,
        width: 200,
        height: 40,
        screenId: '3'
      },
      {
        id: '302',
        type: UIElementType.CONTAINER,
        selector: '.product-grid',
        label: 'Product Grid',
        x: 100,
        y: 150,
        width: 800,
        height: 600,
        screenId: '3'
      },
      {
        id: '303',
        type: UIElementType.BUTTON,
        selector: '.product-card:first-child .add-to-cart',
        label: 'Add to Cart',
        x: 300,
        y: 400,
        width: 120,
        height: 40,
        screenId: '3'
      },
      {
        id: '304',
        type: UIElementType.LINK,
        selector: '.cart-icon',
        label: 'Cart',
        x: 850,
        y: 50,
        width: 40,
        height: 40,
        screenId: '3'
      }
    ]
  }
];
