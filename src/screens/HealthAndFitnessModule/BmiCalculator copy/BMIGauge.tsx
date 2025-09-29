import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import Svg, {Path, G, Line, Text as SvgText, Circle} from 'react-native-svg';

const BMIGauge = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBMI = () => {
    if (weight && height) {
      const heightInMeters = parseFloat(height) / 100;
      const bmiValue = parseFloat(weight) / (heightInMeters * heightInMeters);
      setBmi(bmiValue);
    }
  };

  // Convert BMI to angle for the pointer
  const bmiToAngle = (bmi: number | null) => {
    if (!bmi) return -90; // Default position (no BMI)
    if (bmi < 18.5) return -60; // Underweight range
    if (bmi < 24.9) return -30; // Normal weight range
    if (bmi < 29.9) return 0; // Overweight range
    if (bmi < 34.9) return 30; // Obese I range
    if (bmi < 39.9) return 60; // Obese II range
    return 90; // Obese III range
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Weight (kg):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <Text style={styles.label}>Enter Height (cm):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />

      <Button title="Calculate BMI" onPress={calculateBMI} />

      <View style={styles.svgContainer}>
        <Svg height="270" width="330" viewBox="0 0 200 150">
          <G transform="translate(100,100)">
            {/* Background circle */}
            <Circle cx="0" cy="0" r="16" fill="#d87e7e" />

            {/* Adjusted arcs for each BMI range */}
            {/* Underweight (blue) */}
            <Path
              d="M -88.10 12 A 90 90 0 0 1 -78.50 -44.94"
              fill="none"
              stroke="blue"
              strokeWidth="20"
            />
            {/* Normal weight (green) */}
            <Path
              d="M -80 -42.60 A 90 90 0 0 1 -44.60 -78.94"
              fill="none"
              stroke="green"
              strokeWidth="20"
            />
            {/* Overweight (light blue) */}
            <Path
              d="M -45 -78.94 A 90 90 0 0 1 7 -90"
              fill="none"
              stroke="lightblue"
              strokeWidth="20"
            />
            {/* Obese I (yellow) */}
            <Path
              d="M 6 -90 A 90 90 0 0 1 55 -74"
              fill="none"
              stroke="yellow"
              strokeWidth="20"
            />
            {/* Obese II (orange) */}
            <Path
              d="M 55 -73.90 A 90 90 0 0 1 84 -33.94"
              fill="none"
              stroke="orange"
              strokeWidth="20"
            />
            {/* Obese III (red) */}
            <Path
              d="M 83 -35.94 A 90 90 0 0 1 89 8"
              fill="none"
              stroke="red"
              strokeWidth="20"
            />
          </G>

          {/* Rotating pointer based on BMI */}

          <Line
            x1="100"
            y1="100"
            x2="100"
            y2="30"
            stroke="black"
            strokeWidth="3"
            transform={`rotate(${bmiToAngle(bmi)}, 100, 100)`}
          />

          {/* Labels for BMI categories */}
          <SvgText x="30" y="80" fill="black" fontSize="10" textAnchor="middle">
            Underweight
          </SvgText>
          <SvgText x="60" y="50" fill="black" fontSize="10" textAnchor="middle">
            Normal
          </SvgText>
          <SvgText
            x="100"
            y="30"
            fill="black"
            fontSize="10"
            textAnchor="middle">
            Overweight
          </SvgText>
          <SvgText
            x="135"
            y="50"
            fill="black"
            fontSize="10"
            textAnchor="middle">
            Obese I
          </SvgText>
          <SvgText
            x="160"
            y="80"
            fill="black"
            fontSize="10"
            textAnchor="middle">
            Obese II
          </SvgText>
          <SvgText
            x="180"
            y="110"
            fill="black"
            fontSize="10"
            textAnchor="middle">
            Obese III
          </SvgText>
        </Svg>
      </View>

      {bmi && <Text style={styles.resultText}>Your BMI: {bmi.toFixed(2)}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: 200,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
  },
  svgContainer: {
    marginTop: 20,
  },
  resultText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BMIGauge;
