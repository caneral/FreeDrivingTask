import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const TaxVault = () => {
  return (
    <View style={styles.container}>
      <Text>TaxVault</Text>
    </View>
  )
}

export default TaxVault

const styles = StyleSheet.create({
  container:{
    display:'flex',
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  }
})