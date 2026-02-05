import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { apiClient, SystemStats, HealthStatus } from '../api/client';
import { RecordingIndicator } from '../components/RecordingIndicator';
import { screenRecordingService } from '../services/ScreenRecordingService';
import { RecordingSession } from '../types/recording';

export default function Dashboard() {
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [health, setHealth] = useState<HealthStatus | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [recordingSession, setRecordingSession] = useState<RecordingSession | null>(null);

    const loadData = async () => {
        const [statsData, healthData] = await Promise.all([
            apiClient.getStats(),
            apiClient.getHealth()
        ]);
        setStats(statsData);
        setHealth(healthData);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    useEffect(() => {
        loadData();
        
        // Update recording session state every second
        const interval = setInterval(() => {
            const session = screenRecordingService.getCurrentSession();
            setRecordingSession(session);
        }, 1000);
        
        return () => clearInterval(interval);
    }, []);

    const handleRecordingToggle = async () => {
        const isRecording = screenRecordingService.isRecording();
        
        if (isRecording) {
            // Stop recording
            const filename = await screenRecordingService.stopRecording();
            if (filename) {
                Alert.alert(
                    'Recording Saved',
                    `Recording saved as ${filename}`,
                    [{ text: 'OK' }]
                );
            }
        } else {
            // Start recording
            const success = await screenRecordingService.startRecording();
            if (success) {
                Alert.alert(
                    'Recording Started',
                    'Screen recording in progress. Tap again to stop.',
                    [{ text: 'OK' }]
                );
            }
        }
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <RecordingIndicator session={recordingSession} />
            <Text style={styles.header}>⚡ QAntum Dashboard</Text>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                <StatCard
                    title="Lines of Code"
                    value={stats?.linesOfCode.toLocaleString() || '...'}
                    icon="📊"
                />
                <StatCard
                    title="Vectors"
                    value={stats?.vectors.toLocaleString() || '...'}
                    icon="🧠"
                />
                <StatCard
                    title="Modules"
                    value={stats?.modules.toString() || '...'}
                    icon="🔧"
                />
                <StatCard
                    title="Departments"
                    value={stats?.departments.toString() || '...'}
                    icon="🏛️"
                />
                <TouchableOpacity onPress={handleRecordingToggle}>
                    <RecordCard
                        title="SECURE RECORD"
                        description="Test Case Capture"
                        icon="🎥"
                        isRecording={screenRecordingService.isRecording()}
                    />
                </TouchableOpacity>
            </View>

            {/* Health Status */}
            <Text style={styles.sectionTitle}>🛡️ Service Health</Text>
            <View style={styles.healthContainer}>
                {health?.services.map((service, index) => (
                    <View key={index} style={styles.healthRow}>
                        <Text style={styles.serviceName}>{service.name}</Text>
                        <Text style={[
                            styles.serviceStatus,
                            service.status === 'up' ? styles.statusUp : styles.statusDown
                        ]}>
                            {service.status === 'up' ? '✅' : '❌'} {service.latency}ms
                        </Text>
                    </View>
                ))}
            </View>

            {/* Uptime */}
            <View style={styles.uptimeContainer}>
                <Text style={styles.uptimeLabel}>Uptime</Text>
                <Text style={styles.uptimeValue}>{stats?.uptime || '...'}</Text>
            </View>
        </ScrollView>
    );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: string }) {
    return (
        <View style={styles.statCard}>
            <Text style={styles.statIcon}>{icon}</Text>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
        </View>
    );
}

function RecordCard({ 
    title, 
    description, 
    icon, 
    isRecording 
}: { 
    title: string; 
    description: string; 
    icon: string; 
    isRecording: boolean;
}) {
    return (
        <View style={[
            styles.statCard,
            isRecording && styles.recordingCard
        ]}>
            <Text style={styles.statIcon}>{icon}</Text>
            <Text style={styles.recordTitle}>{title}</Text>
            <Text style={styles.recordDescription}>{description}</Text>
            {isRecording && <Text style={styles.recordingBadge}>● RECORDING</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020205',
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#00f5ff',
        textAlign: 'center',
        marginBottom: 30,
        marginTop: 50,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statCard: {
        width: '48%',
        backgroundColor: '#1a1a3a',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0, 245, 255, 0.2)',
    },
    statIcon: {
        fontSize: 30,
        marginBottom: 10,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    statTitle: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 5,
    },
    recordTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#00f5ff',
        marginBottom: 5,
    },
    recordDescription: {
        fontSize: 11,
        color: '#94a3b8',
    },
    recordingCard: {
        borderColor: '#ff0000',
        borderWidth: 2,
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
    },
    recordingBadge: {
        fontSize: 10,
        color: '#ff0000',
        fontWeight: 'bold',
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
    },
    healthContainer: {
        backgroundColor: '#1a1a3a',
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
    },
    healthRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    serviceName: {
        color: '#fff',
        fontSize: 16,
    },
    serviceStatus: {
        fontSize: 14,
    },
    statusUp: {
        color: '#00ff9d',
    },
    statusDown: {
        color: '#ff5f56',
    },
    uptimeContainer: {
        backgroundColor: '#1a1a3a',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        marginBottom: 50,
    },
    uptimeLabel: {
        color: '#94a3b8',
        fontSize: 14,
    },
    uptimeValue: {
        color: '#00ff9d',
        fontSize: 36,
        fontWeight: 'bold',
    },
});
