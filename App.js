import React, {useEffect} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './src/route/navigationService';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import AuthRoute from './src/route/authRoute';
import reducers from './src/reducers/index';
import LoadingIndicator from './src/components/loadingIndicator';
import Toast from 'react-native-toast-message';
import SuccessAnimation from './src/components/successAnimation';
import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';
// import firebase from 'react-native-firebase';
// Register background handler
// Get the notification
messaging().setBackgroundMessageHandler(async remoteMessage => {
  // Extract the body
  let message_body = remoteMessage.notification.body;
  // Extract the title
  let message_title = remoteMessage.notification.title;
  // Extract the notification image
  let avatar = remoteMessage.notification.android.imageUrl;

  // Add the notification to the messages array
  // setMessages(messages => GiftedChat.append(messages, {
  //     _id: Math.round(Math.random() * 1000000),
  //     text: message_body,
  //     createdAt: new Date(),
  //     user: {
  //         _id: 2,
  //         name: "PartyB",
  //         avatar: avatar,
  //     },
  // }));

  // Send a notification alert
  Alert.alert(message_title, message_body);
});

const App = () => {
  const store = createStore(reducers);

  const createNotificationChannel = () => {
    // Build a android notification channel
    const channel = new firebase.notifications.Android.Channel(
      'reminder', // channelId
      'Reminders Channel', // channel name
      firebase.notifications.Android.Importance.High, // channel importance
    ).setDescription('Used for getting reminder notification'); // channel description
    // Create the android notification channel
    firebase.notifications().android.createChannel(channel);
  };

  const checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      // We've the permission
      this.notificationListener = firebase
        .notifications()
        .onNotification(async notification => {
          // Display your notification
          await firebase.notifications().displayNotification(notification);
        });
    } else {
      // user doesn't have permission
      try {
        await firebase.messaging().requestPermission();
      } catch (error) {
        Alert.alert(
          'Unable to access the Notification permission. Please enable the Notification Permission from the settings',
        );
      }
    }
  };

  useEffect(() => {
    const subscribe = messaging().onMessage(async remoteMessage => {
      // Get the message body
      let message_body = remoteMessage.notification.body;

      // Get the message title
      let message_title = remoteMessage.notification.title;

      // Get message image
      let avatar = remoteMessage.notification.android.imageUrl;

      // // Append the message to the current messages state
      // setMessages(messages => GiftedChat.append(messages, {
      //     _id: Math.round(Math.random() * 1000000),
      //     text: message_body,
      //     createdAt: new Date(),
      //     user: {
      //         _id: 2,
      //         name: "PartyB",
      //         avatar: avatar,
      //     },
      // }));

      // Show an alert to the user
      Alert.alert(message_title, message_body);
    });

    return subscribe;
  }, []);

  return (
    <Provider store={store}>
      <LoadingIndicator />
      <SuccessAnimation />
      <NavigationContainer ref={navigationRef}>
        <AuthRoute />
        <Toast ref={ref => Toast.setRef(ref)} />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
