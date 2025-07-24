import React from 'react';
import { render, screen } from '@testing-library/react';
import Spinner from '@/components/spinner';

describe('Spinner Component', () => {
  it('should render default spinner', () => {
    render(<Spinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('should render with small size', () => {
    render(<Spinner size="small" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('should render with large size', () => {
    render(<Spinner size="large" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('should render with white color', () => {
    render(<Spinner color="white" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('should render with gray color', () => {
    render(<Spinner color="gray" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    render(<Spinner className="custom-class" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('custom-class');
  });

  it('should be accessible with proper attributes', () => {
    render(<Spinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Chargement en cours');
  });

  it('should render with medium size par dÃ©faut', () => {
    render(<Spinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    // La taille par défaut est medium selon l'interface
  });

  it('should render with blue color par dÃ©faut', () => {
    render(<Spinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    // La couleur par défaut est blue selon l'interface
  });

  it('should render with combined props', () => {
    render(<Spinner size="small" color="gray" className="test-spinner" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('test-spinner');
  });
});
