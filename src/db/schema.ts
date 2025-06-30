// src/db/schema.ts
import {
  integer,
  pgTable,
  uuid,
  varchar,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(), // Changed to UUID for better uniqueness
  mobile: varchar("mobile", { length: 20 }).notNull(), // Mobile number for login
  name: varchar("name", { length: 255 }), // Name can be null
  email: varchar("email", { length: 255 }), // Email can be null
  role: integer("role").default(1), // Default role is 1
  password: varchar("password", { length: 255 }), // Password can be null, useful if using OAuth or other methods
  status: integer("status").default(1), // Default status is 1
  createdAt: timestamp("created_at").defaultNow(), // Timestamp for when the user was created
  updatedAt: timestamp("updated_at").defaultNow(), // Timestamp for when the user was last updated
  oldId: integer("oldId"),
});

export const sessionsTable = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(), // Unique session ID
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }), // Link to user
  sessionToken: varchar("session_token", { length: 255 }).notNull().unique(), // Stored in secure cookie
  expiresAt: timestamp("expires_at").notNull(), // Session expiry timestamp
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productsTable = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(), // UUID primary key
  name: varchar("name", { length: 255 }).notNull(), // Product name
  salePrice: numeric("sale_price").notNull(), // Sale price (e.g., 199.99)
  mrpPrice: numeric("mrp_price").notNull(), // MRP price (e.g., 249.99)
  stock: integer("stock").notNull(), // Inventory count
  createdAt: timestamp("created_at").defaultNow(), // Created timestamp
  updatedAt: timestamp("updated_at").defaultNow(), // Updated timestamp
});
