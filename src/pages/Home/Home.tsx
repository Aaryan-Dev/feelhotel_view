import React, {useState} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Button,
  TouchableOpacity,
} from 'react-native';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
  useMutation,
} from '@apollo/client';
import DatePicker from 'react-native-date-picker';

export const GET_HOTELS = gql`
  query {
    hotels {
      hotel_id
      chain_name
      hotel_name
      city
      country
      star_rating
      latitude
      longitude
      photo1
      overview
      rates_from
      rates_currency
    }
  }
`;

const BOOK_HOTEL = gql`
  mutation BookHotel($hotel_id: Int!, $email: String!, $booking_date: String!) {
    bookHotel(hotel_id: $hotel_id, email: $email, booking_date: $booking_date) {
      id
      hotel_id
      email
      booking_date
    }
  }
`;

const Home = () => {
  const {loading, error, data} = useQuery(GET_HOTELS);
  const [
    bookHotel,
    {
      data: hotelBookingData,
      loading: hotelBookinLoading,
      error: hotelBookinError,
    },
  ] = useMutation(BOOK_HOTEL);
  const [date, setDate] = useState(new Date());

  const handleBook = hotelId => {
    bookHotel({
      variables: {
        hotel_id: parseInt(hotelId),
        email: 'user@example.com',
        booking_date: date,
      },
    })
      .then(response => {
        console.log('Booking Successful:', response.data);
      })
      .catch(err => {
        console.error('Booking Failed:', err.message);
      });
  };

  const handleBookingHistory = () => {};

  const handleLogout = () => {};

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <SafeAreaView>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 5,
          backgroundColor: 'black',
        }}>
        <TouchableOpacity onPress={handleBookingHistory}>
          <Text
            style={{
              color: 'white',
              textDecorationLine: 'underline',
              textDecorationColor: 'white',
              textDecorationStyle: 'solid',
            }}>
            View booking history
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Text
            style={{
              color: '#3198FF',
            }}>
            log out
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data.hotels}
        keyExtractor={item => item.hotel_id.toString()}
        renderItem={({item}) => (
          <View style={styles.hotelBox}>
            <View style={styles.card}>
              <Image
                source={require('../../assets/hotel_icon.png')}
                style={styles.image}
              />
              <Text style={styles.title}>{item.hotel_name}</Text>
              <Text style={styles.subtitle}>
                {item.city}, {item.country} - {item.star_rating}⭐
              </Text>
              <Text style={styles.price}>
                From {item.rates_from} {item.rates_currency}
              </Text>
            </View>

            <View style={{display: 'flex', width: 50}}>
              <DatePicker mode="date" date={date} onDateChange={setDate} />
              <View
                style={{
                  display: 'flex',
                  width: 200,
                  borderWidth: 2,
                  padding: 5,
                }}>
                <TouchableOpacity onPress={() => handleBook(item?.hotel_id)}>
                  <Text>Book now!</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const App = () => (
  <View style={{flex: 1, padding: 10}}>
    <Home />
  </View>
);

const styles = StyleSheet.create({
  hotelBox: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  card: {
    justifyContent: 'flex-start',
    width: 150,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00aaff',
  },
});

export default App;
