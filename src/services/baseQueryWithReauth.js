import baseQuery from "./baseQuery";
import { logOut } from "@/feature/User/userSlice";

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  // access token hết hạn
  if (result.error && result.error?.status === 401) {
    console.log("refresh token");
    const refresh_token = localStorage.getItem("refresh_token");
    if (!refresh_token) {
      console.log("NO REFRESH TOKEN");
      localStorage.clear();
      return result;
    }
    // gọi refresh token
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
        body: { refresh_token },
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      localStorage.setItem("access_token", refreshResult.data.access_token);

      // retry request cũ
      result = await baseQuery(args, api, extraOptions);
    } else {
      // refresh fail → logout
      api.dispatch(logOut());
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }

  return result;
};

export default baseQueryWithReauth;
