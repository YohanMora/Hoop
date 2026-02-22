
import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import DatePicker from 'react-native-date-picker'
const BirthdayPicker = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <View>
      <Button title="Seleccionar fecha" onPress={openDatePicker} />
      {showDatePicker && (
        <DatePicker
          value={selectedDate ? selectedDate : new Date()}
          mode="date"
          display="calendar"
          onChange={handleDateChange}
        />
      )}
      {selectedDate && (
        <Text>Fecha seleccionada: {selectedDate.toDateString()}</Text>
      )}
    </View>
  );
};

export default BirthdayPicker;
