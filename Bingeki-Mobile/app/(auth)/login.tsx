/**
 * User login screen
 * Handles user identification and session start with Brutalist Manga UI
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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { Colors, Spacing, Fonts, Borders } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/themed-text';
import { BackgroundSystem } from '@/components/layout/BackgroundSystem';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useSocialAuth } from '@/hooks/useSocialAuth';
import { Card } from '@/components/ui/Card';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { 
        signInWithGoogle, 
        signInWithDiscord, 
        signInAsGuest,
        loading: socialLoading 
    } = useSocialAuth();
    const primaryPink = useThemeColor({}, 'primary');
    const borderHeavyColor = useThemeColor({}, 'borderHeavy');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Redirection is handled by RootLayout logic
        } catch (error: any) {
            console.error('Login error:', error);
            let message = 'Une erreur est survenue lors de la connexion.';
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                message = 'Email ou mot de passe incorrect.';
            } else if (error.code === 'auth/invalid-email') {
                message = 'Format d\'email invalide.';
            }
            Alert.alert('Erreur', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <BackgroundSystem>
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
                        {/* Huge Branding Section */}
                        <View style={styles.header}>
                            <View style={[styles.logoBox, { borderColor: borderHeavyColor }]}>
                                <ThemedText style={styles.logoText}>BINGEKI</ThemedText>
                                <View style={[styles.cornerBox, { backgroundColor: primaryPink }]} />
                                <View style={[styles.bottomDecorator, { backgroundColor: borderHeavyColor }]} />
                            </View>
                            <ThemedText style={styles.subtitle}>CHAMPIONS ARE BORN IN THE BINGE</ThemedText>
                        </View>

                        {/* Form in a Manga Panel Card */}
                        <Card variant="manga" style={styles.formCard}>
                            <View style={styles.cardHeader}>
                                <ThemedText style={styles.formTitle}>CONNEXION</ThemedText>
                                <View style={[styles.titleUnderline, { backgroundColor: primaryPink }]} />
                            </View>

                            <View style={styles.form}>
                                <ThemedText style={styles.label}>IDENTIFIANT / EMAIL</ThemedText>
                                <Input
                                    placeholder="votre@email.com"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    icon={<IconSymbol name="envelope.fill" size={18} color={borderHeavyColor} />}
                                    containerStyle={styles.inputContainer}
                                />

                                <ThemedText style={styles.label}>SECRET / MOT DE PASSE</ThemedText>
                                <Input
                                    placeholder="••••••••"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    icon={<IconSymbol name="lock.fill" size={18} color={borderHeavyColor} />}
                                    containerStyle={styles.inputContainer}
                                />

                                <Button
                                    title={loading ? "CHARGEMENT..." : "REJOINDRE LE COMBAT"}
                                    variant="manga"
                                    size="lg"
                                    onPress={handleLogin}
                                    isLoading={loading}
                                    style={styles.loginButton}
                                />

                                <View style={styles.separatorContainer}>
                                    <View style={[styles.separatorLine, { backgroundColor: borderHeavyColor, opacity: 0.2 }]} />
                                    <ThemedText style={styles.separatorText}>OU</ThemedText>
                                    <View style={[styles.separatorLine, { backgroundColor: borderHeavyColor, opacity: 0.2 }]} />
                                </View>

                                <View style={styles.socialContainer}>
                                    <TouchableOpacity 
                                        style={[styles.socialIconBtn, { borderColor: borderHeavyColor }]}
                                        onPress={signInWithGoogle}
                                    >
                                        <IconSymbol name="logo-google" size={24} color={borderHeavyColor} />
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity 
                                        style={[styles.socialIconBtn, { borderColor: borderHeavyColor, backgroundColor: '#5865F2' }]}
                                        onPress={signInWithDiscord}
                                    >
                                        <IconSymbol name="logo-discord" size={24} color="#FFF" />
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity 
                                    style={styles.guestLink}
                                    onPress={signInAsGuest}
                                >
                                    <ThemedText style={[styles.guestLinkText, { color: primaryPink }]}>
                                        EXPLORER EN ACCÈS INVITÉ
                                    </ThemedText>
                                </TouchableOpacity>
                            </View>
                        </Card>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <ThemedText style={styles.footerText}>PAS ENCORE DE COMPTE ?</ThemedText>
                            <Link href="/(auth)/register" asChild>
                                <TouchableOpacity>
                                    <ThemedText style={[styles.registerLink, { color: primaryPink }]}>
                                        S'INSCRIRE MAINTENANT
                                    </ThemedText>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </BackgroundSystem>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: Spacing.lg,
    },
    content: {
        width: '100%',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoBox: {
        borderWidth: 6,
        paddingHorizontal: 25,
        paddingVertical: 10,
        backgroundColor: '#FFF',
        position: 'relative',
        marginBottom: 20,
        transform: [{ rotate: '-1.5deg' }],
    },
    logoText: {
        fontSize: 56,
        fontFamily: Fonts.headingBold,
        letterSpacing: -3,
        color: '#000',
        fontWeight: '900',
    },
    cornerBox: {
        position: 'absolute',
        top: -12,
        right: -12,
        width: 24,
        height: 24,
        borderWidth: 4,
        borderColor: '#000',
    },
    bottomDecorator: {
        position: 'absolute',
        bottom: -10,
        left: 20,
        width: 60,
        height: 6,
    },
    subtitle: {
        fontSize: 10,
        fontFamily: Fonts.headingBold,
        textAlign: 'center',
        letterSpacing: 2,
        opacity: 0.8,
    },
    formCard: {
        width: '100%',
        maxWidth: 420,
        padding: Spacing.xl,
    },
    cardHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    formTitle: {
        fontSize: 24,
        fontFamily: Fonts.headingBold,
        letterSpacing: -0.5,
    },
    titleUnderline: {
        height: 4,
        width: 40,
        marginTop: 4,
    },
    form: {
        width: '100%',
    },
    label: {
        fontSize: 11,
        fontFamily: Fonts.headingBold,
        marginBottom: 8,
        letterSpacing: 1.5,
        opacity: 0.6,
    },
    inputContainer: {
        marginBottom: 20,
    },
    loginButton: {
        marginTop: 10,
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    separatorLine: {
        flex: 1,
        height: 2,
    },
    separatorText: {
        marginHorizontal: 15,
        fontSize: 10,
        fontFamily: Fonts.headingBold,
        letterSpacing: 1,
        opacity: 0.4,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 20,
    },
    socialIconBtn: {
        width: 60,
        height: 60,
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    guestLink: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    guestLinkText: {
        fontSize: 12,
        fontFamily: Fonts.headingBold,
        textDecorationLine: 'underline',
    },
    footer: {
        marginTop: 30,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 11,
        fontFamily: Fonts.bodyBold,
        marginBottom: 5,
        opacity: 0.7,
    },
    registerLink: {
        fontSize: 13,
        fontFamily: Fonts.headingBold,
        textDecorationLine: 'underline',
    },
});