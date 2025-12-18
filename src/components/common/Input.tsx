import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { SPACING, BORDER_RADIUS } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureTextEntry?: boolean;
  containerStyle?: ViewStyle;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  secureTextEntry,
  containerStyle,
  style,
  ...props
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const containerStyles: ViewStyle = {
    marginBottom: SPACING.md,
  };

  const inputContainerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: error
      ? colors.error
      : isFocused
      ? colors.primary
      : 'transparent',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  };

  const inputStyles: TextStyle = {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: SPACING.sm,
  };

  const labelStyles: TextStyle = {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: SPACING.xs,
  };

  const errorStyles: TextStyle = {
    fontSize: 12,
    color: colors.error,
    marginTop: SPACING.xs,
  };

  return (
    <View style={[containerStyles, containerStyle]}>
      {label && <Text style={labelStyles}>{label}</Text>}
      
      <View style={inputContainerStyles}>
        {leftIcon && <View style={{ marginRight: SPACING.sm }}>{leftIcon}</View>}
        
        <TextInput
          style={[inputStyles, style]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isSecure}
          placeholderTextColor={colors.textTertiary}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsSecure(!isSecure)}
            style={{ marginLeft: SPACING.sm }}
          >
            <Ionicons
              name={isSecure ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <View style={{ marginLeft: SPACING.sm }}>{rightIcon}</View>
        )}
      </View>
      
      {error && <Text style={errorStyles}>{error}</Text>}
    </View>
  );
};

export default Input;
