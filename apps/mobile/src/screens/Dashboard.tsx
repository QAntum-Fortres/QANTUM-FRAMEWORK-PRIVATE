import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { apiClient, SystemStats, HealthStatus } from '../api/client';

export default function Dashboard() {
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [health, setHealth] = useState<HealthStatus | null>(null);
    const [refreshing, setRefreshing] = useState(false);

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
    }, []);

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <Text style={styles.header} accessibilityRole="header">⚡ QAntum Dashboard</Text>

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
            </View>

            {/* Health Status */}
            <Text style={styles.sectionTitle} accessibilityRole="header">🛡️ Service Health</Text>
            <View style={styles.healthContainer}>
                {health?.services.map((service, index) => (
                    <View
                        key={index}
                        style={styles.healthRow}
                        accessible={true}
                        accessibilityLabel={`${service.name}, status: ${service.status}, latency: ${service.latency} milliseconds`}
                    >
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
            <View
                style={styles.uptimeContainer}
                accessible={true}
                accessibilityLabel={`System Uptime: ${stats?.uptime || 'loading'}`}
            >
                <Text style={styles.uptimeLabel}>Uptime</Text>
                <Text style={styles.uptimeValue}>{stats?.uptime || 'Loading...'}</Text>
            </View>
        </ScrollView>
    );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: string }) {
    return (
        <View
            style={styles.statCard}
            accessible={true}
            accessibilityLabel={`${title}: ${value}`}
        >
            <Text style={styles.statIcon}>{icon}</Text>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
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
