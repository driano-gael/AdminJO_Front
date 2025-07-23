import { render, screen } from '@testing-library/react';
import Breadcrumb from '@/components/navigation/Breadcrumb';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ href, children, className }: any) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  };
});

describe('Breadcrumb', () => {
  it('should render single breadcrumb item without link', () => {
    const items = [{ label: 'Dashboard' }];
    
    render(<Breadcrumb items={items} />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toHaveClass('text-gray-900 font-medium');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should render single breadcrumb item with link', () => {
    const items = [{ label: 'Dashboard', href: '/dashboard' }];
    
    render(<Breadcrumb items={items} />);
    
    const link = screen.getByRole('link', { name: 'Dashboard' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/dashboard');
    expect(link).toHaveClass('hover:text-blue-600');
  });

  it('should render multiple breadcrumb items with proper separators', () => {
    const items = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Events', href: '/events' },
      { label: 'Event Details' }
    ];
    
    render(<Breadcrumb items={items} />);
    
    // Check all labels are present
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('Event Details')).toBeInTheDocument();
    
    // Check links for first two items
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('link', { name: 'Events' })).toHaveAttribute('href', '/events');
    
    // Check last item is not a link
    expect(screen.getByText('Event Details')).toHaveClass('text-gray-900 font-medium');
    
    // Check separators (→) are present
    const separators = screen.getAllByText('→');
    expect(separators).toHaveLength(2); // Should have 2 separators for 3 items
  });

  it('should render complex breadcrumb with mixed items', () => {
    const items = [
      { label: 'Home', href: '/' },
      { label: 'Events Management', href: '/events' },
      { label: 'Disciplines', href: '/events/disciplines' },
      { label: 'Swimming' },
      { label: 'Edit Competition' }
    ];
    
    render(<Breadcrumb items={items} />);
    
    // Check all labels
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Events Management')).toBeInTheDocument();
    expect(screen.getByText('Disciplines')).toBeInTheDocument();
    expect(screen.getByText('Swimming')).toBeInTheDocument();
    expect(screen.getByText('Edit Competition')).toBeInTheDocument();
    
    // Check links
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Events Management' })).toHaveAttribute('href', '/events');
    expect(screen.getByRole('link', { name: 'Disciplines' })).toHaveAttribute('href', '/events/disciplines');
    
    // Check non-links
    expect(screen.getByText('Swimming')).toHaveClass('text-gray-900 font-medium');
    expect(screen.getByText('Edit Competition')).toHaveClass('text-gray-900 font-medium');
    
    // Check separators
    const separators = screen.getAllByText('→');
    expect(separators).toHaveLength(4); // Should have 4 separators for 5 items
  });

  it('should handle empty items array gracefully', () => {
    const items: Array<{ label: string; href?: string }> = [];
    
    render(<Breadcrumb items={items} />);
    
    // Should render the nav element but no content
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('mb-8');
  });

  it('should apply correct CSS classes', () => {
    const items = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Current Page' }
    ];
    
    render(<Breadcrumb items={items} />);
    
    // Check nav classes
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('mb-8');
    
    // Check container classes
    const container = nav.querySelector('div');
    expect(container).toHaveClass('flex', 'items-center', 'space-x-2', 'text-sm', 'text-gray-600');
    
    // Check link classes
    const link = screen.getByRole('link', { name: 'Dashboard' });
    expect(link).toHaveClass('hover:text-blue-600');
    
    // Check non-link classes
    const currentPage = screen.getByText('Current Page');
    expect(currentPage).toHaveClass('text-gray-900', 'font-medium');
  });

  it('should render with special characters and long labels', () => {
    const items = [
      { label: 'Accueil & Événements', href: '/home' },
      { label: 'Gestion des Compétitions Olympiques 2024', href: '/competitions' },
      { label: 'Détails: Natation - 100m Nage Libre (Finale)' }
    ];
    
    render(<Breadcrumb items={items} />);
    
    expect(screen.getByText('Accueil & Événements')).toBeInTheDocument();
    expect(screen.getByText('Gestion des Compétitions Olympiques 2024')).toBeInTheDocument();
    expect(screen.getByText('Détails: Natation - 100m Nage Libre (Finale)')).toBeInTheDocument();
    
    const separators = screen.getAllByText('→');
    expect(separators).toHaveLength(2);
  });

  it('should handle items with empty or undefined href', () => {
    const items = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Events', href: '' }, // Empty href
      { label: 'Current Page', href: undefined } // Undefined href
    ];
    
    render(<Breadcrumb items={items} />);
    
    // First item should be a link
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    
    // Items with empty or undefined href should not be links
    expect(screen.getByText('Events')).toHaveClass('text-gray-900 font-medium');
    expect(screen.getByText('Current Page')).toHaveClass('text-gray-900 font-medium');
    
    // Should have 2 separators
    const separators = screen.getAllByText('→');
    expect(separators).toHaveLength(2);
  });
});
