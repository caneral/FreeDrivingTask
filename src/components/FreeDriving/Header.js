import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import FeatherIcons from 'react-native-vector-icons/Feather';

const Header = () => {
  return (
    <View style={styles.header}>
      <View style={styles.iconandinput}>
        <TextInput style={styles.input} placeholder="Search" />
        <FeatherIcons
          name="search"
          size={20}
          color="black"
          style={{position: 'absolute', left: 5}}
        />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#F7CCAC',
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  input: {
    height: 40,
    color: 'black',
    width: '90%',
    fontSize: 16,
    paddingLeft: 12,
  },
  iconandinput: {
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
    borderRadius: 24,
  },
});
