import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function UploadCalendar() {
  const [fileName, setFileName] = useState(null);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });

    if (result.type === 'success') {
      setFileName(result.name);
      Alert.alert('Upload Success', `Selected file: ${result.name}`);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, marginTop: '85%'}}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20, paddingLeft: 20 }}>
        Upload Academic Calendar
      </Text>

      <TouchableOpacity
        onPress={pickDocument}
        style={{
          backgroundColor: '#4f46e5',
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Pick a PDF File</Text>
      </TouchableOpacity>

      {fileName && (
        <Text style={{ marginTop: 20, fontSize: 16, color: '#4b5563' }}>
          Selected File: {fileName}
        </Text>
      )}
    </View>
  );
}
