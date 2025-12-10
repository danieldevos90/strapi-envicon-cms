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
    // Auto-create admin user for local development
    const adminEmail = 'admin@envicon.nl';
    const adminPassword = 'Envicon2024!Admin';
    
    try {
      // Check if any admin user exists
      const admins = await strapi.db.query('admin::user').findMany({
        where: { email: adminEmail },
      });

      if (admins.length === 0) {
        console.log('');
        console.log('🔧 Creating default admin user...');
        
        // Create admin user
        const superAdminRole = await strapi.db.query('admin::role').findOne({
          where: { code: 'strapi-super-admin' },
        });

        if (superAdminRole) {
          const hashedPassword = await strapi.service('admin::auth').hashPassword(adminPassword);
          
          await strapi.db.query('admin::user').create({
            data: {
              email: adminEmail,
              firstname: 'Admin',
              lastname: 'Envicon',
              username: 'admin',
              password: hashedPassword,
              isActive: true,
              roles: [superAdminRole.id],
            },
          });

          console.log('');
          console.log('✅ Default admin user created successfully!');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('📧 Email:    admin@envicon.nl');
          console.log('🔑 Password: Envicon2024!Admin');
          console.log('🌐 Login:    http://localhost:1337/admin');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('⚠️  IMPORTANT: Change this password after first login!');
          console.log('');
        }
      } else {
        console.log('✅ Admin user already exists: admin@envicon.nl');
      }
    } catch (error) {
      console.error('Error checking/creating admin user:', error);
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
