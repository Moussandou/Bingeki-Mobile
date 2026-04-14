/**
 * User registration screen
 * Handles account creation with Brutalist Manga UI
 */
import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Dimensions, 
  Alert,
  TouchableOpacity
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { Colors, Spacing, Fonts, Borders } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function RegisterScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const primaryPink = useThemeColor({}, 'primary');
    const borderHeavyColor = useThemeColor({}, 'borderHeavy');
    const surfaceColor = useThemeColor({}, 'surface');
    const textPrimaryColor = useThemeColor({}, 'text');

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Erreur', 'Le mot de passe doit faire au moins 6 caractères.');
            return;
        }

        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // Redirection is handled by RootLayout logic
        } catch (error: any) {
            console.error('Register error:', error);
            let message = 'Une erreur est survenue lors de l\'inscription.';
            if (error.code === 'auth/email-already-in-use') {
                message = 'Cet email est déjà utilisé.';
            } else if (error.code === 'auth/invalid-email') {
                message = 'Format d\'email invalide.';
            } else if (error.code === 'auth/weak-password') {
                message = 'Mot de passe trop faible.';
            }
            Alert.alert('Erreur', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>

                        <View style={styles.header}>
                            <View style={[styles.headerBox, { backgroundColor: surfaceColor, borderColor: borderHeavyColor }]}>
                                <ThemedText style={[styles.headerText, { color: textPrimaryColor }]}>REJOINDRE</ThemedText>
                                <View style={[styles.cornerBox, { backgroundColor: primaryPink, borderColor: borderHeavyColor }]} />
                            </View>
                            <ThemedText style={styles.subtitle}>CRÉEZ VOTRE COMPTE BINGEKI</ThemedText>
                        </View>


                        <View style={styles.form}>
                            <ThemedText style={styles.label}>EMAIL</ThemedText>
                            <Input
                                placeholder="votre@email.com"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                icon={<IconSymbol name="envelope.fill" size={20} color={borderHeavyColor} />}
                                containerStyle={styles.inputContainer}
                            />

                            <ThemedText style={styles.label}>MOT DE PASSE</ThemedText>
                            <Input
                                placeholder="••••••••"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                icon={<IconSymbol name="lock.fill" size={20} color={borderHeavyColor} />}
                                containerStyle={styles.inputContainer}
                            />

                            <ThemedText style={styles.label}>CONFIRMER LE MOT DE PASSE</ThemedText>
                            <Input
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                icon={<IconSymbol name="lock.shield.fill" size={20} color={borderHeavyColor} />}
                                containerStyle={styles.inputContainer}
                            />

                            <Button
                                title={loading ? "INSCRIPTION..." : "S'INSCRIRE"}
                                variant="manga"
                                size="lg"
                                onPress={handleRegister}
                                isLoading={loading}
                                style={styles.registerButton}
                            />
                        </View>


                        <View style={styles.footer}>
                            <ThemedText style={styles.footerText}>DÉJÀ UN COMPTE ?</ThemedText>
                            <Link href="/(auth)/login" asChild>
                                <TouchableOpacity>
                                    <ThemedText style={[styles.loginLink, { color: primaryPink }]}>
                                        SE CONNECTER
                                    </ThemedText>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    content: {
        width: '100%',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    headerBox: {
        borderWidth: 4,
        paddingHorizontal: 20,
        paddingVertical: 10,
        position: 'relative',
        marginBottom: 15,
        transform: [{ rotate: '2deg' }],
    },
    headerText: {
        fontSize: 40,
        fontFamily: Fonts.headingBold,
        letterSpacing: -2,
    },
    cornerBox: {
        position: 'absolute',
        bottom: -8,
        left: -8,
        width: 16,
        height: 16,
        borderWidth: 2,
        borderColor: '#000',
    },
    subtitle: {
        fontSize: 12,
        fontFamily: Fonts.heading,
        textAlign: 'center',
        letterSpacing: 1,
    },
    form: {
        width: '100%',
        maxWidth: 400,
    },
    label: {
        fontSize: 14,
        fontFamily: Fonts.headingBold,
        marginBottom: 8,
        letterSpacing: 1,
    },
    inputContainer: {
        marginBottom: 20,
    },
    registerButton: {
        marginTop: 10,
    },
    footer: {
        marginTop: 30,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        fontFamily: Fonts.bodyBold,
        marginBottom: 5,
    },
    loginLink: {
        fontSize: 14,
        fontFamily: Fonts.headingBold,
        textDecorationLine: 'underline',
    },
});