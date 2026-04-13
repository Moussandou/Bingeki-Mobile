/**
 * Work Details Screen (Placeholder)
 * Displays details for a specific Anime or Manga
 */
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { BackgroundSystem } from '@/components/layout/BackgroundSystem';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Spacing, Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function DetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const primaryPink = useThemeColor({}, 'primary');
    const borderHeavyColor = useThemeColor({}, 'borderHeavy');

    return (
        <BackgroundSystem>
            <View style={styles.container}>
                <TouchableOpacity 
                    style={[styles.backButton, { borderColor: borderHeavyColor }]}
                    onPress={() => router.back()}
                >
                    <IconSymbol name="chevron.left.forwardslash.chevron.right" size={24} color={primaryPink} />
                </TouchableOpacity>

                <View style={styles.content}>
                    <ThemedText style={styles.title}>DÉTAILS DE L'ŒUVRE</ThemedText>
                    <ThemedText style={[styles.idText, { color: primaryPink }]}>ID: {id}</ThemedText>
                    
                    <View style={[styles.placeholderCard, { borderColor: borderHeavyColor }]}>
                        <ThemedText style={styles.placeholderText}>
                            CET ÉCRAN EST EN COURS DE DÉVELOPPEMENT.
                        </ThemedText>
                        <ThemedText style={styles.placeholderSub}>
                            LE PORTAGE DE LA LOGIQUE DE DÉTAILS DEPUIS LA V2 EST LA PROCHAINE ÉTAPE.
                        </ThemedText>
                    </View>
                </View>
            </View>
        </BackgroundSystem>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: Spacing.md,
    },
    backButton: {
        width: 50,
        height: 50,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 40,
    },
    title: {
        fontSize: 28,
        fontFamily: Fonts.heading,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    idText: {
        fontSize: 18,
        fontFamily: Fonts.headingBold,
        marginBottom: Spacing.xl,
    },
    placeholderCard: {
        borderWidth: 2,
        padding: Spacing.lg,
        width: '100%',
        backgroundColor: 'rgba(255, 46, 99, 0.05)',
    },
    placeholderText: {
        fontFamily: Fonts.headingBold,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    placeholderSub: {
        fontFamily: Fonts.body,
        fontSize: 14,
        textAlign: 'center',
        opacity: 0.7,
    }
});
