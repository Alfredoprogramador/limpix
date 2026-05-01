import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ServiceInfo } from '../constants/services';
import { COLORS } from '../constants/colors';

interface Props {
  service: ServiceInfo;
  onPress: () => void;
}

export function ServiceCard({ service, onPress }: Props) {
  return (
    <TouchableOpacity style={[styles.card, { borderTopColor: service.color }]} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.iconWrap, { backgroundColor: service.color + '20' }]}>
        <Text style={styles.icon}>{service.icon}</Text>
      </View>
      <Text style={styles.label}>{service.label}</Text>
      <Text style={styles.desc} numberOfLines={2}>{service.description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    width: '47%',
    marginBottom: 16,
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
});
