import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export interface CommunityConfig {
    domain: string;
    communityName: string;
    hiveCommunityId: string;
    logoUrl?: string;
    primaryColor?: string;
    onboardingSats?: number;
    communityDescription?: string;
    communityDescriptionExtra?: string;
    isConfigured?: boolean;
    sslVerificationData?: {
        hostname_id: string;
        ssl: any;
        ownership_verification: any;
    };
    hostnameStatus?: string;
}

export const configService = {
    async fetchConfig(domain: string): Promise<CommunityConfig | null> {
        try {
            const response = await axios.get(`${API_BASE_URL}/config/${domain}`);
            if (response.data.success) {
                return response.data.config;
            }
            return null;
        } catch (error) {
            console.error('Error fetching config:', error);
            return null;
        }
    },

    async saveConfig(config: CommunityConfig): Promise<{ success: boolean; config?: CommunityConfig; message?: string }> {
        try {
            const response = await axios.post(`${API_BASE_URL}/config`, config);
            return response.data;
        } catch (error: any) {
            console.error('Error saving config:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to save configuration'
            };
        }
    }
};
