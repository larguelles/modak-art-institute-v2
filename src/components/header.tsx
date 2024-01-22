import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';

type HeaderProps = {
  title: string;
  colors?: string[];
  renderGoBack: boolean;
};

export const Header: React.FC<HeaderProps> = ({
  title,
  colors = ['#072a24', '#16534b'],
  renderGoBack,
}) => {
  const navigation = useNavigation();
  const titleAdjustment = {right: renderGoBack ? 15 : 0};
  return (
    <LinearGradient
      colors={colors}
      style={layoutStyles.main}
      start={{x: 0, y: 1}}
      end={{x: 1, y: 1}}>
      {renderGoBack && (
        <TouchableOpacity
          style={layoutStyles.iconContainer}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" color="white" size={20} />
        </TouchableOpacity>
      )}
      <Text style={[textStyles.title, titleAdjustment]}>{title}</Text>
    </LinearGradient>
  );
};

export default Header;

const layoutStyles = StyleSheet.create({
  main: {
    height: 120,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    backgroundColor: 'black',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    marginTop: 40,
  },
});
const textStyles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 40,
    textAlign: 'center',
    width: 280,
  },
});
