import React, { FC, ReactElement, useEffect,useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  View,
} from 'react-native';


import { Dimensions } from 'react-native';
const {width} = Dimensions.get('window');
interface Props {
  label: string;
  campo: boolean;
  data: Array<{ label: string; value: string }>; 
  onSelect: (item: { label: string; value: string }) => void;
  valorPreseleccionado?: { label: string; value: string }; 
  disabled?: boolean; // Nuevo prop
}

const Dropdown: FC<Props> = ({ label, data, disabled, valorPreseleccionado,onSelect }) => {
  useEffect(() => {
    if (valorPreseleccionado) {
      setSelected(valorPreseleccionado);
    }
  }, [valorPreseleccionado]);
  
  const DropdownButton = useRef();
  const [visible, setVisible] = useState(false); 
  const [dropdownTop, setDropdownTop] = useState(0); 
  const [selected, setSelected] = useState(valorPreseleccionado || undefined);

  const toggleDropdown = (): void => {
    visible ? setVisible(false) : openDropdown();
  };

  const openDropdown = (): void => {
    DropdownButton.current.measure((_fx: number, _fy: number, _w: number, h: number, _px: number, py: number) => {
      setDropdownTop(py + h);
    });
    setVisible(true);
  };
 
  const onItemPress = (item: any): void => { 
    setSelected(item);
    onSelect(item);
    setVisible(false);
  };

  const renderItem = ({ item }: any): ReactElement<any, any> => (
    <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
      <Text style={styles.itemLabel} >{item.label}</Text>
    </TouchableOpacity>
  );

  const renderDropdown = (): ReactElement<any, any> => {
  
    return (
      <Modal visible={visible} transparent animationType="none">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <View style={[styles.dropdown, { top: dropdownTop }]}>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <TouchableOpacity
      ref={DropdownButton}
      style={styles.button}
      onPress={toggleDropdown} 
      disabled={disabled} // Agrega la propiedad "disabled" al botón
    >
      {renderDropdown()}
      <Text style={styles.buttonText}>
        {(!!selected && selected.label) || label}
      </Text>
     </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 40,
    zIndex: 1,
  },
  buttonText: {
    marginLeft: 5,
    color:'black',
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: '90%',
    height: 100,
    borderRadius:10,
    shadowColor: '#000000',
    shadowRadius: 4,
    shadowOffset: { height: 5, width: 2 },
    shadowOpacity: 0.5,
  },
  overlay: {
    alignItems: 'center',
		justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  itemLabel:{
    color:'black',
  },
  item: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 0.2,
    borderBottomColor:'#D2D2D2'
  },
});

export default Dropdown;