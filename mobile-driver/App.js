import { StatusBar } from 'expo-status-bar';
import RequestsScreen from './src/screens/RequestsScreen';

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <RequestsScreen />
    </>
  );
}