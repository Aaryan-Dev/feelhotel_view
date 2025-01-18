import React from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:5001/',
  cache: new InMemoryCache(),
});

const GET_HOTELS = gql`
  query {
    hotels {
      hotel_id
      hotel_name
      city
      country
      star_rating
      rates_from
      rates_currency
      photo1
    }
  }
`;

const Home = () => {
  const {loading, error, data} = useQuery(GET_HOTELS);
  console.log('error', error);
  console.log('data', data);
  console.log('loading', loading);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <SafeAreaView>
      <FlatList
        data={data.hotels}
        keyExtractor={item => item.hotel_id.toString()}
        renderItem={({item}) => (
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
        )}
      />
    </SafeAreaView>
  );
};

const App = () => (
  <ApolloProvider client={client}>
    <View style={{flex: 1, padding: 10}}>
      <Home />
    </View>
  </ApolloProvider>
);

const styles = StyleSheet.create({
  card: {
    justifyContent: 'flex-start',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    height: 200,
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
