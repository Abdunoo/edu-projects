import { io } from "socket.io-client";

/**
 * Socket.io client plugin for Nuxt
 * Creates a socket instance that properly handles reconnection
 * and provides it to the application
 */
export default defineNuxtPlugin((_nuxtApp) => {
  const config = useRuntimeConfig();

  // Use configuration for WebSocket URL directly from config
  const wsUrl = config.public.wsUrl || "ws://localhost:3001/dashboard";
  console.log("WebSocket URL from config:", wsUrl);

  // Parse the WebSocket URL to ensure proper format
  // Socket.io expects the HTTP protocol, not the WS protocol
  let socketUrl = wsUrl;
  if (socketUrl.startsWith("ws://")) {
    socketUrl = socketUrl.replace("ws://", "http://");
  } else if (socketUrl.startsWith("wss://")) {
    socketUrl = socketUrl.replace("wss://", "https://");
  }

  console.log("Connecting to socket with URL:", socketUrl);

  // Create socket instance with proper configuration
  const socket = io(socketUrl, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.5,
    timeout: 20000,
    autoConnect: false, // Don't connect automatically, we'll do it manually
    withCredentials: true,
  });

  // Set up logging for connection events
  socket.on("connect", () => {
    console.log("[socket] connected", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("[socket] disconnected", reason);

    // If the server disconnected us, try to reconnect
    if (reason === "io server disconnect") {
      socket.connect();
    }
  });

  socket.on("connect_error", (err) => {
    console.error("[socket] connect_error", err?.message);
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log("[socket] reconnected after", attemptNumber, "attempts");
  });

  socket.on("reconnect_attempt", (attemptNumber) => {
    console.log("[socket] reconnect attempt", attemptNumber);
  });

  socket.on("reconnect_error", (err) => {
    console.error("[socket] reconnect_error", err?.message);
  });

  socket.on("reconnect_failed", () => {
    console.error("[socket] reconnect_failed");
  });

  console.log("[socket] Initial connection status:", socket.connected);

  // Attempt to connect after a short delay to ensure backend is ready
  setTimeout(() => {
    if (!socket.connected) {
      console.log("[socket] Attempting connection after delay");
      socket.connect();
    }
  }, 500);

  // Handle cleanup on module hot reload
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      socket.disconnect();
    });
  }

  // Provide socket to the application
  return {
    provide: {
      socket,
    },
  };
});
