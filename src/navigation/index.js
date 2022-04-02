import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TripProvider } from '../contexts/TripProvider'
import Routes from './Routes'

const index = () => {
  return (
    <TripProvider>
        <Routes/>
    </TripProvider>
  )
}

export default index
