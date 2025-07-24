import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

const obligations = [
  { id: '1', title: 'Tuition Fees', amount: '₦200,000', due: 'Aug 15' },
  { id: '2', title: 'Library Fine', amount: '₦2,000', due: 'Aug 10' },
];

export default function MyFinances({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>My Finances</Text>
      <FlatList
        data={obligations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: '#f3f4f6',
            padding: 16,
            borderRadius: 10,
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.title}</Text>
            <Text>{item.amount}</Text>
            <Text style={{ color: '#555' }}>Due: {item.due}</Text>
          </View>
        )}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('AddObligation')}
        style={{
          marginTop: 20,
          backgroundColor: '#4f46e5',
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Add New Obligation</Text>
      </TouchableOpacity>
    </View>
  );
}
