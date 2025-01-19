import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import Login from './Login';

jest.mock('react-native-vector-icons/fontawesome6', () => 'FontAwesome6');
jest.mock('components/atoms', () => ({
  CustomInput: jest.fn(),
  CustomButton: ({onClick, text}) => <button onClick={onClick}>{text}</button>,
}));
jest.mock('components/molecules', () => ({
  SignIn: ({backAction, signUpAction}) => (
    <div>
      <button onClick={backAction}>Back</button>
      <button onClick={signUpAction}>Sign Up</button>
    </div>
  ),
  SignUp: ({backAction, signInAction}) => (
    <div>
      <button onClick={backAction}>Back</button>
      <button onClick={signInAction}>Sign In</button>
    </div>
  ),
  GoogleSign: () => <div>Google Sign-In</div>,
}));
jest.mock('../../Hooks', () => ({
  useToggle: initial => {
    const state = {value: initial};
    const toggle = jest.fn(() => {
      state.value = !state.value;
    });
    return [state.value, toggle];
  },
}));

describe('Login Component', () => {
  it('renders main login screen correctly', () => {
    const {getByText, queryByText} = render(<Login />);

    expect(getByText('Feel Hotel')).toBeTruthy();
    expect(getByText('Book your hotel for good')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
    expect(getByText('Sign up')).toBeTruthy();
    expect(queryByText('Google Sign-In')).toBeTruthy();
  });

  it('toggles to the Sign In view when "Sign In" is clicked', () => {
    const {getByText, queryByText} = render(<Login />);

    const signInButton = getByText('Sign In');
    fireEvent.click(signInButton);

    expect(queryByText('Sign In')).toBeNull(); // Sign-In button should disappear
    expect(getByText('Back')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
  });

  it('toggles to the Sign Up view when "Sign up" is clicked', () => {
    const {getByText, queryByText} = render(<Login />);

    const signUpButton = getByText('Sign up');
    fireEvent.click(signUpButton);

    expect(queryByText('Sign up')).toBeNull(); // Sign-Up button should disappear
    expect(getByText('Back')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('returns to main screen from Sign In view', () => {
    const {getByText, queryByText} = render(<Login />);

    const signInButton = getByText('Sign In');
    fireEvent.click(signInButton);

    const backButton = getByText('Back');
    fireEvent.click(backButton);

    expect(getByText('Sign In')).toBeTruthy();
    expect(getByText('Sign up')).toBeTruthy();
    expect(queryByText('Back')).toBeNull(); // Back button should disappear
  });

  it('returns to main screen from Sign Up view', () => {
    const {getByText, queryByText} = render(<Login />);

    const signUpButton = getByText('Sign up');
    fireEvent.click(signUpButton);

    const backButton = getByText('Back');
    fireEvent.click(backButton);

    expect(getByText('Sign In')).toBeTruthy();
    expect(getByText('Sign up')).toBeTruthy();
    expect(queryByText('Back')).toBeNull(); // Back button should disappear
  });

  it('handles navigation between Sign In and Sign Up views', () => {
    const {getByText, queryByText} = render(<Login />);

    const signInButton = getByText('Sign In');
    fireEvent.click(signInButton);

    const signUpFromSignIn = getByText('Sign Up');
    fireEvent.click(signUpFromSignIn);

    expect(queryByText('Sign In')).toBeNull();
    expect(getByText('Sign In')).toBeTruthy(); // Sign In button in Sign-Up view
  });
});
