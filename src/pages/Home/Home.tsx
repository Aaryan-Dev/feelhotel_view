import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  SafeAreaView,
  SafeAreaProvider,
  Button,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
  useLazyQuery,
  useMutation,
} from '@apollo/client';
import Toast from 'react-native-simple-toast';
import {jwtDecode} from 'jwt-decode';
import {useNavigation} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

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

const GET_BOOKED_HOTELS = gql`
  query GetBookedHotels($email: String!) {
    getBookedHotels(email: $email) {
      hotel_id
      chain_name
      booking_date
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

const Home: React.FC = () => {
  const {loading, error, data} = useQuery(GET_HOTELS);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [
    bookHotel,
    {
      data: hotelBookingData,
      loading: hotelBookinLoading,
      error: hotelBookinError,
    },
  ] = useMutation(BOOK_HOTEL);

  const [
    getBookedHotels,
    {
      data: getBookedHistoryData,
      loading: getBookedHistoryLoading,
      error: getBookedHistoryError,
    },
  ] = useLazyQuery(GET_BOOKED_HOTELS);

  const [date, setDate] = useState(new Date());

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token !== null) {
        return jwtDecode(token);
      }
    } catch (error) {
      console.error('Failed to retrieve token:', error);
    }
  };

  const handleBook = async hotelId => {
    const userEmail = await AsyncStorage.getItem('userEmail');
    const userdData = await getToken();
    bookHotel({
      variables: {
        hotel_id: parseInt(hotelId),
        email: userEmail || userdData?.email,
        booking_date: date,
      },
    })
      .then(response => {
        console.log('Booking Successful:', response.data);
        Toast.showWithGravity('Booking Successful', Toast.SHORT, Toast.BOTTOM, {
          backgroundColor: 'green',
        });
      })
      .catch(err => {
        Toast.showWithGravity(err?.message, Toast.SHORT, Toast.BOTTOM, {
          backgroundColor: '#A70D2A',
        });
      });
  };

  const handleBookingHistory = async () => {
    const userEmail = await AsyncStorage.getItem('userEmail');
    const userdData = await getToken();
    getBookedHotels({variables: {email: userEmail || userdData?.email}});
    setModalVisible(true);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userEmail');
      console.log('Token removed successfully!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  };

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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Booked Hotels</Text>
            {!getBookedHistoryData?.getBookedHotels && (
              <Text style={styles.modalText}>No records found!</Text>
            )}
            <FlatList
              data={getBookedHistoryData?.getBookedHotels}
              keyExtractor={item =>
                item.hotel_id.toString() + item.booking_date
              }
              renderItem={({item}) => (
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    marginBottom: 15,
                  }}>
                  <Image
                    source={require('../../assets/hotel_icon.png')}
                    style={styles.image}
                  />
                  <Text style={styles.title}>{item.hotel_name}</Text>
                  <Text style={styles.subtitle}>
                    {item.city}, {item.country} - {item.star_rating}⭐
                  </Text>
                  <Text style={styles.subtitle}>
                    Booking Date - {item.booking_date}
                    <MaterialDesignIcons name="calendar-today" size={15} />
                  </Text>
                </View>
              )}
            />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Hide</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  centeredView: {
    width: 400,
    height: 500,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    width: 400,
    height: 500,
    backgroundColor: 'white',
    padding: 10,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    margin: 10,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: 'black',
  },
  buttonClose: {
    backgroundColor: 'black',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default App;
