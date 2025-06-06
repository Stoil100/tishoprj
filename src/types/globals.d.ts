export {};

export type Roles = "user" | "choreographer" | "admin";

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            role?: Roles;
        };
    }
}
