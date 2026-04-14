/**
 * Social authentication hook
 * Handles Google, Discord, and Guest sign-in flows
 */
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { useAuthRequest, makeRedirectUri, ResponseType } from 'expo-auth-session';
import { 
    signInWithCredential, 
    GoogleAuthProvider, 
    OAuthProvider,
    signInAnonymously 
} from 'firebase/auth';
import { auth } from '@/firebase/config';

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const DISCORD_CLIENT_ID = process.env.EXPO_PUBLIC_DISCORD_CLIENT_ID || '';

const DISCORD_DISCOVERY = {
    authorizationEndpoint: 'https://discord.com/oauth2/authorize',
    tokenEndpoint: 'https://discord.com/api/oauth2/token',
};

export function useSocialAuth() {
    const [loading, setLoading] = useState(false);

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
            const { idToken } = googleResponse.params;
            const token = idToken || googleResponse.authentication?.idToken;

            if (token) {
                const credential = GoogleAuthProvider.credential(token);
                signInWithCredential(auth, credential)
                    .catch((error) => {
                        console.error('Google Firebase sign-in error:', error);
                        Alert.alert('Error', 'Google sign-in failed.');
                    })
                    .finally(() => setLoading(false));
            } else {
                console.error('No ID Token found in Google response');
                Alert.alert('Error', 'Unable to retrieve Google identity token.');
                setLoading(false);
            }
        }
    }, [googleResponse]);

    const signInWithGoogle = async () => {
        try {
            await promptGoogleAsync();
        } catch (error) {
            console.error('Google prompt error:', error);
            Alert.alert('Error', 'Could not open Google login page.');
        }
    };

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
            
            if (code) {
                const provider = new OAuthProvider('oidc.discord');
                const credential = provider.credential({
                    idToken: code,
                });
                signInWithCredential(auth, credential)
                    .catch((error) => {
                        console.error('Discord Firebase sign-in error:', error);
                        Alert.alert('Error', 'Discord sign-in failed.');
                    })
                    .finally(() => setLoading(false));
            } else {
                setLoading(false);
                Alert.alert('Error', 'No authorization code received from Discord.');
            }
        }
    }, [discordResponse]);

    const signInWithDiscord = async () => {
        try {
            await promptDiscordAsync();
        } catch (error) {
            console.error('Discord prompt error:', error);
            Alert.alert('Error', 'Could not open Discord login page.');
        }
    };

    const signInAsGuest = async () => {
        setLoading(true);
        try {
            await signInAnonymously(auth);
        } catch (error) {
            console.error('Guest sign-in error:', error);
            Alert.alert('Error', 'Could not sign in as guest.');
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
