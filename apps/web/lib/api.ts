
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type ApiOptions = Omit<RequestInit, "body"> & {
  token?: string;
  body?: unknown;
};

export async function api<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { token, body, headers: customHeaders, ...rest } = options;

  const headers = new Headers(customHeaders);

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}/api${path}`, {
    ...rest,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const data = await response.json();
      message = data.message
        ? Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message
        : message;
    } catch {
      // Keep the fallback message if the response isn't JSON.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
