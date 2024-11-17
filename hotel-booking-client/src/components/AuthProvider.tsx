import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { axiosInstance } from "../api/axios";
import { getUserToken, login, logout, register } from "../api/auth/authApi";
import { LoginUser, RegisterUser, User } from "../modules/types";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

type AuthContext = {
  token?: string | null;
  currentUser?: User | null;
  handleRegister: (registerUser: RegisterUser) => Promise<void | string>;
  handleLogin: (loginUser: LoginUser) => Promise<void | string>;
  handleLogout: () => Promise<void>;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

type AuthProviderProps = PropsWithChildren;

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>();
  const [currentUser, setCurrentUser] = useState<User | null>();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);

  async function handleRegister({ userName, email, password }: RegisterUser) {
    const response = await register(userName, email, password);
    if (response === "Username already taken") {
      return response;
    }
    if (response) {
      navigate("/login");
      toast.success("Registration Successful");
    }
  }

  async function handleLogin({ userName, password }: LoginUser) {
    try {
      const response = await login(userName, password);
      if (response === "Username or password was incorrect") {
        setToken(null);
        setCurrentUser(null);
        return response;
      }
      const { accessToken } = response;
      setToken(accessToken);
      const decodedToken = jwtDecode(accessToken);
      setCurrentUser({
        userId: decodedToken.sub!,
        userName: userName,
        groups:
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ],
      });
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;
      navigate("/");
      toast.success("Log In Successful");
    } catch {
      setToken(null);
      setCurrentUser(null);
    }
  }

  async function handleLogout() {
    logout();
    setToken(null);
    setCurrentUser(null);
    navigate("/");
    toast.success("Log Out Successful");
  }

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await getUserToken();
        const { accessToken } = response;
        setToken(accessToken);
        const decodedToken = jwtDecode(accessToken);
        setCurrentUser({
          userId: decodedToken.sub!,
          userName:
            decodedToken[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
            ],
          groups:
            decodedToken[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ],
        });
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
      } catch {
        setToken(null);
        setCurrentUser(null);
      }
    };
    getToken();
  }, []);

  useLayoutEffect(() => {
    const refreshInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          (error.response.status === 401 || error.response.status === 403) &&
          !refresh
        ) {
          try {
            const response = await getUserToken();
            setToken(response.data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setRefresh(true);
            return axiosInstance(originalRequest);
          } catch {
            setToken(null);
            setCurrentUser(null);
          }
        }
        setRefresh(false);
        return Promise.reject(error);
      }
    );
    return () => {
      axiosInstance.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, currentUser, handleRegister, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return authContext;
};
