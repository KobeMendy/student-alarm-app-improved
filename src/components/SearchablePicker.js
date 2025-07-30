import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
  Modal,
  SafeAreaView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchablePicker = ({ items, placeholder, onValueChange, value }) => {
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);
  const [modalVisible, setModalVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState(
    value ? items.find((item) => item.value === value)?.label : ""
  );

  useEffect(() => {
    // Update display value when the external 'value' prop changes
    if (value) {
      const selectedItem = items.find((item) => item.value === value);
      setDisplayValue(selectedItem ? selectedItem.label : "");
    } else {
      setDisplayValue("");
    }
  }, [value, items]);

  const handleOpenModal = () => {
    setSearchText(""); // Reset search text when opening modal
    setFilteredItems(items); // Show all items initially in modal
    setModalVisible(true);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.length > 0) {
      const filtered = items.filter((item) =>
        item.label.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  };

  const handleSelectItem = (item) => {
    setDisplayValue(item.label);
    onValueChange(item.value);
    setModalVisible(false);
    Keyboard.dismiss();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleSelectItem(item)}
    >
      <Text style={styles.resultItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* The input field that triggers the modal */}
      <TouchableOpacity style={styles.inputTrigger} onPress={handleOpenModal}>
        <TextInput
          style={styles.input}
          placeholder={placeholder.label}
          value={displayValue}
          editable={false} // Make it non-editable as it only triggers the modal
          placeholderTextColor="#999"
        />
        <Ionicons name="chevron-down" size={20} color="#999" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          Keyboard.dismiss();
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TextInput
              style={styles.modalSearchInput}
              placeholder={`Search ${placeholder.label
                .toLowerCase()
                .replace("select your", "")
                .replace("search and select your", "")
                .trim()}...`}
              value={searchText}
              onChangeText={handleSearch}
              placeholderTextColor="#999"
              autoFocus={true} // Focus search input when modal opens
              returnKeyType="search"
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.value}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              searchText.length > 0 ? (
                <View style={styles.emptyResults}>
                  <Text style={styles.emptyResultsText}>
                    No matching items found.
                  </Text>
                </View>
              ) : null
            }
            contentContainerStyle={styles.flatListContent}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputTrigger: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 0,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "white",
  },
  modalSearchInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#f9fafb",
    marginRight: 10,
  },
  modalCloseButton: {
    padding: 5,
  },
  flatListContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  resultItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  resultItemText: {
    fontSize: 16,
    color: "#333",
  },
  emptyResults: {
    padding: 20,
    alignItems: "center",
  },
  emptyResultsText: {
    color: "#999",
    fontSize: 14,
  },
});

export default SearchablePicker;
