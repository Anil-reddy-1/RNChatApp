import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/components/login';
import { Colors, FontSize, FontWeight } from '@/constants/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabIconProps {
  name: IoniconName;
  activeName: IoniconName;
  focused: boolean;
  color: string;
  size: number;
}

const TabIcon: React.FC<TabIconProps> = ({ name, activeName, focused, color, size }) => (
  <Ionicons name={focused ? activeName : name} size={size} color={color} />
);

const Layout = () => {
  const Auth = useAuth();

  if (Auth?.isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  if (!Auth?.isAuthenticated) {
    return <Login />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chats',
          tabBarIcon: (props) => (
            <TabIcon
              name="chatbubble-ellipses-outline"
              activeName="chatbubble-ellipses"
              focused={props.focused}
              color={props.color}
              size={22}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: (props) => (
            <TabIcon
              name="person-outline"
              activeName="person"
              focused={props.focused}
              color={props.color}
              size={22}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgPrimary,
  },
  tabBar: {
    backgroundColor: Colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 6,
    paddingBottom: 4,
    height: 60,
  },
  tabLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    marginBottom: 2,
  },
  tabItem: {
    paddingTop: 4,
  },
});