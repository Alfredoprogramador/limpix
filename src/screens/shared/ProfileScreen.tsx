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
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/colors';
import { updateUser } from '../../services/database';

export function ProfileScreen() {
  const { user, logout, updateCurrentUser } = useAuth();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [address, setAddress] = useState(user?.address ?? '');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) { Alert.alert('Atenção', 'Informe seu nome.'); return; }
    setSaving(true);
    const updated = { ...user!, name: name.trim(), phone: phone.trim(), address: address.trim() };
    await updateUser(updated);
    await updateCurrentUser(updated);
    setSaving(false);
    setEditing(false);
    Alert.alert('✅ Perfil atualizado!');
  }

  function handleLogout() {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  }

  if (!user) return null;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {user.role === 'client' ? '👤 Cliente' : '🛠️ Prestador de Serviço'}
            </Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Informações Pessoais</Text>
            {!editing && (
              <TouchableOpacity onPress={() => setEditing(true)}>
                <Text style={styles.editBtn}>✏️ Editar</Text>
              </TouchableOpacity>
            )}
          </View>

          <InfoRow label="Nome" value={user.name} editing={editing} field={name} setField={setName} />
          <InfoRow label="E-mail" value={user.email} editing={false} field={user.email} setField={() => {}} disabled />
          <InfoRow label="Telefone" value={user.phone || '—'} editing={editing} field={phone} setField={setPhone} keyboardType="phone-pad" />
          <InfoRow label="Endereço" value={user.address || '—'} editing={editing} field={address} setField={setAddress} />

          {editing && (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.cancelBtn]}
                onPress={() => {
                  setEditing(false);
                  setName(user.name);
                  setPhone(user.phone);
                  setAddress(user.address ?? '');
                }}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.saveBtn]} onPress={handleSave} disabled={saving}>
                <Text style={styles.saveText}>{saving ? 'Salvando...' : 'Salvar'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function InfoRow({
  label, value, editing, field, setField, disabled, keyboardType,
}: {
  label: string;
  value: string;
  editing: boolean;
  field: string;
  setField: (v: string) => void;
  disabled?: boolean;
  keyboardType?: 'phone-pad' | 'default';
}) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      {editing && !disabled ? (
        <TextInput
          style={rowStyles.input}
          value={field}
          onChangeText={setField}
          keyboardType={keyboardType ?? 'default'}
          placeholderTextColor={COLORS.textHint}
        />
      ) : (
        <Text style={rowStyles.value}>{value}</Text>
      )}
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  label: { width: 90, fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  value: { flex: 1, fontSize: 15, color: COLORS.textPrimary },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.background,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: 40 },
  hero: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
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
  name: { fontSize: 20, fontWeight: '700', color: COLORS.white, marginBottom: 4 },
  email: { fontSize: 13, color: COLORS.white + 'CC', marginBottom: 12 },
  roleBadge: {
    backgroundColor: COLORS.white + '25',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: { color: COLORS.white, fontWeight: '600', fontSize: 13 },
  card: {
    backgroundColor: COLORS.surface,
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  editBtn: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  editActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  actionBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  cancelBtn: { borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.background },
  saveBtn: { backgroundColor: COLORS.primary },
  cancelText: { color: COLORS.textSecondary, fontWeight: '600' },
  saveText: { color: COLORS.white, fontWeight: '700' },
  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: COLORS.error + '15',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.error + '40',
  },
  logoutText: { color: COLORS.error, fontSize: 15, fontWeight: '700' },
});
