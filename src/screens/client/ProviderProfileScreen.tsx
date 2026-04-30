import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ClientStackParamList, Review, ServiceProvider } from '../../types';
import { COLORS } from '../../constants/colors';
import { SERVICE_MAP } from '../../constants/services';
import { getProviderById, getReviewsByProvider } from '../../services/database';
import { StarRating } from '../../components/StarRating';

type Nav = NativeStackNavigationProp<ClientStackParamList, 'ProviderProfile'>;
type Route = RouteProp<ClientStackParamList, 'ProviderProfile'>;

export function ProviderProfileScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { providerId } = route.params;

  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [p, r] = await Promise.all([
      getProviderById(providerId),
      getReviewsByProvider(providerId),
    ]);
    setProvider(p);
    setReviews(r);
    setLoading(false);
  }, [providerId]);

  useEffect(() => {
    load();
  }, [load]);

  async function openWhatsApp() {
    if (!provider) return;
    const phone = provider.whatsapp.replace(/\D/g, '');
    const msg = encodeURIComponent(`Olá, ${provider.name}! Vi seu perfil no Limpix e gostaria de solicitar um serviço.`);
    const url = `https://wa.me/55${phone}?text=${msg}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Atenção', 'WhatsApp não disponível neste dispositivo.');
    }
  }

  async function openEmail() {
    if (!provider) return;
    const subject = encodeURIComponent('Solicitação de serviço – Limpix');
    const body = encodeURIComponent(`Olá, ${provider.name}!\n\nEncontrei seu perfil no Limpix e gostaria de contratar seus serviços.\n\nAguardo seu retorno.`);
    const url = `mailto:${provider.email}?subject=${subject}&body=${body}`;
    await Linking.openURL(url).catch(() =>
      Alert.alert('Atenção', 'Não foi possível abrir o app de e-mail.')
    );
  }

  function openMap() {
    if (!provider) return;
    const address = encodeURIComponent(`${provider.address ?? ''}, ${provider.neighborhood}, ${provider.city}`);
    const ios = `maps:?q=${address}`;
    const android = `geo:0,0?q=${address}`;
    const url = Platform.OS === 'ios' ? ios : android;
    Linking.openURL(url).catch(() => {
      // Fallback to Google Maps web
      Linking.openURL(`https://maps.google.com/?q=${address}`);
    });
  }

  function bookService(service: keyof typeof SERVICE_MAP) {
    if (!provider) return;
    navigation.navigate('Booking', {
      providerId: provider.id,
      providerName: provider.name,
      service,
    });
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  if (!provider) {
    return (
      <View style={styles.center}>
        <Text>Prestador não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{provider.name.charAt(0)}</Text>
        </View>
        <Text style={styles.name}>{provider.name}</Text>
        <Text style={styles.location}>📍 {provider.neighborhood}, {provider.city}</Text>

        <View style={styles.ratingRow}>
          <StarRating value={provider.rating} size={18} readonly />
          <Text style={styles.ratingText}>{provider.rating.toFixed(1)} ({provider.reviewCount} avaliações)</Text>
        </View>

        <View style={[styles.availBadge, !provider.available && styles.availOff]}>
          <Text style={[styles.availText, !provider.available && styles.availTextOff]}>
            {provider.available ? '✅ Disponível' : '⏸ Ocupado no momento'}
          </Text>
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre</Text>
        <Text style={styles.desc}>{provider.description}</Text>
        <Text style={styles.price}>💰 {provider.priceRange}</Text>
      </View>

      {/* Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Serviços Oferecidos</Text>
        <View style={styles.serviceChips}>
          {provider.services.map(svc => {
            const info = SERVICE_MAP[svc];
            return (
              <TouchableOpacity
                key={svc}
                style={[styles.chip, { borderColor: info?.color }]}
                onPress={() => bookService(svc)}
              >
                <Text style={styles.chipEmoji}>{info?.icon}</Text>
                <Text style={[styles.chipText, { color: info?.color }]}>{info?.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {provider.services.length === 0 && (
          <Text style={styles.noServices}>Nenhum serviço cadastrado ainda.</Text>
        )}
      </View>

      {/* Contact Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contato</Text>
        <View style={styles.contactRow}>
          <TouchableOpacity style={[styles.contactBtn, styles.whatsappBtn]} onPress={openWhatsApp}>
            <Text style={styles.contactEmoji}>💬</Text>
            <Text style={styles.contactBtnText}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.contactBtn, styles.emailBtn]} onPress={openEmail}>
            <Text style={styles.contactEmoji}>✉️</Text>
            <Text style={styles.contactBtnText}>E-mail</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.contactBtn, styles.mapBtn]} onPress={openMap}>
            <Text style={styles.contactEmoji}>🗺️</Text>
            <Text style={styles.contactBtnText}>Mapa</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Book Button */}
      {provider.available && provider.services.length > 0 && (
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => bookService(provider.services[0])}
          >
            <Text style={styles.bookBtnText}>📅 Agendar Serviço</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Reviews */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Avaliações ({reviews.length})</Text>
        {reviews.length === 0 ? (
          <Text style={styles.noReviews}>Ainda sem avaliações. Seja o primeiro!</Text>
        ) : (
          reviews.slice(0, 5).map(review => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewAuthor}>{review.clientName}</Text>
                <StarRating value={review.rating} size={14} readonly />
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
              <Text style={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString('pt-BR')}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 28,
    paddingHorizontal: 20,
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
  name: { fontSize: 22, fontWeight: '800', color: COLORS.white, marginBottom: 6 },
  location: { fontSize: 13, color: COLORS.white + 'CC', marginBottom: 10 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  ratingText: { fontSize: 13, color: COLORS.white + 'CC' },
  availBadge: {
    backgroundColor: COLORS.success + '30',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  availOff: { backgroundColor: COLORS.error + '30' },
  availText: { color: COLORS.white, fontWeight: '600', fontSize: 13 },
  availTextOff: { color: COLORS.white + 'CC' },
  section: {
    backgroundColor: COLORS.surface,
    margin: 12,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 10 },
  desc: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
  price: { fontSize: 14, fontWeight: '600', color: COLORS.primary, marginTop: 10 },
  serviceChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  chipEmoji: { fontSize: 16 },
  chipText: { fontSize: 14, fontWeight: '600' },
  noServices: { fontSize: 13, color: COLORS.textHint },
  contactRow: { flexDirection: 'row', gap: 10 },
  contactBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 4,
  },
  whatsappBtn: { backgroundColor: '#25D366' + '20', borderWidth: 1, borderColor: '#25D366' },
  emailBtn: { backgroundColor: COLORS.primary + '15', borderWidth: 1, borderColor: COLORS.primary },
  mapBtn: { backgroundColor: COLORS.secondary + '15', borderWidth: 1, borderColor: COLORS.secondary },
  contactEmoji: { fontSize: 22 },
  contactBtnText: { fontSize: 12, fontWeight: '600', color: COLORS.textPrimary },
  bookBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  bookBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  noReviews: { fontSize: 13, color: COLORS.textHint, fontStyle: 'italic' },
  reviewCard: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: 12,
    marginTop: 10,
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  reviewAuthor: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  reviewComment: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
  reviewDate: { fontSize: 11, color: COLORS.textHint, marginTop: 4 },
});
