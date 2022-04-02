import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import BackgroundGeolocation, {
  State,
} from 'react-native-background-geolocation';
import {TripContext} from '../contexts/TripProvider';
import Header from '../components/FreeDriving/Header';
import ModeButton from '../components/FreeDriving/ModeButton';
import {searchGooglePlaces, CONF_API_KEY} from '../api';

/// Zoom values for the MapView
const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = 0.00421;

const FreeDriving = () => {
  const {setTrip} = useContext(TripContext);

  const [isMoving, setIsMoving] = React.useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const [location, setLocation] = useState('');
  const [markers, setMarkers] = useState([]);
  const [markersList, setMarkersList] = useState(null);
  const [tracksViewChanges, setTracksViewChanges] = useState(false);
  const [odometer, setOdometer] = useState(0);
  const mapRef = useRef(null);
  const [uri, setUri] = useState(null);
  const [motionActivityEvent, setMotionActivityEvent] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    latitude: 39.750359,
    longitude: 37.015598,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const destination = (lats, longs) => {
    return {
      accuracy: 16,
      altitude: 0,
      heading: 0,
      latitude: lats,
      longitude: longs,
      speed: 0,
    };
  };

  const setNearbyMarkers = markerData => {
    const pinColor = 'red';
    let markers = markerData?.map((item, index) => {
      coordinateData = destination(
        item.geometry.location.lat,
        item.geometry.location.lng,
      );
      let {photos, icon} = item;
      let url;
      {
        photos !== undefined && photos[0].photo_reference !== undefined
          ? (url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=150&maxheight=150&photoreference=${photos[0].photo_reference}&key=${CONF_API_KEY}`)
          : (url = icon);
      }

      return (
        <View key={index}>
          <Marker
            coordinate={coordinateData}
            title={item.name}
            description={item.vicinity}
            pinColor={pinColor}
            // onPress={(event) =>
            //   onPressMarker(event, url, item.name, item.vicinity)
            // }
          />
        </View>
      );
    });
    setMarkersList(markers);
  };

  const search = async (query, radius, location) => {
    lat = location.coords.latitude;
    long = location.coords.longitude;
    radius = radius;
    query = query;

    const response = await searchGooglePlaces(lat, long, radius, query);

    setNearbyMarkers(response);
  };

  /// Configure BackgroundGeolocation.ready
  const initBackgroundGeolocation = async () => {
    // Ready the SDK and fetch the current state.
    const state = await BackgroundGeolocation.ready({
      // Debug
      reset: false,
      debug: true,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      // Geolocation
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_NAVIGATION,
      distanceFilter: 10,
      stopTimeout: 5,
      // Permissions
      locationAuthorizationRequest: 'Always',
      backgroundPermissionRationale: {
        title:
          "Allow {applicationName} to access this device's location even when closed or not in use.",
        message:
          'This app collects location data to enable recording your trips to work and calculate distance-travelled.',
        positiveAction: 'Change to "{backgroundPermissionOptionLabel}"',
        negativeAction: 'Cancel',
      },
      // HTTP & Persistence
      autoSync: true,
      maxDaysToPersist: 14,
      // Application
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
    });

    setOdometer(state.odometer);
    setEnabled(state.enabled);
    setIsMoving(state.isMoving || false);
  };

  useEffect(() => {
    if (!location) return;
    setOdometer(location.odometer);
  }, [location]);

  /// onLocation effect
  useEffect(() => {
    if (!location) return;
    onLocation();
  }, [location]);

  /// onLocation effect-handler
  /// Adds a location Marker to MapView
  const onLocation = () => {
    console.log('[location] - ', location);
    if (!location.sample) {
      addMarker(location);
    }
    setCenter(location);

    const runAsyncFunc = async location => {
      await search('nearby', 3000, location);
      return;
    };

    runAsyncFunc(location);
  };

  useEffect(() => {
    const onLocation = BackgroundGeolocation.onLocation(
      location => {
        console.log('[onLocation]', location);
        setLocation(location);
      },
      error => {
        console.log('[onLocation] ERROR: ', error);
      },
    );

    const onMotionChange = BackgroundGeolocation.onMotionChange(event => {
      console.log('[onMotionChange]', event);
    });

    const onActivityChange = BackgroundGeolocation.onActivityChange(event => {
      console.log('[onActivityChange]', event);
      setMotionActivityEvent(event);
    });

    const onProviderChange = BackgroundGeolocation.onProviderChange(event => {
      console.log('[onProviderChange]', event);
    });

    initBackgroundGeolocation();

    return () => {
      onLocation.remove();
      onMotionChange.remove();
      onActivityChange.remove();
      onProviderChange.remove();
    };
  }, []);

  const takeSnapshot = useCallback(() => {
    if (!mapRef || !mapRef.current) {
      return;
    }

    const snapshot = mapRef.current.takeSnapshot({
      format: 'png',
      quality: 0.5,
      result: 'file',
    });

    snapshot.then(uri => {
      setUri(uri);
    });
  }, [mapRef]);

  /// Add a location Marker to map.
  const addMarker = location => {
    const timestamp = new Date();
    const marker = {
      key: `${location.uuid}:${timestamp.getTime()}`,
      title: location?.timestamp,
      heading: location?.coords.heading,
      coordinate: {
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude,
      },
    };

    setMarkers(previous => [...previous, marker]);
    setCoordinates(previous => [
      ...previous,
      {
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude,
      },
    ]);
  };

  /// Center the map.
  const setCenter = location => {
    setMapCenter({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  };

  useEffect(() => {
    if (enabled) {
      BackgroundGeolocation.start();
    } else {
      BackgroundGeolocation.stop();
      setLocation('');
      clearMarkers();
    }
  }, [enabled]);

  /// Clear all markers from the map when plugin is toggled off.
  const clearMarkers = () => {
    setCoordinates([]);
    setMarkers([]);
  };

  /// Reset the odometer.
  const resetOdometer = async () => {
    BackgroundGeolocation.resetOdometer().then(location => {
      // This is the location where odometer was set at.
      console.log('[setOdometer] success: ', location);
    });
  };

  /// MapView Location marker-renderer.
  const renderMarkers = () => {
    let rs = [];
    markers.map(marker => {
      rs.push(
        <Marker
          key={marker.key}
          tracksViewChanges={tracksViewChanges}
          coordinate={marker.coordinate}
          anchor={{x: 0, y: 0.1}}
          title={marker.title}>
          <View style={[styles.markerIcon]}></View>
        </Marker>,
      );
    });
    return rs;
  };

  const modeFunction = () => {
    if (enabled) {
      takeSnapshot();
       if ((odometer / 1000).toFixed(1) > 0.0)
      setModalVisible(!modalVisible);
    } else {
      resetOdometer();
    }
    setEnabled(!enabled);
  };

  const saveTheTrip = () => {
    setModalVisible(!modalVisible);
    const trip = {
      imageUri: uri,
      activity: motionActivityEvent ? motionActivityEvent.activity : 'unknown',
      odometer: (odometer / 1000).toFixed(1),
    };
    if ((odometer / 1000).toFixed(1) > 0.0) {
      setTrip(previous => [...previous, trip]);
    }
    setCoordinates([]);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F7CCAC'}}>
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Congratulations 🎉</Text>
              <Text style={{fontSize: 24}}>
                You have driven {(odometer / 1000).toFixed(1)} km 🛵
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: '#00AFC1',
                  padding: 12,
                  borderRadius: 16,
                  marginTop: 12,
                }}
                onPress={() => saveTheTrip()}>
                <Text style={{fontSize: 24, color: 'white', fontWeight: '600'}}>
                  SAVE THE TRIP
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Header />
        <MapView
          ref={mapRef}
          style={{flex: 1, position: 'relative'}}
          provider={PROVIDER_GOOGLE}
          region={mapCenter}
          showsUserLocation={true}
          showsCompass={true}
          showsMyLocationButton={true}
          rotateEnabled={false}
          showsTraffic={false}>
          <Polyline
            key="polyline"
            coordinates={coordinates}
            strokeColor="rgba(0,179,253, 0.6)"
            geodesic={true}
            zIndex={0}
            strokeWidth={6}
          />
          {renderMarkers()}
          {markersList !== null ? markersList : undefined}
        </MapView>
        <View style={styles.odometer}>
          <Text style={styles.statusBar}>
            {(odometer / 1000).toFixed(1)} km
          </Text>
        </View>
        <ModeButton enabled={enabled} modeFunction={modeFunction} />
      </View>
    </SafeAreaView>
  );
};

export default FreeDriving;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },

  text: {
    color: 'white',
  },
  markerIcon: {
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#00B3FD',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  odometer: {
    position: 'absolute',
    backgroundColor: '#826F66',
    top: '12%',
    right: '4%',
    left: '75%',
    elevation: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    height: 30,
  },
  statusBar: {
    color: 'white',
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '4%',
  },
  modalView: {
    margin: '2%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  modalText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
  },
});
