import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite"; // <-- add this
export default defineConfig({
  plugins: [
    tailwindcss(), // <-- and add this
  ],
});