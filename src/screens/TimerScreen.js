import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const TimerScreen = ({ navigation, route }) => {

  const { totalTime, breaks, activity, intervals } = route.params || {};
  
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);

  const sessions = intervals?.sessions || [{ type: 'work', duration: 25 }];
  const currentSession = sessions[currentSessionIndex];

  const [timeRemaining, setTimeRemaining] = useState(currentSession.duration * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  const timerRef = useRef(null);

  const totalDuration = currentSession.duration * 60;

  const progress = timeRemaining / totalDuration;

  const size = 280;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSessionComplete = () => {
    Vibration.vibrate([0, 500, 200, 500]);
    setIsRunning(true);
    
    if (currentSessionIndex < sessions.length - 1) {
      const nextIndex = currentSessionIndex + 1;
      const nextSession = sessions[nextIndex];
      setCurrentSessionIndex(nextIndex);
      setTimeRemaining(nextSession.duration * 60);
    } else {
      setIsCompleted(true);
    }
  };

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, currentSessionIndex]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimeRemaining(currentSession.duration * 60);
  };

  const handleResetAll = () => {
    setIsRunning(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setCurrentSessionIndex(0);
    setTimeRemaining(sessions[0].duration * 60);
    setIsCompleted(false);
  };

  const handleSkip = () => {
    if (currentSessionIndex < sessions.length - 1) {
      setIsRunning(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      const nextIndex = currentSessionIndex + 1;
      setCurrentSessionIndex(nextIndex);
      setTimeRemaining(sessions[nextIndex].duration * 60);
    }
  };

  const isBreak = currentSession.type === 'break';
  const primaryColor = isBreak ? '#10b981' : '#6366f1';

  if (isCompleted) {
    return (
      <View style={[styles.container, { backgroundColor: '#10b981' }]}>
        <View style={styles.completedContainer}>
          <Text style={styles.completedEmoji}>🎉</Text>
          <Text style={styles.completedTitle}>Session Complete!</Text>
          <Text style={styles.completedSubtitle}>
            Great job! You focused for {totalTime} minutes.
          </Text>
          
          <TouchableOpacity
            style={styles.completedButton}
            onPress={handleResetAll}
          >
            <Text style={styles.completedButtonText}>Start Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.backButtonCompleted}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonTextCompleted}>← Back to Setup</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: primaryColor }]}>

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.activityBadge}>
          <View style={[styles.activityDot, { backgroundColor: activity?.color || '#fff' }]} />
          <Text style={styles.activityName}>{activity?.name || 'Focus'}</Text>
        </View>
      </View>

      <View style={styles.sessionIndicator}>
        <Text style={styles.sessionType}>
          {isBreak ? '☕ Break Time' : '💪 Work Time'}
        </Text>
        <Text style={styles.sessionCount}>
          Session {Math.ceil((currentSessionIndex + 1) / 2)} of {Math.ceil(sessions.length / 2)}
        </Text>
      </View>

      <View style={styles.timerContainer}>
        <View style={styles.progressCircleContainer}>
          <Svg width={size} height={size}>
           <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#ffffff"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>
          
          <View style={styles.timerDisplay}>
            <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
            <Text style={styles.timerLabel}>
              {isBreak ? 'Break remaining' : 'Focus remaining'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.progressText}>
          {Math.round(progress * 100)}% remaining
        </Text>
      </View>

      <View style={styles.dotsContainer}>
        {sessions.map((session, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index <= currentSessionIndex 
                  ? '#ffffff' 
                  : 'rgba(255,255,255,0.3)',
                width: index === currentSessionIndex ? 14 : 10,
                height: index === currentSessionIndex ? 14 : 10,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.secondaryButton]}
          onPress={handleReset}
        >
          <Text style={styles.controlButtonText}>↺</Text>
          <Text style={styles.controlLabel}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.primaryButton]}
          onPress={isRunning ? handlePause : handleStart}
        >
          <Text style={[styles.playPauseText, { color: primaryColor }]}>
            {isRunning ? '⏸' : '▶'}
          </Text>
          <Text style={[styles.controlLabelPrimary, { color: primaryColor }]}>
            {isRunning ? 'Pause' : 'Start'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton, 
            styles.secondaryButton,
            currentSessionIndex >= sessions.length - 1 && styles.disabledButton,
          ]}
          onPress={handleSkip}
          disabled={currentSessionIndex >= sessions.length - 1}
        >
          <Text style={styles.controlButtonText}>⏭</Text>
          <Text style={styles.controlLabel}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomInfo}>
        <Text style={styles.infoText}>
          Total: {totalTime} min • {breaks} break{breaks !== 1 ? 's' : ''}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  activityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  activityName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  sessionIndicator: {
    alignItems: 'center',
    marginTop: 20,
  },
  sessionType: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  sessionCount: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerDisplay: {
    position: 'absolute',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
  },
  timerLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 30,
  },
  dot: {
    borderRadius: 7,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  primaryButton: {
    width: 100,
    height: 100,
    backgroundColor: '#ffffff',
  },
  secondaryButton: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  disabledButton: {
    opacity: 0.4,
  },
  playPauseText: {
    fontSize: 32,
  },
  controlButtonText: {
    fontSize: 24,
    color: '#ffffff',
  },
  controlLabel: {
    fontSize: 11,
    color: '#ffffff',
    marginTop: 2,
  },
  controlLabelPrimary: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  bottomInfo: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  // Completed screen styles
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  completedEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  completedTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  completedSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 40,
  },
  completedButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    marginBottom: 20,
  },
  completedButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
  backButtonCompleted: {
    padding: 10,
  },
  backButtonTextCompleted: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
});

export default TimerScreen;