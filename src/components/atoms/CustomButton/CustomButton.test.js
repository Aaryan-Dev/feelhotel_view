import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import CustomButton from './CustomButton';

describe('CustomButton Component', () => {
  it('renders correctly with props', () => {
    const {getByText} = render(
      <CustomButton
        onClick={jest.fn()}
        buttonColor="blue"
        icon={<Text>Icon</Text>}
        text={<Text>Click Me</Text>}
      />,
    );

    expect(getByText('Click Me')).toBeTruthy();
    expect(getByText('Icon')).toBeTruthy();
  });

  it('calls onClick when the button is pressed', () => {
    const mockOnClick = jest.fn();
    const {getByText} = render(
      <CustomButton
        onClick={mockOnClick}
        buttonColor="blue"
        icon={<Text>Icon</Text>}
        text={<Text>Click Me</Text>}
      />,
    );

    const button = getByText('Click Me');
    fireEvent.press(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom styles correctly', () => {
    const {getByTestId} = render(
      <CustomButton
        onClick={jest.fn()}
        buttonColor="blue"
        icon={<Text>Icon</Text>}
        text={<Text>Click Me</Text>}
      />,
    );

    const button = getByTestId('CustomButton');
    expect(button.props.style).toMatchObject({
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 5,
    });
  });

  it('renders without crashing when optional props are omitted', () => {
    const {getByText} = render(
      <CustomButton onClick={jest.fn()} buttonColor="blue" />,
    );

    expect(getByText('Icon')).toBeTruthy(); // Default behavior
  });
});
