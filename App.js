import React, { Component } from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  Alert,
  TouchableHighlight,
  Image,
  BackHandler,
} from 'react-native';
import MessageList from "./components/MessageList";
import { createImageMessage, createLocationMessage, createTextMessage } from "./utils/MessageUtils";

import Toolbar from "./components/Toolbar";

class App extends Component {
  state = {
    messages: [
      createImageMessage('https://unsplash.it/300/300'),
      createTextMessage('Alfonso'),
      createTextMessage('Jay'),
      createLocationMessage({
        latitude: 14.6256144,
        longitude: 121.061769,
      }),
    ],
    fullscreenImageId: null,
    isInputFocused: true,
  };

  componentDidMount() {
    this.subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      const { fullscreenImageId } = this.state;
      if (fullscreenImageId) {
        this.dismissFullscreenImage();
        return true;
      }
      return false;
    });
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  handlePressMessage = ({ id, type, text }) => {
    switch (type) {
      case 'text':
        Alert.alert(
          'Delete message?',
          `Are you sure you want to permanently delete this message: ${text}?`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                const { messages } = this.state;
                this.setState({
                  messages: messages.filter(message => message.id !== id),
                });
              },
            },
          ],
        );
        break;
      case 'image':
        this.setState({ fullscreenImageId: id });
        break;
      default:
        break;
    }
  };

  dismissFullscreenImage = () => {
    this.setState({ fullscreenImageId: null });
  };

  handleChangeFocus = (isFocused) => {
    this.setState({ isInputFocused: isFocused });
  };

  handleSubmit = (text) => {
    const { messages } = this.state;
    this.setState({
      messages: [createTextMessage(text), ...messages],
    });
  };

  renderMessageList() {
    const { messages } = this.state;

    return (
      <View style={styles.content}>
        <MessageList messages={messages} onPressMessage={this.handlePressMessage} />
      </View>
    );
  }

  renderFullscreenImage = () => {
    const { messages, fullscreenImageId } = this.state;

    if (!fullscreenImageId) return null;

    const image = messages.find(message => message.id === fullscreenImageId);

    if (!image) return null;

    const { uri } = image;

    return (
      <View style={styles.fullscreenOverlay}>
        <TouchableHighlight
          style={styles.fullscreenImageContainer}
          onPress={this.dismissFullscreenImage}
        >
          <Image
            style={styles.fullscreenImage}
            source={{ uri: uri }}
            resizeMode="contain"
          />
        </TouchableHighlight>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('./assets/Rawr.jpg')}
          style={styles.backgroundImage}
        >
          {this.renderMessageList()}
          {this.renderFullscreenImage()}
          {/* Add the Toolbar component */}
          <Toolbar
            isFocused={this.state.isInputFocused}
            onSubmit={this.handleSubmit}
            onChangeFocus={this.handleChangeFocus}
            onPressCamera={this.handlePressToolbarCamera}
            onPressLocation={this.handlePressToolbarLocation}
          />
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'stretch',
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  fullscreenImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default App;