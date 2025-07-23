import React from 'react';
import { render, screen } from '@testing-library/react';
import PageTemplate from '@/components/layout/PageTemplate';

// Mock des dépendances
jest.mock('@/components/layout/AuthenticatedLayout', () => {
  return function MockAuthenticatedLayout({ title, backUrl, backLabel, children }: any) {
    return (
      <div data-testid="authenticated-layout">
        <div data-testid="layout-title">{title}</div>
        <div data-testid="layout-back-url">{backUrl || 'default'}</div>
        <div data-testid="layout-back-label">{backLabel || 'default'}</div>
        {children}
      </div>
    );
  };
});

jest.mock('@/components/navigation/Breadcrumb', () => {
  return function MockBreadcrumb({ items }: { items: any[] }) {
    return (
      <div data-testid="breadcrumb">
        {items.map((item, index) => (
          <span key={index} data-testid={`breadcrumb-item-${index}`}>
            {item.label}
          </span>
        ))}
      </div>
    );
  };
});

describe('PageTemplate', () => {
  const defaultProps = {
    title: 'Test Page',
    children: <div data-testid="page-content">Page Content</div>
  };

  it('should render with minimal props', () => {
    render(<PageTemplate {...defaultProps} />);

    expect(screen.getByTestId('authenticated-layout')).toBeInTheDocument();
    expect(screen.getByTestId('layout-title')).toHaveTextContent('Test Page');
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
  });

  it('should pass title to AuthenticatedLayout', () => {
    render(<PageTemplate {...defaultProps} title="Custom Title" />);

    expect(screen.getByTestId('layout-title')).toHaveTextContent('Custom Title');
  });

  it('should pass backUrl to AuthenticatedLayout', () => {
    render(<PageTemplate {...defaultProps} backUrl="/custom-back" />);

    expect(screen.getByTestId('layout-back-url')).toHaveTextContent('/custom-back');
  });

  it('should pass backLabel to AuthenticatedLayout', () => {
    render(<PageTemplate {...defaultProps} backLabel="Custom Back" />);

    expect(screen.getByTestId('layout-back-label')).toHaveTextContent('Custom Back');
  });

  it('should render breadcrumbs when provided', () => {
    const breadcrumbs = [
      { label: 'Home', href: '/' },
      { label: 'Section', href: '/section' },
      { label: 'Current Page' }
    ];

    render(<PageTemplate {...defaultProps} breadcrumbs={breadcrumbs} />);

    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb-item-0')).toHaveTextContent('Home');
    expect(screen.getByTestId('breadcrumb-item-1')).toHaveTextContent('Section');
    expect(screen.getByTestId('breadcrumb-item-2')).toHaveTextContent('Current Page');
  });

  it('should not render breadcrumbs when not provided', () => {
    render(<PageTemplate {...defaultProps} />);

    expect(screen.queryByTestId('breadcrumb')).not.toBeInTheDocument();
  });

  it('should render intro section when provided', () => {
    const intro = {
      title: 'Welcome to the page',
      description: 'This is a detailed description of what this page does.'
    };

    render(<PageTemplate {...defaultProps} intro={intro} />);

    expect(screen.getByText('Welcome to the page')).toBeInTheDocument();
    expect(screen.getByText('This is a detailed description of what this page does.')).toBeInTheDocument();
  });

  it('should not render intro section when not provided', () => {
    render(<PageTemplate {...defaultProps} />);

    expect(screen.queryByText('Welcome to the page')).not.toBeInTheDocument();
  });

  it('should render intro with correct CSS classes', () => {
    const intro = {
      title: 'Test Title',
      description: 'Test Description'
    };

    render(<PageTemplate {...defaultProps} intro={intro} />);

    const introTitle = screen.getByText('Test Title');
    const introDescription = screen.getByText('Test Description');

    expect(introTitle).toHaveClass('text-2xl', 'font-bold', 'text-gray-900', 'mb-4');
    expect(introDescription).toHaveClass('text-lg', 'text-gray-600');
    
    // Check that the intro container has correct classes
    const introContainer = introTitle.closest('div');
    expect(introContainer).toHaveClass('text-center', 'mb-12');
  });

  it('should render children content correctly', () => {
    const customChildren = (
      <div>
        <h1 data-testid="custom-heading">Custom Heading</h1>
        <p data-testid="custom-paragraph">Custom paragraph content</p>
      </div>
    );

    render(<PageTemplate {...defaultProps}>{customChildren}</PageTemplate>);

    expect(screen.getByTestId('custom-heading')).toBeInTheDocument();
    expect(screen.getByTestId('custom-paragraph')).toBeInTheDocument();
  });

  it('should render both breadcrumbs and intro when both provided', () => {
    const breadcrumbs = [{ label: 'Home', href: '/' }];
    const intro = {
      title: 'Page Title',
      description: 'Page Description'
    };

    render(
      <PageTemplate 
        {...defaultProps} 
        breadcrumbs={breadcrumbs} 
        intro={intro} 
      />
    );

    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    expect(screen.getByText('Page Title')).toBeInTheDocument();
    expect(screen.getByText('Page Description')).toBeInTheDocument();
  });

  it('should handle empty breadcrumbs array', () => {
    render(<PageTemplate {...defaultProps} breadcrumbs={[]} />);

    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    expect(screen.queryByTestId('breadcrumb-item-0')).not.toBeInTheDocument();
  });

  it('should handle breadcrumbs without href', () => {
    const breadcrumbs = [
      { label: 'Home', href: '/' },
      { label: 'Current Page' } // No href
    ];

    render(<PageTemplate {...defaultProps} breadcrumbs={breadcrumbs} />);

    expect(screen.getByTestId('breadcrumb-item-0')).toHaveTextContent('Home');
    expect(screen.getByTestId('breadcrumb-item-1')).toHaveTextContent('Current Page');
  });

  it('should render multiple children correctly', () => {
    const multipleChildren = (
      <>
        <div data-testid="child-1">First Child</div>
        <div data-testid="child-2">Second Child</div>
        <div data-testid="child-3">Third Child</div>
      </>
    );

    render(<PageTemplate {...defaultProps}>{multipleChildren}</PageTemplate>);

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });

  it('should pass all props correctly to AuthenticatedLayout', () => {
    render(
      <PageTemplate 
        title="Full Test"
        backUrl="/back"
        backLabel="Go Back"
      >
        <div>Content</div>
      </PageTemplate>
    );

    expect(screen.getByTestId('layout-title')).toHaveTextContent('Full Test');
    expect(screen.getByTestId('layout-back-url')).toHaveTextContent('/back');
    expect(screen.getByTestId('layout-back-label')).toHaveTextContent('Go Back');
  });

  it('should handle complex intro content', () => {
    const intro = {
      title: 'Complex Title with 🚀 Emojis',
      description: 'A very long description that contains multiple sentences. This helps test how the component handles longer text content and ensures proper styling is applied.'
    };

    render(<PageTemplate {...defaultProps} intro={intro} />);

    expect(screen.getByText('Complex Title with 🚀 Emojis')).toBeInTheDocument();
    expect(screen.getByText(/A very long description that contains multiple sentences/)).toBeInTheDocument();
  });
});
