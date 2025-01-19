import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import CustomInput from './CustomInput';

describe('CustomInput Component', () => {
  const defaultProps = {
    inputMode: 'text',
    keyboardType: 'default',
    placeholder: 'Enter text',
    onChangeText: jest.fn(),
    onBlur: jest.fn(),
    height: 40,
    value: '',
    icon: <Text>Icon</Text>,
    error: '',
  };

  it('renders correctly with props', () => {
    const {getByPlaceholderText, getByText} = render(
      <CustomInput {...defaultProps} />,
    );

    expect(getByPlaceholderText('Enter text')).toBeTruthy();
    expect(getByText('Icon')).toBeTruthy();
  });

  it('displays an error message when error prop is provided', () => {
    const errorMessage = 'This field is required';
    const {getByText} = render(
      <CustomInput {...defaultProps} error={errorMessage} />,
    );

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('handles onChangeText correctly', () => {
    const {getByPlaceholderText} = render(<CustomInput {...defaultProps} />);
    const input = getByPlaceholderText('Enter text');

    fireEvent.changeText(input, 'Test Input');
    expect(defaultProps.onChangeText).toHaveBeenCalledTimes(1);
    expect(defaultProps.onChangeText).toHaveBeenCalledWith('Test Input');
  });

  it('handles onBlur correctly', () => {
    const {getByPlaceholderText} = render(<CustomInput {...defaultProps} />);
    const input = getByPlaceholderText('Enter text');

    fireEvent.blur(input);
    expect(defaultProps.onBlur).toHaveBeenCalledTimes(1);
  });

  it('applies custom height correctly', () => {
    const customHeight = 50;
    const {getByPlaceholderText} = render(
      <CustomInput {...defaultProps} height={customHeight} />,
    );
    const input = getByPlaceholderText('Enter text');

    expect(input.props.style).toMatchObject({
      height: customHeight,
    });
  });

  it('renders without crashing when optional props are omitted', () => {
    const {getByPlaceholderText} = render(
      <CustomInput
        inputMode="text"
        keyboardType="default"
        placeholder="Optional test"
        onChangeText={jest.fn()}
        onBlur={jest.fn()}
        height={40}
        value=""
      />,
    );

    expect(getByPlaceholderText('Optional test')).toBeTruthy();
  });
});
