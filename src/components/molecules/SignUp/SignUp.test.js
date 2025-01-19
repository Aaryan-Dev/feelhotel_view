import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import SignUp from './SignUp';
import {useMutation} from '@apollo/client';
import {Formik} from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import {Text} from 'react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}));

jest.mock('@apollo/client', () => ({
  useMutation: jest.fn(),
}));

jest.mock('react-native-simple-toast', () => ({
  showWithGravity: jest.fn(),
}));

describe('SignUp Component', () => {
  const mockNavigate = jest.fn();
  const mockBackAction = jest.fn();
  const mockSignInAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useMutation.mockReturnValue([jest.fn(), {}]);
  });

  it('renders the SignUp component correctly', () => {
    const {getByText} = render(
      <SignUp
        navigation={{navigate: mockNavigate}}
        backAction={mockBackAction}
        signInAction={mockSignInAction}
      />,
    );
    expect(getByText('Sign up')).toBeTruthy();
    expect(getByText('Enter')).toBeTruthy();
  });

  it('validates email and handles email entry correctly', async () => {
    const {getByText, getByPlaceholderText} = render(
      <SignUp
        navigation={{navigate: mockNavigate}}
        backAction={mockBackAction}
        signInAction={mockSignInAction}
      />,
    );

    fireEvent.changeText(
      getByPlaceholderText('Enter email address'),
      'test@example.com',
    );
    fireEvent.press(getByText('Enter'));

    await waitFor(() => {
      expect(getByText('Sign up')).toBeTruthy();
    });
  });

  it('handles sign-up with valid credentials', async () => {
    const mockSignUp = jest.fn().mockResolvedValue({
      data: {signUp: {token: 'dummy-token'}},
    });
    useMutation.mockReturnValue([mockSignUp, {loading: false, error: null}]);

    const {getByText, getByPlaceholderText} = render(
      <SignUp
        navigation={{navigate: mockNavigate}}
        backAction={mockBackAction}
        signInAction={mockSignInAction}
      />,
    );

    fireEvent.changeText(
      getByPlaceholderText('Enter email address'),
      'test@example.com',
    );
    fireEvent.changeText(getByPlaceholderText('Password'), 'Password123!');
    fireEvent.changeText(
      getByPlaceholderText('Confirm password'),
      'Password123!',
    );
    fireEvent.press(getByText('Sign up'));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        variables: {email: 'test@example.com', password: 'Password123!'},
      });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'userToken',
        'dummy-token',
      );
      expect(mockNavigate).toHaveBeenCalledWith('Home');
    });
  });

  it('shows an error if passwords do not match', async () => {
    const {getByText, getByPlaceholderText} = render(
      <SignUp
        navigation={{navigate: mockNavigate}}
        backAction={mockBackAction}
        signInAction={mockSignInAction}
      />,
    );

    fireEvent.changeText(
      getByPlaceholderText('Enter email address'),
      'test@example.com',
    );
    fireEvent.changeText(getByPlaceholderText('Password'), 'Password123!');
    fireEvent.changeText(
      getByPlaceholderText('Confirm password'),
      'Password124!',
    );
    fireEvent.press(getByText('Sign up'));

    await waitFor(() => {
      expect(Toast.showWithGravity).toHaveBeenCalledWith(
        'Passwords must match',
        Toast.LONG,
        Toast.TOP,
        {backgroundColor: '#A70D2A'},
      );
    });
  });

  it('handles sign-up with network error', async () => {
    const mockSignUp = jest.fn().mockRejectedValue({
      networkError: 'Network error occurred',
    });
    useMutation.mockReturnValue([mockSignUp, {loading: false, error: null}]);

    const {getByText, getByPlaceholderText} = render(
      <SignUp
        navigation={{navigate: mockNavigate}}
        backAction={mockBackAction}
        signInAction={mockSignInAction}
      />,
    );

    fireEvent.changeText(
      getByPlaceholderText('Enter email address'),
      'test@example.com',
    );
    fireEvent.changeText(getByPlaceholderText('Password'), 'Password123!');
    fireEvent.changeText(
      getByPlaceholderText('Confirm password'),
      'Password123!',
    );
    fireEvent.press(getByText('Sign up'));

    await waitFor(() => {
      expect(Toast.showWithGravity).toHaveBeenCalledWith(
        'Network error occurred',
        Toast.LONG,
        Toast.TOP,
        {backgroundColor: '#A70D2A'},
      );
    });
  });

  it('navigates to sign-in page when "Already have an account?" is pressed', () => {
    const {getByText} = render(
      <SignUp
        navigation={{navigate: mockNavigate}}
        backAction={mockBackAction}
        signInAction={mockSignInAction}
      />,
    );

    fireEvent.press(getByText('Already have an account?'));
    expect(mockSignInAction).toHaveBeenCalled();
  });

  it('navigates back when back action is triggered', () => {
    const {getByText} = render(
      <SignUp
        navigation={{navigate: mockNavigate}}
        backAction={mockBackAction}
        signInAction={mockSignInAction}
      />,
    );

    fireEvent.press(getByText('Back'));
    expect(mockBackAction).toHaveBeenCalled();
  });
});
