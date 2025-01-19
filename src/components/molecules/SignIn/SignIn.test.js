import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import SignIn from './SignIn';
import {useMutation} from '@apollo/client';
import {Formik} from 'formik';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Text} from 'react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(),
    signIn: jest.fn(),
  },
}));

jest.mock('@apollo/client', () => ({
  useMutation: jest.fn(),
}));

jest.mock('react-native-simple-toast', () => ({
  showWithGravity: jest.fn(),
}));

describe('SignIn Component', () => {
  const mockNavigate = jest.fn();
  const mockBackAction = jest.fn();
  const mockSignUpAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useMutation.mockReturnValue([jest.fn(), {}]);
  });

  it('renders the SignIn component correctly', () => {
    const {getByText} = render(
      <SignIn
        navigation={{navigate: mockNavigate}}
        backAction={mockBackAction}
        signUpAction={mockSignUpAction}
      />,
    );
    expect(getByText('Sign In')).toBeTruthy();
    expect(getByText('Verify & Proceed')).toBeTruthy();
  });

  it('handles form submission with valid credentials', async () => {
    const mockSignIn = jest.fn().mockResolvedValue({
      data: {
        signIn: {token: 'dummy-token'},
      },
    });

    useMutation.mockReturnValue([mockSignIn, {loading: false, error: null}]);

    const {getByText} = render(
      <SignIn
        navigation={{navigate: mockNavigate}}
        backAction={mockBackAction}
        signUpAction={mockSignUpAction}
      />,
    );

    fireEvent.changeText(
      getByText('Enter your email address'),
      'test@example.com',
    );
    fireEvent.changeText(getByText('Password'), 'password123');
    fireEvent.press(getByText('Verify & Proceed'));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        variables: {email: 'test@example.com', password: 'password123'},
      });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'userToken',
        'dummy-token',
      );
      expect(mockNavigate).toHaveBeenCalledWith('Home');
    });
  });

  it('shows error messages for invalid credentials', async () => {
    const mockSignIn = jest.fn().mockRejectedValue({
      graphQLErrors: [{message: 'Invalid credentials'}],
    });

    useMutation.mockReturnValue([mockSignIn, {loading: false, error: null}]);

    const {getByText} = render(
      <SignIn
        navigation={{navigate: mockNavigate}}
        backAction={mockBackAction}
        signUpAction={mockSignUpAction}
      />,
    );

    fireEvent.changeText(
      getByText('Enter your email address'),
      'invalid@example.com',
    );
    fireEvent.changeText(getByText('Password'), 'wrongpassword');
    fireEvent.press(getByText('Verify & Proceed'));

    await waitFor(() => {
      expect(Toast.showWithGravity).toHaveBeenCalledWith(
        'Invalid credentials',
        Toast.LONG,
        Toast.TOP,
        {backgroundColor: '#A70D2A'},
      );
    });
  });

  it('handles network errors gracefully', async () => {
    const mockSignIn = jest.fn().mockRejectedValue({
      networkError: 'Network error occurred',
    });

    useMutation.mockReturnValue([mockSignIn, {loading: false, error: null}]);

    const {getByText} = render(
      <SignIn
        navigation={{navigate: mockNavigate}}
        backAction={mockBackAction}
        signUpAction={mockSignUpAction}
      />,
    );

    fireEvent.changeText(
      getByText('Enter your email address'),
      'test@example.com',
    );
    fireEvent.changeText(getByText('Password'), 'password123');
    fireEvent.press(getByText('Verify & Proceed'));

    await waitFor(() => {
      expect(Toast.showWithGravity).toHaveBeenCalledWith(
        'Network error occurred',
        Toast.LONG,
        Toast.TOP,
        {backgroundColor: '#A70D2A'},
      );
    });
  });

  it('navigates back when back action is triggered', () => {
    const {getByText} = render(
      <SignIn
        navigation={{navigate: mockNavigate}}
        backAction={mockBackAction}
        signUpAction={mockSignUpAction}
      />,
    );

    fireEvent.press(getByText('Back'));
    expect(mockBackAction).toHaveBeenCalled();
  });

  it('navigates to sign-up page when "Sign up instead" is pressed', () => {
    const {getByText} = render(
      <SignIn
        navigation={{navigate: mockNavigate}}
        backAction={mockBackAction}
        signUpAction={mockSignUpAction}
      />,
    );

    fireEvent.press(getByText('New here? Sign up instead!'));
    expect(mockSignUpAction).toHaveBeenCalled();
  });
});
