import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';


const SetupScreen = ({ navigation }) => {
  const [totalTime, setTotalTime] = useState(25);
  
  const [breaks, setBreaks] = useState(0);
  
  const [selectedActivity, setSelectedActivity] = useState(null);
  
  const [activities, setActivities] = useState([
    { id: 1, name: 'Study', color: '#6366f1' },
    { id: 2, name: 'Work', color: '#10b981' },
    { id: 3, name: 'Reading', color: '#f59e0b' },
  ]);


  const calculateIntervals = () => {
    if (breaks === 0) {
      return {
        workDuration: totalTime,
        breakDuration: 0,
        sessions: [{ type: 'work', duration: totalTime }],
      };
    }


    const maxBreakTime = Math.floor(totalTime * 0.25);
    const breakDuration = Math.max(1, Math.floor(maxBreakTime / breaks));
    
    const totalBreakTime = breaks * breakDuration;
    const totalWorkTime = totalTime - totalBreakTime;
    const workSessionDuration = Math.max(1, Math.floor(totalWorkTime / (breaks + 1)));


    const sessions = [];
    for (let i = 0; i <= breaks; i++) {
      sessions.push({ type: 'work', duration: workSessionDuration });
      if (i < breaks) {
        sessions.push({ type: 'break', duration: breakDuration });
      }
    }

    return {
      workDuration: workSessionDuration,
      breakDuration,
      sessions,
    };
  };

  const handleStartSession = () => {
    if (!selectedActivity) {
      alert('Please select an activity');
      return;
    }

    const intervals = calculateIntervals();

    navigation.navigate('Timer', {
      totalTime,
      breaks,
      activity: activities.find(a => a.id === selectedActivity),
      intervals,
    });
  };

  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins} min`;
  };

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Focus Timer</Text>
        <Text style={styles.subtitle}>Configure your session</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Total Time</Text>
          <Text style={styles.cardValue}>{formatTime(totalTime)}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={15}
          maximumValue={240}
          step={5}
          value={totalTime}
          onValueChange={setTotalTime}
          minimumTrackTintColor="#6366f1"
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor="#6366f1"
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>15 min</Text>
          <Text style={styles.sliderLabel}>240 min</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Number of Breaks</Text>
          <Text style={styles.cardValue}>{breaks}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={8}
          step={1}
          value={breaks}
          onValueChange={setBreaks}
          minimumTrackTintColor="#a855f7"
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor="#a855f7"
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>0</Text>
          <Text style={styles.sliderLabel}>8</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Select Activity</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedActivity}
            onValueChange={(value) => setSelectedActivity(value)}
            style={styles.picker}
          >
            <Picker.Item label="Choose an activity..." value={null} />
            {activities.map((activity) => (
              <Picker.Item
                key={activity.id}
                label={activity.name}
                value={activity.id}
              />
            ))}
          </Picker>
        </View>
        
        {selectedActivity && (
          <View style={styles.selectedActivity}>
            <View
              style={[
                styles.activityColor,
                { backgroundColor: activities.find(a => a.id === selectedActivity)?.color },
              ]}
            />
            <Text style={styles.activityName}>
              {activities.find(a => a.id === selectedActivity)?.name}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Session Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Duration:</Text>
          <Text style={styles.summaryValue}>{formatTime(totalTime)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Work Sessions:</Text>
          <Text style={styles.summaryValue}>{breaks + 1}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Breaks:</Text>
          <Text style={styles.summaryValue}>{breaks}</Text>
        </View>
        {breaks > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Work per session:</Text>
            <Text style={styles.summaryValue}>
              ~{formatTime(Math.max(1, Math.floor((totalTime - Math.floor(totalTime * 0.25)) / (breaks + 1))))}
            </Text>
          </View>
        )}
        {breaks > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Break duration:</Text>
            <Text style={styles.summaryValue}>
              ~{formatTime(Math.max(1, Math.floor(Math.floor(totalTime * 0.25) / breaks)))}
            </Text>
          </View>
        )}
      </View>

      
      <TouchableOpacity
        style={[
          styles.startButton,
          !selectedActivity && styles.startButtonDisabled,
        ]}
        onPress={handleStartSession}
        disabled={!selectedActivity}
      >
        <Text style={styles.startButtonText}>Start Session</Text>
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: '#6366f1',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  pickerContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  picker: {
    height: 50,
  },
  selectedActivity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  activityColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  activityName: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: '#eef2ff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4338ca',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6366f1',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4338ca',
  },
  startButton: {
    backgroundColor: '#6366f1',
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonDisabled: {
    backgroundColor: '#9ca3af',
    shadowColor: '#9ca3af',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  bottomPadding: {
    height: 40,
  },
});

export default SetupScreen;