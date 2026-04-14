/**
 * Social authentication hook
 * Handles Google and Discord login flows via Firebase, mirroring Bingeki-V2 auth patterns
 */
import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useAuthRequest, makeRedirectUri, ResponseType } from 'expo-auth-session';
import { 
    GoogleAuthProvider, 
    signInAnonymously,
    signInWithCredential, 
    OAuthProvider,
    OAuthCredential
} from 'firebase/auth';
import { auth } from '@/firebase/config';
import { Alert } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// Client IDs from Firebase project (retrieved via MCP)
// --- IDs de Client (À compléter depuis la console Google) ---
const GOOGLE_WEB_CLIENT_ID = '1079885506084-u50lailu0jdgbm2h29cocoou764huksh.apps.googleusercontent.com';
const GOOGLE_IOS_CLIENT_ID = '1079885506084-8ens2a69lvk1genpesai98ut8gdbrat5.apps.googleusercontent.com';
// TODO: Créez un ID Android sur https://console.cloud.google.com/apis/credentials et mettez-le ici
// En attendant, l'ID Web est utilisé comme secours pour éviter le crash "androidClientId must be defined"
const GOOGLE_ANDROID_CLIENT_ID = GOOGLE_WEB_CLIENT_ID;

// Discord OIDC (configuré comme 'oidc.discord' dans la console Firebase)
const DISCORD_CLIENT_ID = '1327710830455595019';
const DISCORD_DISCOVERY = {
    authorizationEndpoint: 'https://discord.com/oauth2/authorize',
    tokenEndpoint: 'https://discord.com/api/oauth2/token',
};

export function useSocialAuth() {
    const [loading, setLoading] = useState(false);

    // --- Google Auth ---
    // En projet "Production", Google bloque auth.expo.io. On passe en redirection directe.
    const [googleRequest, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
        clientId: GOOGLE_WEB_CLIENT_ID,
        iosClientId: GOOGLE_IOS_CLIENT_ID,
        androidClientId: GOOGLE_ANDROID_CLIENT_ID,
        scopes: ['openid', 'profile', 'email'],
        redirectUri: makeRedirectUri({
            scheme: 'bingekimobile',
        }),
    });

    useEffect(() => {
        if (googleResponse?.type === 'success') {
            setLoading(true);
            const { idToken, authentication } = googleResponse.params;
            
            // In a direct native flow, the token is often in the authentication object
            const token = idToken || googleResponse.authentication?.idToken;

            if (token) {
                const credential = GoogleAuthProvider.credential(token);
                signInWithCredential(auth, credential)
                    .catch((error) => {
                        console.error('Google Firebase sign-in error:', error);
                        Alert.alert('Erreur', 'Échec de la connexion Google.');
                    })
                    .finally(() => setLoading(false));
            } else {
                console.error('No ID Token found in Google response. Response:', JSON.stringify(googleResponse));
                Alert.alert('Erreur', 'Impossible de récupérer le jeton d\'identité Google.');
                setLoading(false);
            }
        }
    }, [googleResponse]);

    const signInWithGoogle = async () => {
        try {
            await promptGoogleAsync();
        } catch (error) {
            console.error('Google prompt error:', error);
            Alert.alert('Erreur', 'Impossible d\'ouvrir la page de connexion Google.');
        }
    };

    // --- Discord Auth ---
    const redirectUri = makeRedirectUri({ scheme: 'bingekimobile' });

    const [discordRequest, discordResponse, promptDiscordAsync] = useAuthRequest(
        {
            clientId: DISCORD_CLIENT_ID,
            responseType: ResponseType.Code,
            scopes: ['identify', 'email', 'openid'],
            redirectUri,
        },
        DISCORD_DISCOVERY
    );

    useEffect(() => {
        if (discordResponse?.type === 'success') {
            setLoading(true);
            const { code } = discordResponse.params;
            // For OIDC Discord, we use the OAuthProvider with the authorization code
            // The Firebase OIDC provider 'oidc.discord' handles the token exchange
            const provider = new OAuthProvider('oidc.discord');
            const credential = provider.credential({
                idToken: code, // Firebase OIDC will handle the exchange
            });
            signInWithCredential(auth, credential)
                .catch((error) => {
                    console.error('Discord Firebase sign-in error:', error);
                    Alert.alert('Erreur', 'Échec de la connexion Discord. Vérifiez la configuration OIDC.');
                })
                .finally(() => setLoading(false));
        }
    }, [discordResponse]);

    const signInWithDiscord = async () => {
        try {
            await promptDiscordAsync();
        } catch (error) {
            console.error('Discord prompt error:', error);
            Alert.alert('Erreur', 'Impossible d\'ouvrir la page de connexion Discord.');
        }
    };

    const signInAsGuest = async () => {
        setLoading(true);
        try {
            await signInAnonymously(auth);
        } catch (error) {
            console.error('Guest sign-in error:', error);
            Alert.alert('Erreur', 'Impossible de se connecter en mode invité.');
        } finally {
            setLoading(false);
        }
    };

    return {
        signInWithGoogle,
        signInWithDiscord,
        signInAsGuest,
        loading,
        googleReady: !!googleRequest,
        discordReady: !!discordRequest,
    };
}
