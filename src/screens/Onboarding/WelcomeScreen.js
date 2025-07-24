import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 20 }}>Welcome to StudentFlow</Text>
      <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 40 }}>
        Organize your academic life with reminders, calendars, and more.
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('SchoolSemester')}
        style={{
          backgroundColor: '#4f46e5',
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Let’s Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}
