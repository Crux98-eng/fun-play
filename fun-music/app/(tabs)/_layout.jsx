import React, { useState } from 'react';
import { router, Stack } from 'expo-router';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  Text, 
  Image, 
  Button 
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';

const TabsLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  const handleSelectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setSelectedImage(imageUri);

      try {
        await AsyncStorage.setItem('coverImage', imageUri); // Save to AsyncStorage
        console.log('Image URI saved to storage:', imageUri);
      } catch (error) {
        console.error('Error saving image URI:', error);
      }

      setIsOpen(false);
    }
  };

  return (
    <>
      <Stack>
        <Stack.Screen
          name="home"
          options={{
            headerShown: true,
            title: 'Fun Music',
            headerStyle: { backgroundColor: Colors.secondary },
            headerTintColor: 'white',
            headerRight: () => (
              <View style={styles.settings}>
                <TouchableOpacity onPress={handleOpenModal}>
                  <MaterialIcons name="settings-suggest" size={24} color="white" />
                </TouchableOpacity>
              </View>
            ),
          }}
        />
      </Stack>

      {/* Modal for image selection */}
      <Modal visible={isOpen} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Select an Image</Text>

            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            )}

            <Button title="Choose from Gallery" onPress={handleSelectImage} />
            <Button style={styles.btnClose} title="Close" onPress={handleCloseModal} color="red" />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  settings: {
    marginRight: 10,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
     minWidth: '80%',
    minHeight: 300,
    gap:30,
  },
  previewImage: {
    width: 200,
    height: 150,
    marginBottom: 20,
    borderRadius: 8,
  },
 
});
