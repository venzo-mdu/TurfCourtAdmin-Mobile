import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {Image, TouchableOpacity, View, Text} from 'react-native';
import ArenaScreen from '../screens/courtAdmin/Arena/ArenaDetails/ArenaScreen';
import BookingScreen from '../screens/courtAdmin/Arena/ArenaDetails/BookingScreen';
import CourtScreen from '../screens/courtAdmin/Arena/ArenaDetails/CourtScreen';
import ReviewScreen from '../screens/courtAdmin/Arena/ArenaDetails/ReviewScreen';
import {IMAGES} from '../assets/constants/global_images';
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../assets/constants/global_colors';
import { ADMINARENA, ADMINHOME } from '../screens';
import IndexHome from '../screens/courtAdmin/Home/indexHome';

const Tab = createMaterialTopTabNavigator();

function CustomTabBar({state, descriptors, navigation, stackNavigation}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        paddingVertical: 20,
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
            stackNavigation.setOptions({headerTitle: label});
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        let iconName, focusedIconName;
        switch (route.name) {
          case 'Add Arena':
            iconName = IMAGES.ArenaNoFoucs;
            focusedIconName = IMAGES.ArenaFoucs;
            break;
          case 'Court':
            iconName = IMAGES.CourtFoucs;
            focusedIconName = IMAGES.CourtNoFoucs;
            break;
          case 'Booking':
            iconName = IMAGES.BookingFoucs;
            focusedIconName = IMAGES.BookingNoFoucs;
            break;
          case 'Reviews':
            iconName = IMAGES.ReviewsFoucs;
            focusedIconName = IMAGES.ReviewsNoFoucs;
            break;
        }

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              backgroundColor: isFocused ? '#097E52' : '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 5,
              borderRadius: 6,
              elevation: 0.5,
              height: 92,
            }}
            key={route.key}>
            <Image source={isFocused ? iconName : focusedIconName} />
            <Text
              style={{
                color: isFocused ? '#fff' : '#192335',
                fontSize: 12,
                paddingTop: 5,
                fontFamily: 'Outfit-Regular',
                lineHeight: 22,
              }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function AdminTopTabNavigation({route, navigation,isAddArena}) {
  console.log(isAddArena,'flase-----')
  const {groundID} = route.params || {};

  return (
    <Tab.Navigator
      initialRouteName="Add Arena"
      tabBar={props => <CustomTabBar {...props} stackNavigation={navigation} />}
      screenOptions={({route}) => ({
        headerShown: true,
        headerTitle: route.name,
        headerTitleAlign: 'center',
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: '#F9F9F9',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.navigate(IndexHome)}>
            <Icon name="angle-left" size={32} color="#4CA181" />
          </TouchableOpacity>
        ),
      })}>
      <Tab.Screen
        name="Add Arena"
        component={ArenaScreen}
        initialParams={{groundID}}
        options={{tabBarLabel: 'Court Details'}}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#F9F9F9',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        }}
      />
      <Tab.Screen
        name="Court"
        component={CourtScreen}
        initialParams={{groundID}}
        options={{tabBarLabel: 'Court'}}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#F9F9F9',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        }}
      />
      <Tab.Screen
        name="Booking"
        component={BookingScreen}
        initialParams={{groundID}}
        options={{tabBarLabel: 'Booking'}}
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.WHITE,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        }}
      />
      <Tab.Screen
        name="Reviews"
        component={ReviewScreen}
        initialParams={{groundID}}
        options={{tabBarLabel: 'Reviews'}}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#F9F9F9',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        }}
      />
    </Tab.Navigator>
  );
}
