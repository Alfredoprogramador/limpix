import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/colors';

interface Props {
  value: number;        // 0 – 5 (can be fractional for display)
  size?: number;
  readonly?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({ value, size = 24, readonly = false, onChange }: Props) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.row}>
      {stars.map(star => {
        const filled = value >= star;
        const half = !filled && value >= star - 0.5;
        return (
          <TouchableOpacity
            key={star}
            disabled={readonly}
            onPress={() => onChange?.(star)}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <Text style={{ fontSize: size, color: filled || half ? COLORS.star : COLORS.starEmpty }}>
              {filled ? '★' : half ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
