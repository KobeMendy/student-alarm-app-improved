import React, { useState } from 'react';
import { View, Text, TextInput, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddObligation() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowPicker(Platform.OS === 'ios');
    setDueDate(currentDate);
  };

  const saveObligation = () => {
    alert(`Saved: ${title} - ₦${amount} due on ${dueDate.toDateString()}`);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Obligation Title</Text>
      <TextInput
        style={{ borderColor: '#ccc', borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 20 }}
        placeholder="e.g. Hostel Fees"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={{ fontSize: 20, marginBottom: 10 }}>Amount (₦)</Text>
      <TextInput
        keyboardType="numeric"
        style={{ borderColor: '#ccc', borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 20 }}
        placeholder="e.g. 50000"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={{ fontSize: 20, marginBottom: 10 }}>Due Date</Text>
      <Button title="Pick Due Date" onPress={() => setShowPicker(true)} />
      {showPicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
      <Text style={{ marginTop: 20 }}>Selected: {dueDate.toDateString()}</Text>

      <View style={{ marginTop: 30 }}>
        <Button title="Save Obligation" onPress={saveObligation} color="#4f46e5" />
      </View>
    </View>
  );
}
