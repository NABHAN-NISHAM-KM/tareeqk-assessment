import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "./config";
import LocationPicker from "./components/LocationPicker";
import { LogOut } from "lucide-react";

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const [requestForm, setRequestForm] = useState({
    customer_name: "",
    location: "",
    latitude: null,
    longitude: null,
    note: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = isLogin ? "/login" : "/register";
      const { data } = await axios.post(`${API_BASE_URL}${endpoint}`, authForm);

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);

      setRequestForm((prev) => ({
        ...prev,
        customer_name: data.user.name,
      }));
    } catch (error) {
      setError(error.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const { data } = await axios.get(`${API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data.user);

        setRequestForm((prev) => ({
          ...prev,
          customer_name: data.user.name,
        }));
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setToken(null);
        localStorage.removeItem("token");
      }
    };

    fetchUser();
  }, [token]);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  const handleLocationSelect = ({ address, latitude, longitude }) => {
    setRequestForm({
      ...requestForm,
      location: address,
      latitude,
      longitude,
    });
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.post(`${API_BASE_URL}/requests`, requestForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess(true);
      setRequestForm({
        customer_name: user?.name || "",
        location: "",
        latitude: null,
        longitude: null,
        note: "",
      });
    } catch {
      setError("Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (success || error) {
    const timer = setTimeout(() => {
      setSuccess(false);
      setError(null);
    }, 5000); // 5000ms = 5 seconds

    return () => clearTimeout(timer); // cleanup if component unmounts or value changes
  }
}, [success, error]);

  /* ===================== AUTH SCREEN ===================== */
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-900 p-5 font-sans">
        <div className="max-w-xl mx-auto mt-10 bg-slate-800 rounded-2xl p-10 shadow-[0_25px_50px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-8">
            <div className="text-5xl">🚗</div>
            <h1 className="text-2xl font-extrabold text-slate-50 mt-2">
              Tareeqk
            </h1>
            <p className="text-slate-400">
              {isLogin ? "Login to Continue" : "Create Account"}
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-600 bg-red-950 p-4 text-red-300">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleAuthSubmit}>
            {!isLogin && (
              <input
                className="input"
                placeholder="Full Name"
                required
                onChange={(e) =>
                  setAuthForm({ ...authForm, name: e.target.value })
                }
              />
            )}

            <input
              className="input"
              type="email"
              placeholder="Email"
              required
              onChange={(e) =>
                setAuthForm({ ...authForm, email: e.target.value })
              }
            />

            <input
              className="input"
              type="password"
              placeholder="Password"
              required
              onChange={(e) =>
                setAuthForm({ ...authForm, password: e.target.value })
              }
            />

            <button
              disabled={loading}
              className="w-full rounded-xl py-3 font-bold text-white
              bg-linear-to-br from-orange-500 to-red-500
              disabled:opacity-60"
            >
              {loading
                ? "⏳ Please wait..."
                : isLogin
                  ? "🔑 Login"
                  : "📝 Register"}
            </button>
          </form>

          <div className="text-center mt-5">
            <button
              className="text-sm text-blue-400 hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ===================== REQUEST SCREEN ===================== */
  return (
    <div className="min-h-screen bg-slate-900 p-5">
      <div className="max-w-xl mx-auto mt-10 bg-slate-800 rounded-2xl p-10 shadow-[0_25px_50px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="text-5xl">🚗</div>
            <h1 className="text-xl font-extrabold text-slate-50 mt-2">
              Request Towing
            </h1>
            <p className="text-slate-400">Welcome, {user?.name}</p>
          </div>

          {/* LOGOUT ICON */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>

        {success && (
          <div className="mb-5 rounded-xl border border-emerald-600 bg-emerald-950 p-4 text-emerald-300">
            ✅ Request submitted! A driver will reach you shortly.
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-600 bg-red-950 p-4 text-red-300">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleRequestSubmit}>
          <label className="block text-sm text-slate-300 mb-2">
            📍 Pick Location on Map
          </label>

          <LocationPicker onLocationSelect={handleLocationSelect} />

          <input
            className="input mt-4"
            placeholder="Location (auto-filled from map)"
            value={requestForm.location}
            required
            onChange={(e) =>
              setRequestForm({ ...requestForm, location: e.target.value })
            }
          />

          <textarea
            className="input resize-y"
            rows={3}
            placeholder="Describe your issue..."
            value={requestForm.note}
            onChange={(e) =>
              setRequestForm({ ...requestForm, note: e.target.value })
            }
          />

          <button
            disabled={loading}
            className="w-full rounded-xl py-3 font-bold text-white
            bg-linear-to-br from-orange-500 to-red-500
            disabled:opacity-60"
          >
            {loading ? "⏳ Submitting..." : "🚨 Request Towing Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
