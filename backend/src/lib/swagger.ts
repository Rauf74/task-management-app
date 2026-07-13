// ==============================================
// Swagger Configuration
// ==============================================
//
// Konfigurasi Swagger untuk dokumentasi API.
// Akses di: http://localhost:4000/api/docs
//
// ==============================================

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Task Management API",
            version: "1.0.0",
            description: "RESTful API untuk Task Management App dengan fitur autentikasi JWT dan real-time collaboration",
            contact: {
                name: "Developer",
                email: "developer@example.com",
            },
        },
        servers: [
            {
                url: process.env.NODE_ENV === "production"
                    ? "https://task-scale-backend.onrender.com"
                    : "http://localhost:4000",
                description: process.env.NODE_ENV === "production" ? "Production server" : "Development server",
            },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "token",
                    description: "JWT token stored in HttpOnly cookie",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "cmjf337d60000e8aj1ao7eexy" },
                        name: { type: "string", example: "Test User" },
                        email: { type: "string", example: "test@email.com" },
                        image: { type: "string", nullable: true },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                ApiResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean" },
                        data: { type: "object" },
                        message: { type: "string" },
                        error: { type: "string" },
                    },
                },
                RegisterRequest: {
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                        name: { type: "string", minLength: 2, maxLength: 100, example: "Test User" },
                        email: { type: "string", format: "email", example: "test@email.com" },
                        password: { type: "string", minLength: 6, maxLength: 100, example: "password123" },
                    },
                },
                LoginRequest: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", format: "email", example: "test@email.com" },
                        password: { type: "string", example: "password123" },
                    },
                },
            },
        },
        tags: [
            { name: "Auth", description: "Authentication & Profile management" },
            { name: "Workspace", description: "Workspace management" },
            { name: "Board", description: "Kanban board management" },
            { name: "Column", description: "Column sorting & management inside boards" },
            { name: "Task", description: "Task creation, moving, & detail management" },
            { name: "Label", description: "Label categorization & tagging" },
            { name: "Health", description: "Server health status checks" },
        ],
    },
    // Di production hanya ada dist/ (compiled JS), di development ada src/ (TypeScript)
    // swagger-jsdoc tetap dapat membaca JSDoc comment dari compiled JS output
    apis: [
        "./src/routes/*.ts",
        "./src/app.ts",
        "./dist/routes/*.js",
        "./dist/app.js",
    ],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
    // Swagger UI
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "Task Management API Docs",
    }));

    // Swagger JSON (untuk import ke Postman, dll)
    app.get("/api/docs.json", (_req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
}
