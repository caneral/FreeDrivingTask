import {StyleSheet, Text, View, Image, ScrollView, Alert, BackHandler, useWindowDimensions} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import {TripContext} from '../contexts/TripProvider';


const Trips = () => {

  const layout = useWindowDimensions()

  const {trip} = useContext(TripContext);

  const chooseActivity = activity => {
    switch (activity) {
      case 'running':
        return (
          <Image
            style={styles.activity}
            source={{
              uri: 'https://media.baamboozle.com/uploads/images/147794/1602797609_894681',
            }}
          />
        );
      case 'on_foot':
        return (
          <Image
            style={styles.activity}
            source={{
              uri: 'https://cdn.dribbble.com/users/2977519/screenshots/14440014/walk-cycle-animation.gif',
            }}
          />
        );
      case 'in_vehicle':
        return (
          <Image
            style={styles.activity}
            source={{
              uri: 'https://i.pinimg.com/originals/1f/b3/fd/1fb3fd287f851da90e3ec73b10be294a.gif',
            }}
          />
        );
        case 'unknown':
        return (
          <Image
            style={styles.activity}
            source={{
             uri:'https://i.pinimg.com/originals/5a/65/ee/5a65ee278cd557143f05a4ba91abbfa8.gif'
            }}
          />
        );
    }
  };

  return (
    <View style={styles.Container}>
      <View style={styles.Header}>
        <Text style={styles.yourTrips}>Your Trips</Text>
      </View>
      {trip.length === 0 && (
        <View style={styles.noTrip}>
          <Text>No trips found</Text>
          <Image
            style={styles.noTripImage}
            source={{
              uri: 'https://media1.giphy.com/media/dYUslDahf6Uw71gH3t/giphy.gif?cid=6c09b9521lfmya1prgt95ym8n3gq3inrurbaf7mr80u8ued0&rid=giphy.gif&ct=s',
            }}
          />
        </View>
      )}
      <ScrollView>
        {trip?.map((item, index) => {
          return (
            <View style={styles.Card} key={index}>
              <View style={styles.CardHeader}>
                <Text style={styles.HeaderText}>{item?.odometer} km logged</Text>
                {chooseActivity(item?.activity)}
              </View>
              <View style={styles.CardBody}>
                <Image
                  style={styles.CardImage}
                  source={{
                    uri: item.imageUri,
                  }}
                />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Trips;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    marginVertical: '4%',
  },
  Card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    margin: 28,
    backgroundColor: 'white',
    height: 280,
    marginVertical: '5%',
  },
  CardHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  HeaderText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 20,
  },
  CardImage: {
    resizeMode:'cover',
    height:216,
    width:'100%',
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  yourTrips: {
    fontSize: 24,
    fontWeight: '700',
  },
  Header: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 32,
  },
  activity: {
    width: 40,
    height: 40,
  },
  noTrip: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  noTripImage: {
    width: 200,
    height: 200,
  },
});
