import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React, {Fragment} from 'react'
import Navigation from './src/navigation'
const App = () => {
  return (
    <Fragment>
      <SafeAreaView style={styles.container}/>
      <Navigation/>
    </Fragment>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: '#F7CCAC',
  },
});
