import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ClientStackParamList, ServiceProvider } from '../../types';
import { COLORS } from '../../constants/colors';
import { SERVICE_MAP } from '../../constants/services';
import { getProviders } from '../../services/database';
import { ProviderCard } from '../../components/ProviderCard';

type Nav = NativeStackNavigationProp<ClientStackParamList, 'ProviderList'>;
type Route = RouteProp<ClientStackParamList, 'ProviderList'>;

export function ProviderListScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { category } = route.params;

  const svc = SERVICE_MAP[category];

  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [filtered, setFiltered] = useState<ServiceProvider[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const list = await getProviders(category);
    setProviders(list);
    setFiltered(list);
    setLoading(false);
  }, [category]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const q = search.toLowerCase().trim();
    if (!q) {
      setFiltered(providers);
    } else {
      setFiltered(
        providers.filter(
          p =>
            p.name.toLowerCase().includes(q) ||
            p.city.toLowerCase().includes(q) ||
            p.neighborhood.toLowerCase().includes(q)
        )
      );
    }
  }, [search, providers]);

  function openProvider(id: string) {
    navigation.navigate('ProviderProfile', { providerId: id });
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.svcEmoji}>{svc?.icon}</Text>
        <View>
          <Text style={styles.svcLabel}>{svc?.label}</Text>
          <Text style={styles.svcDesc}>{svc?.description}</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          placeholder="Buscar por nome, cidade ou bairro..."
          placeholderTextColor={COLORS.textHint}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.primary} size="large" style={{ marginTop: 40 }} />
      ) : filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhum prestador encontrado.</Text>
          <Text style={styles.emptyHint}>Tente buscar em outra cidade ou bairro.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ProviderCard provider={item} onPress={() => openProvider(item.id)} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
  },
  svcEmoji: { fontSize: 40 },
  svcLabel: { fontSize: 20, fontWeight: '700', color: COLORS.white },
  svcDesc: { fontSize: 12, color: COLORS.white + 'CC', marginTop: 2, maxWidth: 260 },
  searchWrap: { padding: 16 },
  search: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  emptyHint: { fontSize: 13, color: COLORS.textSecondary, marginTop: 8 },
});
