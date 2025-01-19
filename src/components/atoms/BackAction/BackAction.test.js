import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import BackAction from './BackAction';

jest.mock('@react-native-vector-icons/fontawesome6', () => 'FontAwesome6');

describe('BackAction Component', () => {
  it('renders correctly with default props', () => {
    const {getByText} = render(
      <BackAction
        backAction={jest.fn()}
        content="Next Step"
        handleCustomNavigation={jest.fn()}
      />,
    );

    expect(getByText('Back')).toBeTruthy();
    expect(getByText('Next Step')).toBeTruthy();
  });

  it('calls the backAction function when "Back" is pressed', () => {
    const mockBackAction = jest.fn();
    const {getByText} = render(
      <BackAction
        backAction={mockBackAction}
        content="Next Step"
        handleCustomNavigation={jest.fn()}
      />,
    );

    const backButton = getByText('Back');
    fireEvent.press(backButton);

    expect(mockBackAction).toHaveBeenCalledTimes(1);
  });

  it('calls the handleCustomNavigation function when content is pressed', () => {
    const mockCustomNavigation = jest.fn();
    const {getByText} = render(
      <BackAction
        backAction={jest.fn()}
        content="Next Step"
        handleCustomNavigation={mockCustomNavigation}
      />,
    );

    const customNavigationButton = getByText('Next Step');
    fireEvent.press(customNavigationButton);

    expect(mockCustomNavigation).toHaveBeenCalledTimes(1);
  });

  it('renders without crashing when optional props are omitted', () => {
    const {getByText} = render(<BackAction backAction={jest.fn()} />);

    expect(getByText('Back')).toBeTruthy();
  });

  it('applies custom styles correctly', () => {
    const {getByText} = render(
      <BackAction
        backAction={jest.fn()}
        content="Next Step"
        handleCustomNavigation={jest.fn()}
      />,
    );

    const nextStepText = getByText('Next Step');
    expect(nextStepText.props.style).toMatchObject({color: '#3198FF'});
  });
});
