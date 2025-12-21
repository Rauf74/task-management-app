// ==============================================
// Prisma Configuration (Prisma 7.x)
// ==============================================
//
// Prisma 7 memindahkan konfigurasi koneksi database
// dari schema.prisma ke file ini.
//
// ==============================================

import 'dotenv/config';
import { defineConfig, env } from "prisma/config";

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        url: env('DIRECT_URL'),
    },
});
