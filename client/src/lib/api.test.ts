import { expect, describe, it, vi, beforeEach } from "vitest";
import { api } from "./api";

const mockFetch = vi.fn();

describe("api", () => {
   beforeEach(() => {
      vi.clearAllMocks();
      vi.stubGlobal("fetch", mockFetch);
   });

   it("calls the API with JSON data and returns the parsed response", async () => {
      const payload = {
         email: "user@example.com",
         password: "password123",
      };

      const response = {
         ok: true,
         json: vi.fn().mockResolvedValue({ user: payload }),
      };

      mockFetch.mockResolvedValue(response);

      const result = await api("/users/register", "POST", payload);

      expect(mockFetch).toHaveBeenCalledWith(
         "http://localhost:5000/api/users/register",
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            credentials: "include",
         }
      );

      expect(result).toEqual({ user: payload });
   });

   it("sends FormData without JSON headers or stringifying", async () => {
      const formData = new FormData();
      formData.append(
         "file",
         new File(["content"], "test.txt", { type: "text/plain" })
      );

      const response = {
         ok: true,
         json: vi.fn().mockResolvedValue({ success: true }),
      };

      mockFetch.mockResolvedValue(response);

      const result = await api("/upload", "POST", formData);

      expect(mockFetch).toHaveBeenCalledWith(
         "http://localhost:5000/api/upload",
         {
            method: "POST",
            headers: {},
            body: formData,
            credentials: "include",
         }
      );

      expect(result).toEqual({ success: true });
   });

   it("makes a request without a body when no body is provided", async () => {
      const response = {
         ok: true,
         json: vi.fn().mockResolvedValue({ success: true }),
      };

      mockFetch.mockResolvedValue(response);

      const result = await api("/sessions", "GET");

      expect(mockFetch).toHaveBeenCalledWith(
         "http://localhost:5000/api/sessions",
         {
            method: "GET",
            headers: {},
            body: undefined,
            credentials: "include",
         }
      );

      expect(result).toEqual({ success: true });
   });

   it("includes custom headers in the request", async () => {
      const response = {
         ok: true,
         json: vi.fn().mockResolvedValue({ success: true }),
      };

      mockFetch.mockResolvedValue(response);

      await api(
         "/users",
         "GET",
         undefined,
         { Authorization: "Bearer token" }
      );

      expect(mockFetch).toHaveBeenCalledWith(
         "http://localhost:5000/api/users",
         {
            method: "GET",
            headers: {
               Authorization: "Bearer token",
            },
            body: undefined,
            credentials: "include",
         }
      );
   });

   it("throws a formatted error when the request fails", async () => {
      const payload = {
         email: "user@example.com",
         password: "password123",
      };
      
      const response = {
         ok: false,
         status: 500,
         statusText: "Internal Server Error",
         text: vi.fn().mockResolvedValue("Something went wrong"),
      };

      mockFetch.mockResolvedValue(response);

      await expect(
         api("/users/login", "POST", payload)
      ).rejects.toThrow(
         "API request failed: 500 Internal Server Error - Something went wrong"
      );
   });
});