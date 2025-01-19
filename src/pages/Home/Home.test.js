import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {MockedProvider} from '@apollo/client/testing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import Home, {GET_HOTELS, BOOK_HOTEL, GET_BOOKED_HOTELS} from './Home';

jest.mock('react-native-simple-toast', () => ({
  showWithGravity: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({navigate: jest.fn()}),
}));

const mockHotelsData = {
  hotels: [
    {
      hotel_id: 1,
      hotel_name: 'Test Hotel',
      city: 'Test City',
      country: 'Test Country',
      star_rating: 5,
      rates_from: 100,
      rates_currency: 'USD',
      photo1: 'test-photo',
    },
  ],
};

const mocks = [
  {
    request: {query: GET_HOTELS},
    result: {data: mockHotelsData},
  },
  {
    request: {
      query: BOOK_HOTEL,
      variables: {
        hotel_id: 1,
        email: 'test@example.com',
        booking_date: '2025-01-19',
      },
    },
    result: {data: {bookHotel: {id: 1}}},
  },
  {
    request: {query: GET_BOOKED_HOTELS, variables: {email: 'test@example.com'}},
    result: {
      data: {
        getBookedHotels: [
          {
            hotel_id: 1,
            hotel_name: 'Test Hotel',
            city: 'Test City',
            country: 'Test Country',
            booking_date: '2025-01-19',
            star_rating: 5,
          },
        ],
      },
    },
  },
];

describe('Home Component', () => {
  beforeEach(() => {
    AsyncStorage.getItem = jest.fn(async key => {
      if (key === 'userEmail') return 'test@example.com';
      return null;
    });
  });

  it('renders hotels correctly', async () => {
    const {getByText, queryByText} = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Home />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(queryByText('Loading...')).toBeNull();
      expect(getByText('Test Hotel')).toBeTruthy();
      expect(getByText('Test City, Test Country - 5⭐')).toBeTruthy();
      expect(getByText('From 100 USD')).toBeTruthy();
    });
  });

  it('displays the booking history modal', async () => {
    const {getByText, queryByText} = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Home />
      </MockedProvider>,
    );

    const bookingHistoryButton = getByText('View booking history');
    fireEvent.press(bookingHistoryButton);

    await waitFor(() => {
      expect(getByText('Booked Hotels for "test@example.com"')).toBeTruthy();
      expect(getByText('Test Hotel')).toBeTruthy();
      expect(getByText('Booking Date - 2025-01-19')).toBeTruthy();
    });

    const hideButton = getByText('Hide');
    fireEvent.press(hideButton);

    expect(queryByText('Booked Hotels for "test@example.com"')).toBeNull();
  });

  it('books a hotel successfully', async () => {
    const {getByText} = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Home />
      </MockedProvider>,
    );

    const bookButton = await waitFor(() => getByText('Book now!'));
    fireEvent.press(bookButton);

    await waitFor(() => {
      expect(Toast.showWithGravity).toHaveBeenCalledWith(
        'Booking Successful',
        Toast.SHORT,
        Toast.BOTTOM,
        expect.any(Object),
      );
    });
  });

  it('handles errors while booking a hotel', async () => {
    const errorMock = [
      {
        request: {
          query: BOOK_HOTEL,
          variables: {
            hotel_id: 1,
            email: 'test@example.com',
            booking_date: '2025-01-19',
          },
        },
        error: new Error('Booking failed'),
      },
    ];

    const {getByText} = render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <Home />
      </MockedProvider>,
    );

    const bookButton = await waitFor(() => getByText('Book now!'));
    fireEvent.press(bookButton);

    await waitFor(() => {
      expect(Toast.showWithGravity).toHaveBeenCalledWith(
        'Booking failed',
        Toast.SHORT,
        Toast.BOTTOM,
        expect.any(Object),
      );
    });
  });
});
