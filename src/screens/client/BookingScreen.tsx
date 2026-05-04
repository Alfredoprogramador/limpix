import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ClientStackParamList } from '../../types';
import { COLORS } from '../../constants/colors';
import { SERVICE_MAP } from '../../constants/services';
import { createBooking } from '../../services/database';
import { useAuth } from '../../context/AuthContext';
import { isValidDate, isFutureDate, isNotEmpty } from '../../utils/validation';

type Nav = NativeStackNavigationProp<ClientStackParamList, 'Booking'>;
type Route = RouteProp<ClientStackParamList, 'Booking'>;

function generateId() {
  return `bk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// Minimal date picker helpers

const TIMES = [
  '08:00', '09:00', '10:00', '11:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
];

export function BookingScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { providerId, providerName, service } = route.params;
  const { user } = useAuth();

  const svc = SERVICE_MAP[service];

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState(user?.address ?? '');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (!date) { 
      Alert.alert('Atenção', 'Escolha uma data.'); 
      return; 
    }

    if (!isValidDate(date)) {
      Alert.alert('Atenção', 'Formato de data inválido. Use AAAA-MM-DD (ex: 2025-06-15)');
      return;
    }

    if (!isFutureDate(date)) {
      Alert.alert('Atenção', 'A data deve ser hoje ou no futuro.');
      return;
    }

    if (!time) { 
      Alert.alert('Atenção', 'Escolha um horário.'); 
      return; 
    }

    if (!isNotEmpty(address)) { 
      Alert.alert('Atenção', 'Informe o endereço.'); 
      return; 
    }

    if (!isNotEmpty(city)) { 
      Alert.alert('Atenção', 'Informe a cidade.'); 
      return; 
    }

    setLoading(true);
    await createBooking({
      id: generateId(),
      clientId: user!.id,
      clientName: user!.name,
      providerId,
      providerName,
      service,
      date,
      time,
      address: address.trim(),
      city: city.trim(),
      notes: notes.trim(),
      status: 'pendente',
      createdAt: new Date().toISOString(),
    });
    setLoading(false);

    Alert.alert(
      '✅ Agendamento realizado!',
      `Seu pedido de ${svc?.label} foi enviado para ${providerName}.\n\nAguarde a confirmação.`,
      [{ text: 'OK', onPress: () => navigation.popToTop() }]
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Service + Provider */}
        <View style={styles.infoCard}>
          <Text style={styles.svcEmoji}>{svc?.icon}</Text>
          <View>
            <Text style={styles.svcName}>{svc?.label}</Text>
            <Text style={styles.providerName}>com {providerName}</Text>
          </View>
        </View>

        {/* Date */}
        <Text style={styles.label}>📅 Data *</Text>
        <TextInput
          style={styles.input}
          placeholder="AAAA-MM-DD (ex: 2025-06-15)"
          placeholderTextColor={COLORS.textHint}
          value={date}
          onChangeText={setDate}
          keyboardType="numeric"
        />

        {/* Time slots */}
        <Text style={styles.label}>🕐 Horário *</Text>
        <View style={styles.timeGrid}>
          {TIMES.map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.timeChip, time === t && styles.timeChipActive]}
              onPress={() => setTime(t)}
            >
              <Text style={[styles.timeText, time === t && styles.timeTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Address */}
        <Text style={styles.label}>📍 Endereço *</Text>
        <TextInput
          style={styles.input}
          placeholder="Rua, número, bairro"
          placeholderTextColor={COLORS.textHint}
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.label}>🌆 Cidade *</Text>
        <TextInput
          style={styles.input}
          placeholder="São Paulo"
          placeholderTextColor={COLORS.textHint}
          value={city}
          onChangeText={setCity}
        />

        {/* Notes */}
        <Text style={styles.label}>💬 Observações</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Descreva o que precisa ser feito..."
          placeholderTextColor={COLORS.textHint}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.btn} onPress={handleConfirm} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Agendando...' : '✅ Confirmar Agendamento'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 40 },
  infoCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  svcEmoji: { fontSize: 40 },
  svcName: { fontSize: 18, fontWeight: '700', color: COLORS.white },
  providerName: { fontSize: 13, color: COLORS.white + 'CC', marginTop: 2 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8, marginTop: 4 },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  multiline: { height: 80, textAlignVertical: 'top' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  timeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  timeChipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '15' },
  timeText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
  timeTextActive: { color: COLORS.primary, fontWeight: '700' },
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
