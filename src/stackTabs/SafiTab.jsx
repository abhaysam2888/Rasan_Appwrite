import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';

const SafiTab = ({ route  }) => {
  const { image } = route.params || {};
  return (
    <View style={styles.container}>
      {image ? (
        <Image
          source={{ uri: image }}
          style={styles.image}
          onError={() => console.log('Error loading image')}
        />
      ) : (
        <Text>No image available</Text>
      )}
    </View>
  );
};

export default SafiTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#161622',
  },
  image: {
    marginTop: 70,
    width: 420,
    height: 600,
  },
});
