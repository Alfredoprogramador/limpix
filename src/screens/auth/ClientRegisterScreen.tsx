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
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { AuthStackParamList } from '../../types';
import { COLORS } from '../../constants/colors';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'ClientRegister'>;

export function ClientRegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
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

    setLoading(true);
    const result = await register({ name, email, phone, address, password, role: 'client' });
    setLoading(false);

    if (!result.success) {
      Alert.alert('Erro', result.error ?? 'Não foi possível cadastrar.');
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>
          <View style={styles.logoWrap}>
            <Text style={styles.logoEmoji}>👤</Text>
            <Text style={styles.title}>Cadastro de Cliente</Text>
            <Text style={styles.subtitle}>
              Crie sua conta e encontre os melhores profissionais
            </Text>
          </View>
        </View>

        {/* Form card */}
        <View style={styles.card}>
          <Field
            label="Nome completo *"
            value={name}
            onChangeText={setName}
            placeholder="Seu nome completo"
          />
          <Field
            label="E-mail *"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Field
            label="Telefone / WhatsApp *"
            value={phone}
            onChangeText={setPhone}
            placeholder="(11) 99999-0000"
            keyboardType="phone-pad"
          />
          <Field
            label="Endereço"
            value={address}
            onChangeText={setAddress}
            placeholder="Rua, número, bairro"
          />
          <Field
            label="Senha *"
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 6 caracteres"
            secure
          />
          <Field
            label="Confirmar senha *"
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Repita a senha"
            secure
          />

          <TouchableOpacity
            style={styles.btn}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.btnText}>Criar Conta</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Já tem conta?{' '}
            <Text
              style={styles.footerLink}
              onPress={() => navigation.navigate('Login')}
            >
              Fazer login
            </Text>
          </Text>
          <Text style={styles.footerText}>
            É prestador de serviços?{' '}
            <Text
              style={styles.footerLink}
              onPress={() => navigation.navigate('Register', { role: 'provider' })}
            >
              Cadastrar como Prestador
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  secure,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'email-address' | 'phone-pad' | 'default';
  autoCapitalize?: 'none' | 'sentences';
  secure?: boolean;
}) {
  return (
    <View style={fieldStyles.wrap}>
      <Text style={fieldStyles.label}>{label}</Text>
      <TextInput
        style={fieldStyles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textHint}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize={autoCapitalize ?? 'sentences'}
        secureTextEntry={secure}
        autoCorrect={false}
      />
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background,
  },
});

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.primary },
  container: { flexGrow: 1, padding: 24, paddingBottom: 40 },
  header: { marginBottom: 24 },
  back: { marginBottom: 16 },
  backText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
  logoWrap: { alignItems: 'center' },
  logoEmoji: { fontSize: 48, marginBottom: 8 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.white + 'CC',
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  footer: { alignItems: 'center', marginTop: 24, gap: 10 },
  footerText: {
    color: COLORS.white + 'CC',
    fontSize: 14,
    textAlign: 'center',
  },
  footerLink: { color: COLORS.white, fontWeight: '700', textDecorationLine: 'underline' },
});
