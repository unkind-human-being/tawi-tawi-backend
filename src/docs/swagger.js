const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Tawi-Tawi Backend API",
    version: "1.0.0",
    description:
      "API documentation for the Tawi-Tawi backend public user authentication system using Express.js and Neo4j Aura.",
  },
  servers: [
    {
      url: "http://localhost:1738",
      description: "Local development server",
    },
  ],
  tags: [
    {
      name: "Health",
      description: "API health check",
    },
    {
      name: "Auth",
      description: "Public user authentication",
    },
    {
      name: "Users",
      description: "Authenticated public user profile",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "68984e3b-5957-4863-af1a-15e75133c7ea",
          },
          fullName: {
            type: "string",
            example: "Lhuts pogi",
          },
          email: {
            type: "string",
            example: "lhutspogi@example.com",
          },
          status: {
            type: "string",
            example: "active",
          },
          createdAt: {
            type: "string",
            example: "2026-05-19T21:17:26.176Z",
          },
          updatedAt: {
            type: "string",
            example: "2026-05-19T21:17:26.176Z",
          },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: "Login successful.",
          },
          data: {
            type: "object",
            properties: {
              token: {
                type: "string",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              },
              user: {
                $ref: "#/components/schemas/User",
              },
            },
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          message: {
            type: "string",
            example: "Invalid email or password.",
          },
        },
      },
    },
  },
  paths: {
    "/v1/health": {
      get: {
        tags: ["Health"],
        summary: "Check API health",
        responses: {
          200: {
            description: "API is running",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Tawi-Tawi API v1 is running.",
                  version: "v1",
                  timestamp: "2026-05-19T21:17:26.176Z",
                },
              },
            },
          },
        },
      },
    },

    "/v1/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register public user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["fullName", "email", "password"],
                properties: {
                  fullName: {
                    type: "string",
                    example: "Lhuts pogi",
                  },
                  email: {
                    type: "string",
                    example: "lhutspogi@example.com",
                  },
                  password: {
                    type: "string",
                    example: "lhutspogi",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Public user registered successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthResponse",
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          409: {
            description: "Email already registered",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },

    "/v1/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login public user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    example: "lhutspogi@example.com",
                  },
                  password: {
                    type: "string",
                    example: "lhutspogi",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthResponse",
                },
              },
            },
          },
          401: {
            description: "Invalid email or password",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },

    "/v1/auth/google": {
      post: {
        tags: ["Auth"],
        summary: "Login or register using Google",
        description:
          "Flutter sends the Google ID token to this endpoint. Backend verifies the token, creates or finds the user, then returns the app JWT.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["idToken"],
                properties: {
                  idToken: {
                    type: "string",
                    example: "GOOGLE_ID_TOKEN_FROM_FLUTTER",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Google login successful",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthResponse",
                },
              },
            },
          },
          400: {
            description: "Google ID token is required",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Invalid Google token",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },

    "/v1/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout public user",
        responses: {
          200: {
            description: "Logout successful",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Logout successful.",
                  data: null,
                },
              },
            },
          },
        },
      },
    },

    "/v1/users/me": {
      get: {
        tags: ["Users"],
        summary: "Get current user profile",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "User profile fetched successfully",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "User profile fetched successfully.",
                  data: {
                    user: {
                      id: "68984e3b-5957-4863-af1a-15e75133c7ea",
                      fullName: "Lhuts pogi",
                      email: "lhutspogi@example.com",
                      status: "active",
                      createdAt: "2026-05-19T21:17:26.176Z",
                      updatedAt: "2026-05-19T21:17:26.176Z",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Authentication token is missing or invalid",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },

      patch: {
        tags: ["Users"],
        summary: "Update current user profile",
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["fullName"],
                properties: {
                  fullName: {
                    type: "string",
                    example: "Lhuts Updated",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "User profile updated successfully",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "User profile updated successfully.",
                  data: {
                    user: {
                      id: "68984e3b-5957-4863-af1a-15e75133c7ea",
                      fullName: "Lhuts Updated",
                      email: "lhutspogi@example.com",
                      status: "active",
                      createdAt: "2026-05-19T21:17:26.176Z",
                      updatedAt: "2026-05-19T21:30:00.000Z",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Authentication token is missing or invalid",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = swaggerDocument;