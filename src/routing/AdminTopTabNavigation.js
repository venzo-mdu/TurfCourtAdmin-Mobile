import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Image, TouchableOpacity, View, Text } from 'react-native';
import ArenaScreen from '../screens/courtAdmin/Arena/ArenaDetails/ArenaScreen';
import BookingScreen from '../screens/courtAdmin/Arena/ArenaDetails/BookingScreen';
import CourtScreen from '../screens/courtAdmin/Arena/ArenaDetails/CourtScreen';
import ReviewScreen from '../screens/courtAdmin/Arena/ArenaDetails/ReviewScreen';
import { IMAGES } from '../assets/constants/global_images';

const Tab = createMaterialTopTabNavigator();

function CustomTabBar({ state, descriptors, navigation, stackNavigation }) {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: '#F9F9F9' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
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
            stackNavigation.setOptions({ headerTitle: label }); 
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
          case 'Arena':
            iconName = IMAGES.ArenaFoucs;
            focusedIconName = IMAGES.ArenaNoFoucs;
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
              paddingVertical: 10,
             // borderWidth:1,
              marginHorizontal: 3, 
              borderRadius: 8, 
              elevation: 2, 
              height:92
            }}
            key={route.key}
          >
            <Image source={isFocused ? iconName : focusedIconName} style={{ width: 20, height: 20 }} />
            <Text style={{ color: isFocused ? '#192335' : '#898989', fontSize: 14, paddingTop:10 }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function AdminTopTabNavigation({navigation}) {
  return (
      <Tab.Navigator
        initialRouteName="Arena"
        tabBar={props => <CustomTabBar {...props} stackNavigation={navigation}  />}
        screenOptions={({ route }) => ({
          headerShown: true,
          headerTitle: route.name,
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          headerLeft: ({ navigation }) => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={IMAGES.LeftBackArrow} 
                style={{ width: 20, height: 20, marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        })}
      >
        <Tab.Screen
          name="Arena"
          component={ArenaScreen}
          options={{ tabBarLabel: 'Arena' }}
        />
        <Tab.Screen
          name="Court"
          component={CourtScreen}
          options={{ tabBarLabel: 'Court' }}
        />
        <Tab.Screen
          name="Booking"
          component={BookingScreen}
          options={{ tabBarLabel: 'Booking' }}
        />
        <Tab.Screen
          name="Reviews"
          component={ReviewScreen}
          options={{ tabBarLabel: 'Reviews' }}
        />
      </Tab.Navigator>
    
  );
}
