import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import GoogleSign from './GoogleSign';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(),
    signIn: jest.fn(),
  },
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}));

describe('GoogleSign Component', () => {
  const mockNavigate = jest.fn();
  const mockSetUserInfo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigation.mockReturnValue({navigate: mockNavigate});
  });

  it('renders correctly', () => {
    const {getByText} = render(<GoogleSign />);
    expect(getByText('Continue with Google')).toBeTruthy();
  });

  it('calls GoogleLogin on button press', async () => {
    GoogleSignin.hasPlayServices.mockResolvedValueOnce(true);
    GoogleSignin.signIn.mockResolvedValueOnce({
      data: {
        user: {email: 'test@example.com'},
        idToken: 'test-token',
      },
    });

    const {getByText} = render(<GoogleSign />);
    const button = getByText('Continue with Google');

    fireEvent.press(button);

    await waitFor(() => {
      expect(GoogleSignin.hasPlayServices).toHaveBeenCalled();
      expect(GoogleSignin.signIn).toHaveBeenCalled();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'userEmail',
        'test@example.com',
      );
      expect(mockNavigate).toHaveBeenCalledWith('Home');
    });
  });

  it('handles API errors gracefully', async () => {
    const apiError = {
      response: {
        data: {error: {message: 'Invalid credentials'}},
      },
    };

    GoogleSignin.hasPlayServices.mockResolvedValueOnce(true);
    GoogleSignin.signIn.mockRejectedValueOnce(apiError);

    const {getByText, queryByText} = render(<GoogleSign />);
    const button = getByText('Continue with Google');

    fireEvent.press(button);

    await waitFor(() => {
      expect(queryByText('Invalid credentials')).toBeTruthy();
    });
  });

  it('displays a default error message for unknown errors', async () => {
    GoogleSignin.hasPlayServices.mockResolvedValueOnce(true);
    GoogleSignin.signIn.mockRejectedValueOnce(new Error('Unexpected error'));

    const {getByText, queryByText} = render(<GoogleSign />);
    const button = getByText('Continue with Google');

    fireEvent.press(button);

    await waitFor(() => {
      expect(queryByText('Something went wrong')).toBeTruthy();
    });
  });

  it('shows a loading state while signing in', async () => {
    GoogleSignin.hasPlayServices.mockResolvedValueOnce(true);
    GoogleSignin.signIn.mockResolvedValueOnce({
      data: {
        user: {email: 'test@example.com'},
        idToken: 'test-token',
      },
    });

    const {getByText, queryByText} = render(<GoogleSign />);
    const button = getByText('Continue with Google');

    fireEvent.press(button);

    expect(queryByText('Loading...')).toBeTruthy();

    await waitFor(() => {
      expect(queryByText('Loading...')).toBeFalsy();
    });
  });
});
