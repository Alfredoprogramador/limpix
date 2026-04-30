import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ServiceProvider } from '../types';
import { COLORS } from '../constants/colors';
import { StarRating } from './StarRating';

interface Props {
  provider: ServiceProvider;
  onPress: () => void;
}

export function ProviderCard({ provider, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{provider.name.charAt(0).toUpperCase()}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>{provider.name}</Text>
          {provider.available ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Disponível</Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.badgeOff]}>
              <Text style={[styles.badgeText, styles.badgeTextOff]}>Ocupado</Text>
            </View>
          )}
        </View>

        <Text style={styles.location} numberOfLines={1}>
          📍 {provider.neighborhood}, {provider.city}
        </Text>

        <View style={styles.bottomRow}>
          <StarRating value={provider.rating} size={14} readonly />
          <Text style={styles.reviewCount}>({provider.reviewCount})</Text>
          <Text style={styles.price}>{provider.priceRange}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  badge: {
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  badgeOff: {
    backgroundColor: COLORS.error + '20',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.success,
  },
  badgeTextOff: {
    color: COLORS.error,
  },
  location: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
    marginRight: 8,
  },
  price: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 'auto',
  },
});
