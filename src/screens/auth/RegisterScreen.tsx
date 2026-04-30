import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { useAuth } from '../../context/AuthContext';
import { AuthStackParamList, UserRole } from '../../types';
import { COLORS } from '../../constants/colors';
import { createProvider } from '../../services/database';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;
type Route = RouteProp<AuthStackParamList, 'Register'>;

export function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { register } = useAuth();

  const [role, setRole] = useState<UserRole>(route.params?.role ?? 'client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  // Provider extra fields
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [description, setDescription] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (role === 'provider' && (!city.trim() || !neighborhood.trim() || !description.trim())) {
      Alert.alert('Atenção', 'Preencha cidade, bairro e descrição.');
      return;
    }

    setLoading(true);
    const result = await register({ name, email, phone, password, role });
    if (!result.success) {
      setLoading(false);
      Alert.alert('Erro', result.error ?? 'Não foi possível cadastrar.');
      return;
    }

    // If provider, also create provider profile
    if (role === 'provider' && result.success) {
      // We get the user from auth context after register — use email to lookup
      const { getUserByEmail } = await import('../../services/database');
      const user = await getUserByEmail(email.toLowerCase().trim());
      if (user) {
        await createProvider({
          ...user,
          role: 'provider',
          services: [],
          description: description.trim(),
          city: city.trim(),
          neighborhood: neighborhood.trim(),
          whatsapp: whatsapp.trim() || phone.trim(),
          available: true,
          priceRange: priceRange.trim() || 'A combinar',
          rating: 0,
          reviewCount: 0,
        });
      }
    }

    setLoading(false);
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Criar Conta</Text>

        {/* Role Switch */}
        <View style={styles.roleRow}>
          <TouchableOpacity
            style={[styles.roleBtn, role === 'client' && styles.roleActive]}
            onPress={() => setRole('client')}
          >
            <Text style={[styles.roleTxt, role === 'client' && styles.roleTxtActive]}>👤 Cliente</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleBtn, role === 'provider' && styles.roleActive]}
            onPress={() => setRole('provider')}
          >
            <Text style={[styles.roleTxt, role === 'provider' && styles.roleTxtActive]}>🛠️ Prestador</Text>
          </TouchableOpacity>
        </View>

        {/* Common fields */}
        <Field label="Nome completo *" value={name} onChangeText={setName} placeholder="Seu nome" />
        <Field label="E-mail *" value={email} onChangeText={setEmail} placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none" />
        <Field label="Telefone / WhatsApp *" value={phone} onChangeText={setPhone} placeholder="(11) 99999-0000" keyboardType="phone-pad" />
        <Field label="Senha *" value={password} onChangeText={setPassword} placeholder="Mínimo 6 caracteres" secure />
        <Field label="Confirmar senha *" value={confirm} onChangeText={setConfirm} placeholder="Repita a senha" secure />

        {/* Provider extra */}
        {role === 'provider' && (
          <>
            <Text style={styles.sectionTitle}>Informações do Prestador</Text>
            <Field label="Cidade *" value={city} onChangeText={setCity} placeholder="São Paulo" />
            <Field label="Bairro *" value={neighborhood} onChangeText={setNeighborhood} placeholder="Vila Madalena" />
            <Field label="Descrição dos serviços *" value={description} onChangeText={setDescription} placeholder="Descreva sua experiência..." multiline />
            <Field label="WhatsApp para contato" value={whatsapp} onChangeText={setWhatsapp} placeholder="(11) 99999-0000" keyboardType="phone-pad" />
            <Field label="Faixa de preço" value={priceRange} onChangeText={setPriceRange} placeholder="Ex: R$ 80 – R$ 200" />
          </>
        )}

        <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.btnText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.loginHint}>
          Já tem conta?{' '}
          <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
            Fazer login
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label, value, onChangeText, placeholder, keyboardType, autoCapitalize, secure, multiline,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'email-address' | 'phone-pad' | 'default';
  autoCapitalize?: 'none' | 'sentences';
  secure?: boolean;
  multiline?: boolean;
}) {
  return (
    <View style={fieldStyles.wrap}>
      <Text style={fieldStyles.label}>{label}</Text>
      <TextInput
        style={[fieldStyles.input, multiline && fieldStyles.multiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textHint}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize={autoCapitalize ?? 'sentences'}
        secureTextEntry={secure}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
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
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.surface,
  },
  multiline: { height: 80, textAlignVertical: 'top' },
});

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, padding: 24 },
  back: { marginBottom: 16 },
  backText: { color: COLORS.primary, fontSize: 16, fontWeight: '600' },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 20 },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  roleBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  roleActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  roleTxt: { fontSize: 15, fontWeight: '600', color: COLORS.textSecondary },
  roleTxtActive: { color: COLORS.primary },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginTop: 16, marginBottom: 8 },
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  btnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  loginHint: { textAlign: 'center', color: COLORS.textSecondary, fontSize: 14 },
  loginLink: { color: COLORS.primary, fontWeight: '700' },
});
