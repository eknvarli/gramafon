import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useSettingsStore } from '../../src/store/useSettingsStore';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { theme, setTheme, loadSettings } = useSettingsStore();

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Developer</Text>
          <Text style={styles.infoValue}>Ekin Ilter Varli</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Powered by</Text>
          <Text style={styles.infoValue}>Ciao Music API</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>GRAMAFON</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    marginBottom: 24,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowInfo: {
    flex: 1,
  },
  rowText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  infoLabel: {
    color: '#B3B3B3',
    fontSize: 16,
  },
  infoValue: {
    color: '#FFF',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 80,
  },
  footerText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1DB954',
    letterSpacing: 4,
    opacity: 0.5,
  },
});
