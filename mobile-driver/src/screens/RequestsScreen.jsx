import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import { API_BASE_URL } from "../config";

const STATUS_STYLES = {
  pending: { bg: "#451a03", text: "#fed7aa", label: "⏳ Pending" },
  assigned: { bg: "#1e3a5f", text: "#93c5fd", label: "✅ Assigned" },
  completed: { bg: "#052e16", text: "#86efac", label: "🏁 Completed" },
};

export default function RequestsScreen() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Auth
  const handleAuth = async () => {
    setLoading(true);
    try {
      const endpoint = isLogin ? "/login" : "/register";
      const payload = isLogin
        ? { email, password }
        : { name, email, password, role: "driver" };

      const { data } = await axios.post(`${API_BASE_URL}${endpoint}`, payload);

      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Authentication failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
  };

  // Fetch requests
  const fetchRequests = useCallback(async () => {
    if (!token) return;

    try {
      const { data } = await axios.get(`${API_BASE_URL}/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(data.data);
    } catch (e) {
      console.error("Fetch error:", e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchRequests();
      const interval = setInterval(fetchRequests, 5000);
      return () => clearInterval(interval);
    }
  }, [token, fetchRequests]);

  // Accept request
  const handleAccept = async (id) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/requests/${id}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchRequests();
      Alert.alert("Success", "Request accepted!");
    } catch (e) {
      Alert.alert("Error", "Could not accept request");
    }
  };

  // Complete request
  const handleComplete = async (id) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/requests/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchRequests();
      Alert.alert("Success", "Request completed!");
    } catch (e) {
      Alert.alert("Error", "Could not complete request");
    }
  };

  // Auth screen
  if (!token) {
    return (
      <View style={styles.authContainer}>
        <Text style={styles.authTitle}>🚗 Driver Login</Text>

        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#64748b"
            value={name}
            onChangeText={setName}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#64748b"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#64748b"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.authBtn}
          onPress={handleAuth}
          disabled={loading}
        >
          <Text style={styles.authBtnText}>
            {loading ? "Please wait..." : isLogin ? "🔑 Login" : "📝 Register"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.switchText}>
            {isLogin
              ? "Don't have an account? Register"
              : "Already registered? Login"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Request item renderer
  const renderItem = ({ item }) => {
    const s = STATUS_STYLES[item.status] ?? STATUS_STYLES.pending;
    const isAssignedToMe = item.driver_id === user?.id;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => setSelectedRequest(item)}
      >
        <View style={[styles.badge, { backgroundColor: s.bg }]}>
          <Text style={[styles.badgeText, { color: s.text }]}>{s.label}</Text>
        </View>

        <Text style={styles.name}>{item.customer_name}</Text>

        <View style={styles.row}>
          <Text style={styles.icon}>📍</Text>
          <Text style={styles.info}>{item.location}</Text>
        </View>

        {item.note ? (
          <View style={styles.row}>
            <Text style={styles.icon}>📝</Text>
            <Text style={styles.info}>{item.note}</Text>
          </View>
        ) : null}

        {item.status === "pending" && (
          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={() => handleAccept(item.id)}
          >
            <Text style={styles.acceptBtnText}>✅ Accept Request</Text>
          </TouchableOpacity>
        )}

        {item.status === "assigned" && isAssignedToMe && (
          <TouchableOpacity
            style={[styles.acceptBtn, { backgroundColor: "#059669" }]}
            onPress={() => handleComplete(item.id)}
          >
            <Text style={styles.acceptBtnText}>🏁 Mark Complete</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerIcon}>🚗</Text>
          <Text style={styles.headerTitle}>Tareeqk Driver</Text>
          <Text style={styles.headerSub}>
            {user?.name} · {requests.length} requests
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchRequests();
            }}
            tintColor="#f97316"
          />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No requests. Pull to refresh.</Text>
        }
      />

      {/* Map Modal */}
      {selectedRequest && (
        <Modal
          visible={!!selectedRequest}
          animationType="slide"
          onRequestClose={() => setSelectedRequest(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedRequest.customer_name}
              </Text>
              <TouchableOpacity onPress={() => setSelectedRequest(null)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedRequest.latitude && selectedRequest.longitude ? (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: parseFloat(selectedRequest.latitude),
                  longitude: parseFloat(selectedRequest.longitude),
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <>
                  <Marker
                    coordinate={{
                      latitude: parseFloat(selectedRequest.latitude),
                      longitude: parseFloat(selectedRequest.longitude),
                    }}
                    title={selectedRequest.customer_name}
                    description={selectedRequest.location}
                  />
                </>
              </MapView>
            ) : (
              <View style={styles.noMapContainer}>
                <Text style={styles.noMapText}>
                  📍 No GPS coordinates available
                </Text>
                <Text style={styles.noMapSubtext}>
                  {selectedRequest.location}
                </Text>
              </View>
            )}
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  authContainer: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    padding: 24,
  },
  authTitle: {
    color: "#f8fafc",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#1e293b",
    color: "#f1f5f9",
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 15,
  },
  authBtn: {
    backgroundColor: "#f97316",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  authBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  switchText: {
    color: "#60a5fa",
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
  },
  header: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  headerIcon: { fontSize: 32 },
  headerTitle: { color: "#f8fafc", fontSize: 20, fontWeight: "700" },
  headerSub: { color: "#94a3b8", fontSize: 12, marginTop: 2 },
  logoutBtn: {
    backgroundColor: "#334155",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: { color: "#f1f5f9", fontSize: 14, fontWeight: "600" },
  list: { padding: 16, gap: 14 },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#334155",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  badgeText: { fontSize: 12, fontWeight: "600" },
  name: { color: "#f1f5f9", fontSize: 18, fontWeight: "700", marginBottom: 10 },
  row: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
    alignItems: "flex-start",
  },
  icon: { fontSize: 14, marginTop: 2 },
  info: { color: "#94a3b8", fontSize: 14, flex: 1, lineHeight: 20 },
  acceptBtn: {
    marginTop: 14,
    backgroundColor: "#f97316",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  acceptBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  empty: { textAlign: "center", color: "#475569", marginTop: 60, fontSize: 15 },
  modalContainer: { flex: 1, backgroundColor: "#0f172a" },
  modalHeader: {
    backgroundColor: "#1e293b",
    padding: 20,
    paddingTop: 54,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  modalTitle: { color: "#f8fafc", fontSize: 20, fontWeight: "700" },
  closeBtn: { color: "#f97316", fontSize: 28, fontWeight: "700" },
  map: { flex: 1 },
  noMapContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noMapText: {
    color: "#f1f5f9",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  noMapSubtext: { color: "#94a3b8", fontSize: 14, textAlign: "center" },
});
