import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';

export default function GradientProgressRing({ percentage = 0 }) {
  const radius = 50;
  const strokeWidth = 15;
  const cx = 60;
  const cy = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressCircle}>
        <Svg width={120} height={120}>
          <Defs>
            <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="rgba(24, 20, 70, 1)" />
              <Stop offset="1" stopColor="rgba(131, 196, 231, 1)" />
            </SvgLinearGradient>
          </Defs>

          {/* Background circle */}
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke="white"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Gradient progress ring */}
          {percentage > 0 && (
            <Circle
              cx={cx}
              cy={cy}
              r={radius}
              stroke="url(#grad)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              rotation="90"
              origin={`${cx}, ${cy}`}
            />
          )}
        </Svg>

        {/* Inner white circle and percentage */}
        <View style={styles.progressCenter}>
          <Text style={styles.progressText}>{percentage}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    alignItems: 'flex-end',
  },

  progressCircle: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 60,
    padding: 6,
  },
  progressCenter: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#141b41',
    fontWeight: '800',
  },
});
