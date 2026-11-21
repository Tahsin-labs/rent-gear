export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers = {}, ...customConfig } = options;

  let token: string | undefined;
  if (typeof window !== "undefined") {
    // Read from cookies
    const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
    if (match) {
      token = match[2];
    }
  }

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  let url = `${baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const config: RequestInit = {
    ...customConfig,
    headers: defaultHeaders,
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      if (!window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/register")) {
        window.location.href = "/login";
      }
    }
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    let fieldErrors: Record<string, string[]> | undefined;
    if (Array.isArray(data?.errorDetails)) {
      fieldErrors = {};
      data.errorDetails.forEach((issue: { path?: (string | number)[]; message?: string }) => {
        const field = issue.path?.[0]?.toString() || "general";
        if (!fieldErrors![field]) fieldErrors![field] = [];
        if (issue.message) fieldErrors![field].push(issue.message);
      });
    }

    throw new ApiError(
      response.status,
      data?.message || `Request failed with status ${response.status}`,
      fieldErrors
    );
  }

  return data as T;
}
