import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Booking, ClientStackParamList } from '../../types';
import { COLORS } from '../../constants/colors';
import { getBookingsByClient, updateBookingStatus, getReviewByBooking } from '../../services/database';
import { BookingCard } from '../../components/BookingCard';
import { useAuth } from '../../context/AuthContext';

type Nav = NativeStackNavigationProp<ClientStackParamList>;

export function HistoryScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<Nav>();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('todos');

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const list = await getBookingsByClient(user.id);
    setBookings(list);
    setLoading(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function handleCancel(booking: Booking) {
    Alert.alert(
      'Cancelar agendamento',
      `Deseja cancelar o serviço de ${booking.service}?`,
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: async () => {
            await updateBookingStatus(booking.id, 'cancelado');
            load();
          },
        },
      ]
    );
  }

  async function handleReview(booking: Booking) {
    const existing = await getReviewByBooking(booking.id);
    if (existing) {
      Alert.alert('Avaliação', 'Você já avaliou este serviço.');
      return;
    }
    navigation.navigate('Review', {
      bookingId: booking.id,
      providerId: booking.providerId,
      providerName: booking.providerName,
    });
  }

  const FILTERS = ['todos', 'pendente', 'confirmado', 'concluido', 'cancelado'];

  const displayed = filter === 'todos'
    ? bookings
    : bookings.filter(b => b.status === filter);

  return (
    <View style={styles.container}>
      <View style={styles.headerBg}>
        <Text style={styles.headerTitle}>Meus Agendamentos</Text>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <FlatList
          data={FILTERS}
          horizontal
          keyExtractor={item => item}
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
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={styles.emptyTitle}>Sem agendamentos</Text>
          <Text style={styles.emptyText}>Seus agendamentos aparecerão aqui.</Text>
        </View>
      ) : (
        <FlatList
          data={displayed}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View>
              <BookingCard booking={item} role="client" />
              <View style={styles.actionRow}>
                {(item.status === 'pendente' || item.status === 'confirmado') && (
                  <TouchableOpacity style={[styles.actionBtn, styles.cancelBtn]} onPress={() => handleCancel(item)}>
                    <Text style={styles.cancelBtnText}>Cancelar</Text>
                  </TouchableOpacity>
                )}
                {item.status === 'concluido' && (
                  <TouchableOpacity style={[styles.actionBtn, styles.reviewBtn]} onPress={() => handleReview(item)}>
                    <Text style={styles.reviewBtnText}>⭐ Avaliar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
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
  filters: { backgroundColor: COLORS.surface },
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
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, marginTop: 6 },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: -6, marginBottom: 8, paddingHorizontal: 2 },
  actionBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  cancelBtn: { backgroundColor: COLORS.error + '15', borderWidth: 1, borderColor: COLORS.error },
  cancelBtnText: { color: COLORS.error, fontWeight: '600', fontSize: 13 },
  reviewBtn: { backgroundColor: COLORS.secondary + '15', borderWidth: 1, borderColor: COLORS.secondary },
  reviewBtnText: { color: COLORS.secondary, fontWeight: '600', fontSize: 13 },
});
