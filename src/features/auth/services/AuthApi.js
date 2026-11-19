import { mockAuth } from "../../../data/mockStore";

const AuthApi = {
  // Static/local login against local JSON store
  login: (credentials) => mockAuth.login(credentials),

  // Static/local logout
  logout: () => mockAuth.logout(),
};

export default AuthApi;
