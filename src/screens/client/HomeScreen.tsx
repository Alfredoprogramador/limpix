import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ServiceCard } from '../../components/ServiceCard';
import { SERVICES } from '../../constants/services';
import { COLORS } from '../../constants/colors';
import { ClientStackParamList, ServiceCategory } from '../../types';
import { useAuth } from '../../context/AuthContext';

type Nav = NativeStackNavigationProp<ClientStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();

  function handleCategory(category: ServiceCategory) {
    navigation.navigate('ProviderList', { category });
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user?.name.split(' ')[0]} 👋</Text>
          <Text style={styles.subtitle}>O que você precisa hoje?</Text>
        </View>
        <View style={styles.avatarSmall}>
          <Text style={styles.avatarLetter}>{user?.name.charAt(0).toUpperCase()}</Text>
        </View>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>🏆 Profissionais verificados</Text>
        <Text style={styles.bannerSub}>Serviços de qualidade para o seu lar</Text>
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categorias de Serviço</Text>
      <FlatList
        data={SERVICES}
        keyExtractor={item => item.key}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <ServiceCard service={item} onPress={() => handleCategory(item.key)} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

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
  banner: {
    backgroundColor: COLORS.secondary,
    marginHorizontal: 16,
    marginTop: -12,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  bannerTitle: { fontSize: 15, fontWeight: '700', color: COLORS.white },
  bannerSub: { fontSize: 12, color: COLORS.white + 'CC', marginTop: 4 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  row: { justifyContent: 'space-between', paddingHorizontal: 16 },
  list: { paddingBottom: 24 },
});
