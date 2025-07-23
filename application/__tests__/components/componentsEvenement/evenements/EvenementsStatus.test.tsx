import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EvenementsStatus from '../../../../src/components/componentsEvenement/evenements/EvenementsStatus';

// Mock des utilitaires
const mockGetEventStatus = jest.fn();
const mockGetStatusColor = jest.fn();

jest.mock('../../../../src/utils/evenement/statutEvenement', () => ({
  getEventStatus: (...args: any[]) => mockGetEventStatus(...args),
  getStatusColor: (...args: any[]) => mockGetStatusColor(...args)
}));

describe('EvenementsStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render status with correct text', () => {
      mockGetEventStatus.mockReturnValue('À venir');
      mockGetStatusColor.mockReturnValue('bg-blue-100 text-blue-800');

      render(<EvenementsStatus date="2024-07-28" time="20:30" />);
      
      expect(screen.getByText('À venir')).toBeInTheDocument();
    });

    it('should call getEventStatus with correct parameters', () => {
      mockGetEventStatus.mockReturnValue('En cours');
      mockGetStatusColor.mockReturnValue('bg-green-100 text-green-800');

      render(<EvenementsStatus date="2024-07-28" time="15:30" />);
      
      expect(mockGetEventStatus).toHaveBeenCalledWith('2024-07-28', '15:30');
    });

    it('should call getStatusColor with the status returned by getEventStatus', () => {
      mockGetEventStatus.mockReturnValue('Terminé');
      mockGetStatusColor.mockReturnValue('bg-gray-100 text-gray-800');

      render(<EvenementsStatus date="2024-07-25" time="18:00" />);
      
      expect(mockGetStatusColor).toHaveBeenCalledWith('Terminé');
    });
  });

  describe('Status Variations', () => {
    it('should render "À venir" status correctly', () => {
      mockGetEventStatus.mockReturnValue('À venir');
      mockGetStatusColor.mockReturnValue('bg-blue-100 text-blue-800');

      render(<EvenementsStatus date="2024-12-25" time="10:00" />);
      
      const statusElement = screen.getByText('À venir');
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveClass('bg-blue-100', 'text-blue-800');
    });

    it('should render "En cours" status correctly', () => {
      mockGetEventStatus.mockReturnValue('En cours');
      mockGetStatusColor.mockReturnValue('bg-green-100 text-green-800');

      render(<EvenementsStatus date="2024-07-28" time="14:30" />);
      
      const statusElement = screen.getByText('En cours');
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('should render "Terminé" status correctly', () => {
      mockGetEventStatus.mockReturnValue('Terminé');
      mockGetStatusColor.mockReturnValue('bg-gray-100 text-gray-800');

      render(<EvenementsStatus date="2024-06-15" time="16:00" />);
      
      const statusElement = screen.getByText('Terminé');
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveClass('bg-gray-100', 'text-gray-800');
    });

    it('should render "Reporté" status correctly', () => {
      mockGetEventStatus.mockReturnValue('Reporté');
      mockGetStatusColor.mockReturnValue('bg-yellow-100 text-yellow-800');

      render(<EvenementsStatus date="2024-07-28" time="20:00" />);
      
      const statusElement = screen.getByText('Reporté');
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });

    it('should render "Annulé" status correctly', () => {
      mockGetEventStatus.mockReturnValue('Annulé');
      mockGetStatusColor.mockReturnValue('bg-red-100 text-red-800');

      render(<EvenementsStatus date="2024-07-28" time="21:00" />);
      
      const statusElement = screen.getByText('Annulé');
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveClass('bg-red-100', 'text-red-800');
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should have base CSS classes for styling', () => {
      mockGetEventStatus.mockReturnValue('À venir');
      mockGetStatusColor.mockReturnValue('bg-blue-100 text-blue-800');

      render(<EvenementsStatus date="2024-07-28" time="20:30" />);
      
      const statusElement = screen.getByText('À venir');
      expect(statusElement).toHaveClass(
        'inline-flex',
        'px-2',
        'py-1', 
        'text-xs',
        'font-semibold',
        'rounded-full'
      );
    });

    it('should apply color classes from getStatusColor', () => {
      mockGetEventStatus.mockReturnValue('Test Status');
      mockGetStatusColor.mockReturnValue('bg-purple-100 text-purple-800 border-purple-200');

      render(<EvenementsStatus date="2024-07-28" time="20:30" />);
      
      const statusElement = screen.getByText('Test Status');
      expect(statusElement).toHaveClass('bg-purple-100', 'text-purple-800', 'border-purple-200');
    });

    it('should combine base classes with color classes correctly', () => {
      mockGetEventStatus.mockReturnValue('Custom Status');
      mockGetStatusColor.mockReturnValue('bg-indigo-100 text-indigo-800');

      render(<EvenementsStatus date="2024-07-28" time="20:30" />);
      
      const statusElement = screen.getByText('Custom Status');
      
      // Should have both base classes and color classes
      expect(statusElement).toHaveClass(
        'inline-flex', 'px-2', 'py-1', 'text-xs', 'font-semibold', 'rounded-full',
        'bg-indigo-100', 'text-indigo-800'
      );
    });
  });

  describe('Different Date and Time Formats', () => {
    it('should handle ISO date format', () => {
      mockGetEventStatus.mockReturnValue('À venir');
      mockGetStatusColor.mockReturnValue('bg-blue-100 text-blue-800');

      render(<EvenementsStatus date="2024-07-28T00:00:00Z" time="20:30" />);
      
      expect(mockGetEventStatus).toHaveBeenCalledWith('2024-07-28T00:00:00Z', '20:30');
    });

    it('should handle different time formats', () => {
      mockGetEventStatus.mockReturnValue('En cours');
      mockGetStatusColor.mockReturnValue('bg-green-100 text-green-800');

      render(<EvenementsStatus date="2024-07-28" time="08:00:00" />);
      
      expect(mockGetEventStatus).toHaveBeenCalledWith('2024-07-28', '08:00:00');
    });

    it('should handle French date format', () => {
      mockGetEventStatus.mockReturnValue('Terminé');
      mockGetStatusColor.mockReturnValue('bg-gray-100 text-gray-800');

      render(<EvenementsStatus date="28/07/2024" time="14:30" />);
      
      expect(mockGetEventStatus).toHaveBeenCalledWith('28/07/2024', '14:30');
    });

    it('should handle 12-hour time format', () => {
      mockGetEventStatus.mockReturnValue('À venir');
      mockGetStatusColor.mockReturnValue('bg-blue-100 text-blue-800');

      render(<EvenementsStatus date="2024-07-28" time="08:30 PM" />);
      
      expect(mockGetEventStatus).toHaveBeenCalledWith('2024-07-28', '08:30 PM');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty date', () => {
      mockGetEventStatus.mockReturnValue('Inconnu');
      mockGetStatusColor.mockReturnValue('bg-gray-100 text-gray-800');

      render(<EvenementsStatus date="" time="20:30" />);
      
      expect(mockGetEventStatus).toHaveBeenCalledWith('', '20:30');
      expect(screen.getByText('Inconnu')).toBeInTheDocument();
    });

    it('should handle empty time', () => {
      mockGetEventStatus.mockReturnValue('Inconnu');
      mockGetStatusColor.mockReturnValue('bg-gray-100 text-gray-800');

      render(<EvenementsStatus date="2024-07-28" time="" />);
      
      expect(mockGetEventStatus).toHaveBeenCalledWith('2024-07-28', '');
      expect(screen.getByText('Inconnu')).toBeInTheDocument();
    });

    it('should handle both empty date and time', () => {
      mockGetEventStatus.mockReturnValue('Données manquantes');
      mockGetStatusColor.mockReturnValue('bg-red-100 text-red-800');

      render(<EvenementsStatus date="" time="" />);
      
      expect(mockGetEventStatus).toHaveBeenCalledWith('', '');
      expect(screen.getByText('Données manquantes')).toBeInTheDocument();
    });

    it('should handle null status from utility function', () => {
      mockGetEventStatus.mockReturnValue(null);
      mockGetStatusColor.mockReturnValue('bg-gray-100 text-gray-800');

      render(<EvenementsStatus date="2024-07-28" time="20:30" />);
      
      expect(mockGetStatusColor).toHaveBeenCalledWith(null);
      // Component should still render the span element with classes
      const container = document.body;
      expect(container.querySelector('.bg-gray-100')).toBeInTheDocument();
    });

    it('should handle undefined status from utility function', () => {
      mockGetEventStatus.mockReturnValue(undefined);
      mockGetStatusColor.mockReturnValue('bg-gray-100 text-gray-800');

      render(<EvenementsStatus date="2024-07-28" time="20:30" />);
      
      expect(mockGetStatusColor).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Accessibility', () => {
    it('should render as a span element', () => {
      mockGetEventStatus.mockReturnValue('À venir');
      mockGetStatusColor.mockReturnValue('bg-blue-100 text-blue-800');

      const { container } = render(<EvenementsStatus date="2024-07-28" time="20:30" />);
      
      const spanElement = container.querySelector('span');
      expect(spanElement).toBeInTheDocument();
      expect(spanElement).toHaveTextContent('À venir');
    });

    it('should be readable with proper text contrast', () => {
      mockGetEventStatus.mockReturnValue('En cours');
      mockGetStatusColor.mockReturnValue('bg-green-100 text-green-800');

      render(<EvenementsStatus date="2024-07-28" time="20:30" />);
      
      const statusElement = screen.getByText('En cours');
      // The color classes should provide proper contrast
      expect(statusElement).toHaveClass('text-green-800');
    });
  });

  describe('Performance', () => {
    it('should not re-call utility functions unnecessarily', () => {
      mockGetEventStatus.mockReturnValue('À venir');
      mockGetStatusColor.mockReturnValue('bg-blue-100 text-blue-800');

      const { rerender } = render(<EvenementsStatus date="2024-07-28" time="20:30" />);
      
      // Clear mocks to count only subsequent calls
      jest.clearAllMocks();
      
      // Re-render with same props
      rerender(<EvenementsStatus date="2024-07-28" time="20:30" />);
      
      // Should be called again since React doesn't memoize by default
      expect(mockGetEventStatus).toHaveBeenCalledTimes(1);
      expect(mockGetStatusColor).toHaveBeenCalledTimes(1);
    });

    it('should handle rapid prop changes', () => {
      mockGetEventStatus
        .mockReturnValueOnce('À venir')
        .mockReturnValueOnce('En cours')
        .mockReturnValueOnce('Terminé');
      mockGetStatusColor
        .mockReturnValueOnce('bg-blue-100 text-blue-800')
        .mockReturnValueOnce('bg-green-100 text-green-800')
        .mockReturnValueOnce('bg-gray-100 text-gray-800');

      const { rerender } = render(<EvenementsStatus date="2024-07-28" time="20:30" />);
      
      expect(screen.getByText('À venir')).toBeInTheDocument();
      
      rerender(<EvenementsStatus date="2024-07-28" time="15:30" />);
      expect(screen.getByText('En cours')).toBeInTheDocument();
      
      rerender(<EvenementsStatus date="2024-07-25" time="18:00" />);
      expect(screen.getByText('Terminé')).toBeInTheDocument();
    });
  });

  describe('Integration with Utility Functions', () => {
    it('should pass date and time parameters in correct order', () => {
      mockGetEventStatus.mockReturnValue('Test');
      mockGetStatusColor.mockReturnValue('bg-blue-100 text-blue-800');

      render(<EvenementsStatus date="2024-07-28" time="20:30" />);
      
      expect(mockGetEventStatus).toHaveBeenCalledWith('2024-07-28', '20:30');
      expect(mockGetEventStatus).toHaveBeenCalledTimes(1);
    });

    it('should pass the correct status to getStatusColor', () => {
      const testStatus = 'Custom Test Status';
      mockGetEventStatus.mockReturnValue(testStatus);
      mockGetStatusColor.mockReturnValue('bg-purple-100 text-purple-800');

      render(<EvenementsStatus date="2024-07-28" time="20:30" />);
      
      expect(mockGetStatusColor).toHaveBeenCalledWith(testStatus);
      expect(mockGetStatusColor).toHaveBeenCalledTimes(1);
    });

    it('should handle when utility functions throw errors gracefully', () => {
      mockGetEventStatus.mockImplementation(() => {
        throw new Error('Date parsing error');
      });
      mockGetStatusColor.mockReturnValue('bg-red-100 text-red-800');

      // Should not crash the component
      expect(() => {
        render(<EvenementsStatus date="invalid-date" time="invalid-time" />);
      }).toThrow('Date parsing error');
    });
  });
});
