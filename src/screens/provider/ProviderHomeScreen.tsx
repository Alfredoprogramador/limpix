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
import { useFocusEffect } from '@react-navigation/native';
import { Booking } from '../../types';
import { COLORS } from '../../constants/colors';
import { getBookingsByProvider, updateBookingStatus } from '../../services/database';
import { BookingCard } from '../../components/BookingCard';
import { useAuth } from '../../context/AuthContext';
import { STATUS_COLORS } from '../../constants/services';

export function ProviderHomeScreen() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

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

  const pending = bookings.filter(b => b.status === 'pendente');
  const confirmed = bookings.filter(b => b.status === 'confirmado');
  const total = bookings.length;

  async function handleConfirm(booking: Booking) {
    await updateBookingStatus(booking.id, 'confirmado');
    load();
  }

  async function handleComplete(booking: Booking) {
    Alert.alert('Concluir serviço', `Marcar serviço com ${booking.clientName} como concluído?`, [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim', onPress: async () => { await updateBookingStatus(booking.id, 'concluido'); load(); } },
    ]);
  }

  async function handleCancel(booking: Booking) {
    Alert.alert('Cancelar agendamento', 'Deseja cancelar este agendamento?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim', style: 'destructive', onPress: async () => { await updateBookingStatus(booking.id, 'cancelado'); load(); } },
    ]);
  }

  const upcoming = bookings.filter(b => b.status === 'pendente' || b.status === 'confirmado');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user?.name.split(' ')[0]} 👋</Text>
          <Text style={styles.subtitle}>Seus agendamentos de hoje</Text>
        </View>
        <View style={styles.avatarSmall}>
          <Text style={styles.avatarLetter}>{user?.name.charAt(0).toUpperCase()}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard label="Pendentes" value={pending.length} color={STATUS_COLORS.pendente} />
        <StatCard label="Confirmados" value={confirmed.length} color={STATUS_COLORS.confirmado} />
        <StatCard label="Total" value={total} color={COLORS.primary} />
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.primary} size="large" style={{ marginTop: 40 }} />
      ) : upcoming.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={styles.emptyTitle}>Nenhum agendamento pendente</Text>
          <Text style={styles.emptyText}>Novos pedidos aparecerão aqui.</Text>
        </View>
      ) : (
        <FlatList
          data={upcoming}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View>
              <BookingCard booking={item} role="provider" />
              <View style={styles.actionRow}>
                {item.status === 'pendente' && (
                  <TouchableOpacity style={[styles.btn, styles.confirmBtn]} onPress={() => handleConfirm(item)}>
                    <Text style={styles.confirmText}>✅ Confirmar</Text>
                  </TouchableOpacity>
                )}
                {item.status === 'confirmado' && (
                  <TouchableOpacity style={[styles.btn, styles.completeBtn]} onPress={() => handleComplete(item)}>
                    <Text style={styles.completeText}>🏁 Concluir</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() => handleCancel(item)}>
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={[statStyles.card, { borderTopColor: color }]}>
      <Text style={[statStyles.value, { color }]}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderTopWidth: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  value: { fontSize: 26, fontWeight: '800' },
  label: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  greeting: { fontSize: 20, fontWeight: '700', color: COLORS.white },
  subtitle: { fontSize: 13, color: COLORS.white + 'CC', marginTop: 4 },
  avatarSmall: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.white + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 10, margin: 16 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
  emptyText: { fontSize: 13, color: COLORS.textSecondary, marginTop: 6 },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  actionRow: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end', marginTop: -6, marginBottom: 8 },
  btn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  confirmBtn: { backgroundColor: COLORS.success + '15', borderWidth: 1, borderColor: COLORS.success },
  confirmText: { color: COLORS.success, fontWeight: '600', fontSize: 13 },
  completeBtn: { backgroundColor: COLORS.primary + '15', borderWidth: 1, borderColor: COLORS.primary },
  completeText: { color: COLORS.primary, fontWeight: '600', fontSize: 13 },
  cancelBtn: { backgroundColor: COLORS.error + '15', borderWidth: 1, borderColor: COLORS.error },
  cancelText: { color: COLORS.error, fontWeight: '600', fontSize: 13 },
});
