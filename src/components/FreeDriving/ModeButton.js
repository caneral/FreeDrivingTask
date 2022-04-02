import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const ModeButton = ({enabled, modeFunction}) => {
  return (
    <TouchableOpacity
      style={styles.button(enabled)}
      onPress={() => modeFunction()}>
      <MaterialCommunityIcons
        name="steering"
        size={32}
        color="white"
        style={{margin: 5}}
      />
      <Text style={styles.text}>Free Driving</Text>
    </TouchableOpacity>
  );
};

export default ModeButton;

const styles = StyleSheet.create({
    button: enabled => ({
        position: 'absolute',
        backgroundColor: enabled ? 'red' : '#243D25',
        bottom: '1%',
        left: 20,
        right: '20%',
        elevation: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        height: 55,
        flexDirection: 'row',
      }),
      text: {
        color: 'white',
      },
});
