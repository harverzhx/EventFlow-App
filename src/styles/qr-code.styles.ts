import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cell: {
    position: 'absolute',
    backgroundColor: '#0B1F3A',
  },
  finder: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderWidth: 3,
    borderColor: '#0B1F3A',
    borderRadius: 2,
  },
});

export default styles;
