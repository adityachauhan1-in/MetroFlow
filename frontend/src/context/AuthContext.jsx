// AuthContext is the memory of authentication for the frontend
import React from "react";
import { createContext,useContext,useState,useEffect,useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

const AuthContext = createContext(null);
// Provider  
export const AuthProvider = ({children}) => {
    const [user , setUser ] = useState(null);
    const [token , setToken ] = useState(null);
    const [loading , setLoading ] = useState(true);// becasue keep loading until i check

    // Helper function to check if token is valid (not expired)
    const isTokenValid = useCallback((tokenToCheck) => {
        if (!tokenToCheck) return false;
        try {
            const decoded = jwtDecode(tokenToCheck);
            const currentTime = Date.now() / 1000; // Convert to seconds
            // Check if token has expired
            if (decoded.exp && decoded.exp < currentTime) {
                return false; // Token expired
            }
            return true; // Token is valid
        } catch (error) {
            return false; // Invalid token
        }
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && isTokenValid(storedToken)) {
            try {
                const decoded = jwtDecode(storedToken);
                const parsedUser = storedUser ? JSON.parse(storedUser) : null;
                const user = {
                    id: decoded.id,
                    role: decoded.role,
                    name: decoded.name ?? parsedUser?.name ?? (decoded.role === "admin" ? "Admin" : "User"),
                    email: parsedUser?.email ?? null,
                };
                setToken(storedToken);
                setUser(user);
                localStorage.setItem("user", JSON.stringify(user));
            } catch (error) {
                // Invalid token or JSON, clear it
                console.error("Error decoding token or parsing user data:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        } else {
            // Token expired or invalid, clear everything
            if (storedToken) {
                localStorage.removeItem("token");
            }
            if (storedUser) {
                localStorage.removeItem("user");
            }
            setToken(null);
            setUser(null);
        }
        setLoading(false);
    }, [])

    // ===> LOGIN <====
    const login = async (email, password) => {
        try {
            const res = await api.post("/user/login", {
                email,
                password
            });
            
            const { token, user: resUser } = res.data;

            if (!token) {
                throw new Error("No token received from server");
            }

            const decoded = jwtDecode(token);
            const user = {
                id: decoded.id,
                role: decoded.role,
                name: resUser?.name ?? decoded.name ?? (decoded.role === "admin" ? "Admin" : "User"),
                email: resUser?.email ?? null,
            };

            setToken(token);
            setUser(user);
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            return { success: true, user };
        } catch (error) {
            console.error("Login failed:", error);
            return { success: false, error: error.response?.data?.message || "Login failed" };
        }
    }

    //  ==== LOGOUT === =
    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }, []);
    // now share 
    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token && isTokenValid(token),
        login,
        logout,
        isTokenValid,
      };
      // avoid the flicker 
      if(loading){
        return null;
      }
      return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
      )
}

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}