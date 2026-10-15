import { StyleSheet } from 'react-native';

import { Colors, FontSize, Fonts } from '@/constants/theme';

const styles = StyleSheet.create({
  label: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
    lineHeight: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  underline: {
    height: 1.5,
    borderRadius: 1,
    backgroundColor: Colors.primary,
    transformOrigin: 'left',
  },
});

export default styles;
