import { render, screen } from '@testing-library/react';
import Greeting from '@/components/_test';

describe('Greeting component', () => {
  it('renders the correct name', () => {
    render(<Greeting name="Alice" />);
    expect(screen.getByText('Hello, Alice!')).toBeInTheDocument();
  });
});