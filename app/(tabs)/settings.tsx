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
      <View style={[styles.section, { borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
        
        <TouchableOpacity 
          style={styles.row} 
          onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Text style={[styles.rowText, { color: colors.text }]}>Dark Mode</Text>
          <Switch 
            value={theme === 'dark'} 
            onValueChange={(val) => setTheme(val ? 'dark' : 'light')} 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.row} 
          onPress={() => setTheme('system')}
        >
          <Text style={[styles.rowText, { color: colors.text }]}>Use System Theme</Text>
          <Switch 
            value={theme === 'system'} 
            onValueChange={(val) => val && setTheme('system')} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
        <Text style={[styles.version, { color: colors.text + '80' }]}>Gramafon v1.0.0</Text>
        <Text style={[styles.credits, { color: colors.text + '80' }]}>Powered by Ciao Music API</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowText: {
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    marginTop: 8,
  },
  version: {
    fontSize: 14,
  },
  credits: {
    fontSize: 14,
    marginTop: 4,
  },
});
