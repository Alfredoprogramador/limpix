import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Booking } from '../../types';
import { COLORS } from '../../constants/colors';
import { getBookingsByProvider } from '../../services/database';
import { BookingCard } from '../../components/BookingCard';
import { useAuth } from '../../context/AuthContext';

const FILTERS = ['todos', 'pendente', 'confirmado', 'concluido', 'cancelado'];

export function ProviderScheduleScreen() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const list = await getBookingsByProvider(user.id);
    setBookings(list);
    setLoading(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const displayed = filter === 'todos'
    ? bookings
    : bookings.filter(b => b.status === filter);

  return (
    <View style={styles.container}>
      <View style={styles.headerBg}>
        <Text style={styles.headerTitle}>Agenda Completa</Text>
      </View>

      {/* Filters */}
      <View style={styles.filterBar}>
        <FlatList
          data={FILTERS}
          horizontal
          keyExtractor={i => i}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterChip, filter === item && styles.filterActive]}
              onPress={() => setFilter(item)}
            >
              <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
        />
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.primary} size="large" style={{ marginTop: 40 }} />
      ) : displayed.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📅</Text>
          <Text style={styles.emptyTitle}>Sem agendamentos</Text>
          <Text style={styles.emptyText}>Agendamentos aparecerão aqui.</Text>
        </View>
      ) : (
        <FlatList
          data={displayed}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <BookingCard booking={item} role="provider" />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerBg: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: COLORS.white },
  filterBar: { backgroundColor: COLORS.surface },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  filterActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  filterText: { fontSize: 13, fontWeight: '500', color: COLORS.textSecondary },
  filterTextActive: { color: COLORS.white, fontWeight: '600' },
  list: { padding: 16, paddingBottom: 32 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
  emptyText: { fontSize: 13, color: COLORS.textSecondary, marginTop: 6 },
});
