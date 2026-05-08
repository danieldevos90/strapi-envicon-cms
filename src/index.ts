export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Optionally bootstrap a first super-admin in non-production environments.
    //
    // Behavior:
    // - DISABLED in production unless STRAPI_ADMIN_AUTOCREATE === 'true'.
    // - Credentials must be supplied via env vars; no hardcoded defaults.
    // - If the password is missing, a strong random one is generated and
    //   logged ONCE so the operator can capture it. This password is hashed
    //   immediately and not retained.
    //
    // Required env vars (when enabled):
    //   STRAPI_ADMIN_EMAIL=...
    //   STRAPI_ADMIN_PASSWORD=...   (recommended)
    //   STRAPI_ADMIN_FIRSTNAME=...  (optional, default "Admin")
    //   STRAPI_ADMIN_LASTNAME=...   (optional, default "User")
    const env = (process.env.NODE_ENV || 'development').toLowerCase();
    const autocreate =
      process.env.STRAPI_ADMIN_AUTOCREATE === 'true' || env !== 'production';

    if (!autocreate) {
      console.log('[bootstrap] Admin auto-create skipped (production without STRAPI_ADMIN_AUTOCREATE=true).');
    } else {
      const adminEmail = process.env.STRAPI_ADMIN_EMAIL;

      if (!adminEmail) {
        console.warn(
          '[bootstrap] STRAPI_ADMIN_EMAIL not set — skipping default admin creation. ' +
            'Run `npm run strapi admin:create-user` to create one manually.'
        );
      } else {
        try {
          const admins = await strapi.db.query('admin::user').findMany({
            where: { email: adminEmail },
          });

          if (admins.length === 0) {
            const superAdminRole = await strapi.db.query('admin::role').findOne({
              where: { code: 'strapi-super-admin' },
            });

            if (superAdminRole) {
              const { randomBytes } = await import('node:crypto');
              const adminPassword =
                process.env.STRAPI_ADMIN_PASSWORD ||
                // Strong random fallback so we never persist a known default password.
                `Env-${randomBytes(18).toString('base64url')}`;
              const hashedPassword = await strapi
                .service('admin::auth')
                .hashPassword(adminPassword);

              await strapi.db.query('admin::user').create({
                data: {
                  email: adminEmail,
                  firstname: process.env.STRAPI_ADMIN_FIRSTNAME || 'Admin',
                  lastname: process.env.STRAPI_ADMIN_LASTNAME || 'User',
                  username: adminEmail.split('@')[0],
                  password: hashedPassword,
                  isActive: true,
                  roles: [superAdminRole.id],
                },
              });

              console.log('');
              console.log('✅ Default admin user created.');
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log(`📧 Email:    ${adminEmail}`);
              if (!process.env.STRAPI_ADMIN_PASSWORD) {
                console.log(`🔑 Password: ${adminPassword}`);
                console.log('   (generated once — store it now; not logged again)');
              } else {
                console.log('🔑 Password: <from STRAPI_ADMIN_PASSWORD>');
              }
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('⚠️  Change this password after first login.');
              console.log('');
            }
          }
        } catch (error) {
          console.error('[bootstrap] Error checking/creating admin user:', error);
        }
      }
    }

    // Set public permissions for API access
    try {
      const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
      });

      if (publicRole) {
        // Define permissions for public role
        const permissions = {
          // Collection types
          'api::article': ['find', 'findOne'],
          'api::solution': ['find', 'findOne'],
          'api::sector': ['find', 'findOne'],
          'api::service': ['find', 'findOne'],
          'api::process-step': ['find', 'findOne'],
          'api::project': ['find', 'findOne'],
          // Single types
          'api::homepage': ['find'],
          'api::navigation': ['find'],
          'api::footer': ['find'],
          'api::envicon-seo-config': ['find'],
          'api::about-page': ['find'],
          'api::contact-page': ['find'],
        };

        for (const [apiId, actions] of Object.entries(permissions)) {
          for (const action of actions) {
            const permissionExists = await strapi.db.query('plugin::users-permissions.permission').findOne({
              where: {
                role: publicRole.id,
                action: `${apiId}.${action}`,
              },
            });

            if (!permissionExists) {
              await strapi.db.query('plugin::users-permissions.permission').create({
                data: {
                  role: publicRole.id,
                  action: `${apiId}.${action}`,
                  enabled: true,
                },
              });
            } else {
              // Update to enabled if exists
              await strapi.db.query('plugin::users-permissions.permission').update({
                where: { id: permissionExists.id },
                data: { enabled: true },
              });
            }
          }
        }

        console.log('✅ Public API permissions configured');
      }
    } catch (error) {
      console.error('Error setting public permissions:', error);
    }
  },
};
