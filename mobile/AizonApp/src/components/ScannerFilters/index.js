import { PropTypes } from 'prop-types';
import React, {useState} from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Filters } from 'react-native-rectangle-scanner';

// Renders a list of available filters for the platform
export default function ScannerFilters (props) {
/**
  static propTypes = {
    filterId: PropTypes.number.isRequired,
    onFilterIdChange: PropTypes.func.isRequired,
  }
*/
  const [filterMenuIsOpen, setFilterMenuIsOpen] = useState(false);

  const dimensions = Dimensions.get('window');
  const aspectRatio = dimensions.height / dimensions.width;
  const isMobile = aspectRatio > 1.6;

  function setFilter (filter) {
    props.onFilterIdChange(filter.id);
    setFilterMenuIsOpen(false);
  }

  function renderFilterOptions() {
    return Filters.RECOMMENDED_PLATFORM_FILTERS.map((f) => {
      const selectedStyle = f.id === (props.filterId || 1) ? { color: 'yellow' } : null;

      return (
        <TouchableOpacity
          key={f.id}
          style={{ paddingHorizontal: 22, paddingVertical: 16, width: (f.name.length * 7) + 50 }}
          onPress={() => setFilter(f)}
          activeOpacity={0.8}
        >
          <Text
            numberOfLines={1}
            style={[{ flex: 1, color: 'white', fontSize: 13 }, selectedStyle]}
          >
            {f.name}
          </Text>
        </TouchableOpacity>
      );
    });
  }

  function renderizar() {



    let filters = null;

    if (filterMenuIsOpen) {
      const groupStyles = {
        flex: 1,
        position: 'absolute',
        backgroundColor: '#00000080',
        borderRadius: isMobile ? 17 : 30,
        flexDirection: isMobile ? 'column' : 'row',
        right: isMobile ? 0 : 75,
        bottom: isMobile ? 75 : 8,
      };

      filters = (
        <View style={groupStyles}>
          {renderFilterOptions()}
        </View>
      );
    }

    return filters;
}

return (
      <View style={{ flexDirection: 'column', justifyContent: 'flex-end' }}>
        {renderizar()}

        <View style={{
          backgroundColor: '#00000080',
          flexDirection: isMobile ? 'column' : 'row',
          borderRadius: 30,
          margin: 8,
        }}
        >
          <TouchableOpacity
            style={{
              paddingHorizontal: 14,
              paddingVertical: 13,
              height: 50,
              width: 50,
            }}
            onPress={() => setFilterMenuIsOpen(!filterMenuIsOpen)}
            activeOpacity={0.8}
          >
            <Icon
              name="ios-color-filter"
              size={40}
              color="white"
              style={{ color: 'white',
                fontSize: 22,
                marginBottom: 3,
                textAlign: 'center' }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );

}