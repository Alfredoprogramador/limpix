import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Booking } from '../types';
import { COLORS } from '../constants/colors';
import { SERVICE_MAP, STATUS_COLORS, STATUS_LABELS } from '../constants/services';

interface Props {
  booking: Booking;
  onPress?: () => void;
  role?: 'client' | 'provider';
}

export function BookingCard({ booking, onPress, role = 'client' }: Props) {
  const svc = SERVICE_MAP[booking.service];
  const statusColor = STATUS_COLORS[booking.status] ?? COLORS.textSecondary;
  const statusLabel = STATUS_LABELS[booking.status] ?? booking.status;

  const displayName = role === 'client' ? booking.providerName : booking.clientName;
  const displayLabel = role === 'client' ? 'Prestador' : 'Cliente';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} disabled={!onPress} activeOpacity={0.85}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.svcIcon, { backgroundColor: svc?.color + '20' }]}>
          <Text style={styles.svcEmoji}>{svc?.icon ?? '🔨'}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.svcLabel}>{svc?.label ?? booking.service}</Text>
          <Text style={styles.personLabel}>{displayLabel}: {displayName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <Text style={styles.detail}>📅 {booking.date}  🕐 {booking.time}</Text>
        <Text style={styles.detail} numberOfLines={1}>📍 {booking.address}, {booking.city}</Text>
        {booking.notes ? (
          <Text style={styles.detail} numberOfLines={1}>💬 {booking.notes}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  svcIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  svcEmoji: {
    fontSize: 20,
  },
  headerText: {
    flex: 1,
  },
  svcLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  personLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  details: {
    gap: 4,
  },
  detail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});
