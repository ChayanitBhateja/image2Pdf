import React, { useState } from 'react';
import { View, Text, StyleSheet, Button,Dimensions, Image } from 'react-native';
import RNImageToPdf from 'react-native-image-to-pdf';
import ImagePicker from 'react-native-image-crop-picker';
export default App = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [pdf, setPdf] = useState();
  const height = Dimensions.get('window').height;
  const width = Dimensions.get('window').width;
  const handleOnPress = async () => {
    let options = {
      title: 'Select Image',
      customButtons: [
        {name: 'customOptionKey', title: 'Choose Photo from Custom Option'},
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri};

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        // this.setState({
        //   filePath: response,
        //   fileData: response.data,
        //   fileUri: response.uri,
        // });
      }
    });
  }
  const handleLaunchCamera = () => {
   ImagePicker.openCamera({
     width: 1080,
     height: 1200,
    //  cropping: true,
   }).then(image => {
     console.log(image);
     setSelectedImages([image]);
   });
  };

  const handleLaunchImageLibrary = () => {
   ImagePicker.openPicker({
     multiple: true,
   }).then(images => {
     console.log(images);
     setSelectedImages(images);
   });
  };

  const pdfFunction = async () => {
    const paths = selectedImages.map(image => image.path.split('file://')[1]);

    console.log(paths);
    try {
        const options = {
          imagePaths: paths,
          filePath:"/storage/emulated/0/Documents/",
            name: 'ImagesInPdf.pdf',
            maxSize: { // optional maximum image dimension - larger images will be resized
                width: 1080,
                height: 1200
            },
            quality: .7, // optional compression paramter
        };
        const pdf = await RNImageToPdf.createPDFbyImages(options);
        
      console.log(pdf);
      setPdf(pdf);
    } catch(e) {
        console.log(e);
    }
  }

  console.log("selectedImage.length", selectedImages.length);
  selectedImages.length > 0 ? pdfFunction() : null;

  return (
    <View style={styles.container}>
      {/* <Button title="Open Gallary" onPress={handleOnPress} /> */}
      <Button title="Open Camera" onPress={handleLaunchCamera} />
      <Button title="Open Image Gallary" onPress={handleLaunchImageLibrary} />
      {pdf ? (<Text>
        your pdf is at location: {pdf.filePath}
      </Text>):null}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
});
