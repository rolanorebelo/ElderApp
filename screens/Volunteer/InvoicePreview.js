// InvoicePreview.js
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InvoicePreview = ({ isVisible, invoiceDetails, onClose, onSubmit, onEdit }) => {
  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Invoice Preview</Text>

          {/* Display invoice details */}
          <Text style={styles.whiteText}>{`Client Name: ${invoiceDetails.clientName}`}</Text>
          <Text style={styles.whiteText}>{`Task Name: ${invoiceDetails.taskName}`}</Text>
          <Text style={styles.whiteText}>{`Hours Worked: ${invoiceDetails.hoursWorked}`}</Text>
          <Text style={styles.whiteText}>{`Rate Per Hour: $${invoiceDetails.ratePerHour.toFixed(2)}`}</Text>
          <Text style={styles.whiteText}>{`Expenses: $${invoiceDetails.expenses}`}</Text>

          {/* Buttons for submitting and editing */}
          <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark grey background
  },
  modalContent: {
    backgroundColor: '#190a43', // Dark grey content background
    padding: 16,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white', // White text color
  },
  whiteText: {
    color: 'white', // White text color
  },
  submitButton: {
    backgroundColor: 'darkolivegreen',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  editButton: {
    backgroundColor: 'darkslateblue',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: 'darkred',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InvoicePreview;
