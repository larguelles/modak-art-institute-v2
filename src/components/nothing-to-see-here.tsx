import React, {useEffect, useRef} from 'react';
import {View, Animated, Easing, TextStyle} from 'react-native';
import useArtworkStore from '../api/store';

const NothingToSeeHere = ({id}: {id: string}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const {easterEggsFound} = useArtworkStore();

  console.log('length after adding ', easterEggsFound.length);

  let title;
  const missing = 3 - easterEggsFound.length;
  if (easterEggsFound.length === 3) {
    title = 'Woohoo! You found us all!';
  } else if (easterEggsFound.length === 1) {
    title = "You've found your first easter egg! Where can the rest be?";
  } else {
    if (id === 'favs') {
      title = `That's the Favorites one! Only ${missing} to go!`;
    } else if (id === 'home') {
      title = `Way to go! Only ${missing} left!`;
    } else {
      title = `There's the Details one! Find the remaining ${missing}!`;
    }
  }

  const steps = 7;

  const inputRange = Array.from(
    {length: steps},
    (_, index) => index / (steps - 1),
  );

  const interpolatedColor = animatedValue.interpolate({
    inputRange,
    outputRange: [
      '#FF0000',
      '#FF7F00',
      '#FFFF00',
      '#00FF00',
      '#0000FF',
      '#4B0082',
      '#9400D3',
    ],
  });

  const rotate = animatedValue.interpolate({
    inputRange,
    outputRange: ['0deg', '4deg', '-4deg', '8deg', '-8deg', '12deg', '0deg'],
  });

  const fontSize = animatedValue.interpolate({
    inputRange,
    outputRange: [16, 17, 18, 17, 16, 15, 14],
  });

  const animatedTextStyle: Animated.WithAnimatedObject<TextStyle> = {
    fontSize,
    fontWeight: 'bold',
    textAlign: 'center',
    color: interpolatedColor,
    transform: [{rotate}],
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: false,
          easing: Easing.linear,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, [animatedValue]);

  return (
    <View>
      <Animated.Text style={animatedTextStyle}>{title}</Animated.Text>
    </View>
  );
};

export default NothingToSeeHere;
