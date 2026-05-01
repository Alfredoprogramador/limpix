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
import { StarRating } from '../../components/StarRating';
import { createReview } from '../../services/database';
import { useAuth } from '../../context/AuthContext';

type Nav = NativeStackNavigationProp<ClientStackParamList, 'Review'>;
type Route = RouteProp<ClientStackParamList, 'Review'>;

function generateId() {
  return `rv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function ReviewScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { bookingId, providerId, providerName } = route.params;
  const { user } = useAuth();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (rating === 0) {
      Alert.alert('Atenção', 'Selecione uma nota de 1 a 5 estrelas.');
      return;
    }
    if (!comment.trim()) {
      Alert.alert('Atenção', 'Escreva um comentário sobre o serviço.');
      return;
    }

    setLoading(true);
    await createReview({
      id: generateId(),
      bookingId,
      clientId: user!.id,
      clientName: user!.name,
      providerId,
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    });
    setLoading(false);

    Alert.alert(
      '⭐ Avaliação enviada!',
      'Obrigado pelo seu feedback. Isso ajuda outros clientes!',
      [{ text: 'OK', onPress: () => navigation.popToTop() }]
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>⭐</Text>
          <Text style={styles.heroTitle}>Avaliar Serviço</Text>
          <Text style={styles.heroSub}>Como foi o serviço com {providerName}?</Text>
        </View>

        {/* Star rating */}
        <View style={styles.ratingSection}>
          <Text style={styles.label}>Sua nota</Text>
          <StarRating value={rating} size={44} onChange={setRating} />
          <Text style={styles.ratingLabel}>
            {rating === 0 ? 'Toque nas estrelas para avaliar' :
             rating === 1 ? '😞 Muito ruim' :
             rating === 2 ? '😕 Ruim' :
             rating === 3 ? '😐 Regular' :
             rating === 4 ? '😊 Bom' :
             '🤩 Excelente!'}
          </Text>
        </View>

        {/* Comment */}
        <View style={styles.commentSection}>
          <Text style={styles.label}>Comentário *</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Conte como foi o serviço, pontualidade, qualidade do trabalho..."
            placeholderTextColor={COLORS.textHint}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.charCount}>{comment.length}/500</Text>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Enviando...' : '📤 Enviar Avaliação'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 24, paddingBottom: 40 },
  hero: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 28,
    marginBottom: 24,
  },
  heroEmoji: { fontSize: 48, marginBottom: 8 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: COLORS.white },
  heroSub: { fontSize: 14, color: COLORS.white + 'CC', marginTop: 6, textAlign: 'center' },
  ratingSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  label: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12, alignSelf: 'flex-start' },
  ratingLabel: { fontSize: 16, color: COLORS.textSecondary, marginTop: 12, fontWeight: '500' },
  commentSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  textArea: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: COLORS.textPrimary,
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: { fontSize: 11, color: COLORS.textHint, textAlign: 'right', marginTop: 6 },
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
