import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

const BackAction: React.FC = ({
  backAction,
  content,
  handleCustomNavigation,
}) => {
  const handleBackNavigation = () => {
    backAction();
  };

  return (
    <View style={styles.backActionBar}>
      <TouchableOpacity
        onPress={handleBackNavigation}
        style={styles.backAction}>
        <View style={styles.backText}>
          <FontAwesome6 name="arrow-left" iconStyle="solid" />
          <Text>Back</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCustomNavigation}>
        <View>
          <Text style={{color: '#3198FF'}}>{content}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  backActionBar: {
    width: 350,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
  },
  backAction: {
    padding: 5,
    paddingLeft: 0,
  },
  backText: {
    display: 'flex',
    flexDirection: 'row',
    gap: '5',
    alignContent: 'center',
    alignItems: 'center',
  },
});

export default BackAction;
