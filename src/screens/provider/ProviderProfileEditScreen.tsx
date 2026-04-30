import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/colors';
import { SERVICES, SERVICE_MAP } from '../../constants/services';
import { ServiceCategory } from '../../types';
import { getProviderById, updateProvider, updateUser } from '../../services/database';
import { StarRating } from '../../components/StarRating';

export function ProviderProfileEditScreen() {
  const { user, updateCurrentUser } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [description, setDescription] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [available, setAvailable] = useState(true);
  const [selectedServices, setSelectedServices] = useState<ServiceCategory[]>([]);
  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const p = await getProviderById(user.id);
    if (p) {
      setName(p.name);
      setPhone(p.phone);
      setCity(p.city);
      setNeighborhood(p.neighborhood);
      setDescription(p.description);
      setWhatsapp(p.whatsapp);
      setPriceRange(p.priceRange);
      setAvailable(p.available);
      setSelectedServices(p.services);
      setRating(p.rating);
      setReviewCount(p.reviewCount);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  function toggleService(svc: ServiceCategory) {
    setSelectedServices(prev =>
      prev.includes(svc) ? prev.filter(s => s !== svc) : [...prev, svc]
    );
  }

  async function handleSave() {
    if (!name.trim() || !city.trim() || !neighborhood.trim() || !description.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }
    if (selectedServices.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos um serviço.');
      return;
    }

    setSaving(true);
    const updatedUser = { ...user!, name: name.trim(), phone: phone.trim() };
    await updateUser(updatedUser);
    await updateCurrentUser(updatedUser);
    await updateProvider({
      id: user!.id,
      services: selectedServices,
      description: description.trim(),
      city: city.trim(),
      neighborhood: neighborhood.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
      available,
      priceRange: priceRange.trim() || 'A combinar',
    });
    setSaving(false);
    Alert.alert('✅ Perfil atualizado com sucesso!');
  }

  const { logout } = useAuth();

  function handleLogout() {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(user?.name ?? 'P').charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.heroName}>{user?.name}</Text>
          <Text style={styles.heroEmail}>{user?.email}</Text>
          <View style={styles.ratingRow}>
            <StarRating value={rating} size={18} readonly />
            <Text style={styles.ratingText}>{rating.toFixed(1)} ({reviewCount} avaliações)</Text>
          </View>
        </View>

        {/* Availability Toggle */}
        <View style={styles.availRow}>
          <Text style={styles.availLabel}>
            {available ? '🟢 Disponível para novos serviços' : '🔴 Indisponível no momento'}
          </Text>
          <Switch
            value={available}
            onValueChange={setAvailable}
            trackColor={{ false: COLORS.error + '60', true: COLORS.success + '60' }}
            thumbColor={available ? COLORS.success : COLORS.error}
          />
        </View>

        {/* Personal Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          <Field label="Nome *" value={name} onChangeText={setName} />
          <Field label="Telefone *" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Field label="WhatsApp para contato" value={whatsapp} onChangeText={setWhatsapp} keyboardType="phone-pad" placeholder={phone} />
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização</Text>
          <Field label="Cidade *" value={city} onChangeText={setCity} />
          <Field label="Bairro *" value={neighborhood} onChangeText={setNeighborhood} />
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Serviços que Ofereço</Text>
          <View style={styles.serviceGrid}>
            {SERVICES.map(svc => {
              const selected = selectedServices.includes(svc.key);
              return (
                <TouchableOpacity
                  key={svc.key}
                  style={[styles.svcChip, selected && { borderColor: svc.color, backgroundColor: svc.color + '15' }]}
                  onPress={() => toggleService(svc.key)}
                >
                  <Text style={styles.svcEmoji}>{svc.icon}</Text>
                  <Text style={[styles.svcLabel, selected && { color: svc.color }]}>{svc.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Description & Price */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre você</Text>
          <Field label="Descrição *" value={description} onChangeText={setDescription} multiline placeholder="Descreva sua experiência e serviços..." />
          <Field label="Faixa de preço" value={priceRange} onChangeText={setPriceRange} placeholder="Ex: R$ 80 – R$ 200" />
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
          <Text style={styles.saveBtnText}>{saving ? 'Salvando...' : '💾 Salvar Perfil'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label, value, onChangeText, placeholder, keyboardType, multiline,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'phone-pad' | 'default';
  multiline?: boolean;
}) {
  return (
    <View style={fieldStyles.wrap}>
      <Text style={fieldStyles.label}>{label}</Text>
      <TextInput
        style={[fieldStyles.input, multiline && fieldStyles.multi]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textHint}
        keyboardType={keyboardType ?? 'default'}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background,
  },
  multi: { height: 80 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: 40 },
  hero: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 28,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 36, color: COLORS.white, fontWeight: '700' },
  heroName: { fontSize: 20, fontWeight: '700', color: COLORS.white, marginBottom: 4 },
  heroEmail: { fontSize: 13, color: COLORS.white + 'CC', marginBottom: 10 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingText: { fontSize: 13, color: COLORS.white + 'CC' },
  availRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    margin: 16,
    padding: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  availLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, flex: 1, marginRight: 8 },
  section: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  svcChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  svcEmoji: { fontSize: 16 },
  svcLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  saveBtn: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 12,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  logoutBtn: {
    marginHorizontal: 16,
    backgroundColor: COLORS.error + '15',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.error + '40',
  },
  logoutText: { color: COLORS.error, fontSize: 15, fontWeight: '700' },
});
