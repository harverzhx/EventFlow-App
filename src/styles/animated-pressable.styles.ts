import { StyleSheet } from 'react-native';

import { Radius } from '@/constants/theme';

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius.lg,
    shadowColor: '#0B1F3A',
  },
  surface: {
    flexGrow: 1,
    borderRadius: Radius.lg,
  },
});

export default styles;
