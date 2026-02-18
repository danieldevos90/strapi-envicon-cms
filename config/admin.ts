// `strapi` is available at runtime when the Preview handler runs.
// Declare it to keep TypeScript happy in config files.
declare const strapi: any;

export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  preview: {
    enabled: env.bool('PREVIEW_ENABLED', true),
    config: {
      // This must be your FRONTEND origin (not the CMS origin).
      // Example:
      //   CLIENT_URL=https://envicon.nl
      // Local:
      //   CLIENT_URL=http://localhost:3000
      allowedOrigins: [env('CLIENT_URL', 'http://localhost:3000')],

      /**
       * Build the preview URL opened by the Content Manager.
       * We route through Next.js `/api/preview` so drafts can be rendered.
       */
      handler: async (uid, { documentId, locale, status }) => {
        const clientUrl = env('CLIENT_URL', 'http://localhost:3000');
        const previewSecret =
          env('PREVIEW_SECRET') || env('STRAPI_ADMIN_CLIENT_PREVIEW_SECRET', '');

        // For collection types, we need the slug to build the frontend path.
        let slug = null;
        try {
          // `strapi` is available at runtime when the handler runs.
          // Only select slug to keep it fast.
          // eslint-disable-next-line no-undef
          const doc = await strapi.documents(uid).findOne({
            documentId,
            locale,
            status,
            fields: ['slug'],
          });
          slug = doc?.slug || null;
        } catch (e) {
          slug = null;
        }

        let pathname = '/';
        switch (uid) {
          case 'api::homepage.homepage':
            pathname = '/';
            break;
          case 'api::about-page.about-page':
            pathname = '/over-ons';
            break;
          case 'api::contact-page.contact-page':
            pathname = '/contact';
            break;
          case 'api::solution.solution':
            pathname = slug ? `/oplossingen/${slug}` : '/oplossingen';
            break;
          case 'api::sector.sector':
            pathname = slug ? `/sectoren/${slug}` : '/sectoren';
            break;
          case 'api::project.project':
            pathname = slug ? `/projecten/${slug}` : '/projecten';
            break;
          case 'api::article.article':
            pathname = slug ? `/artikel/${slug}` : '/nieuws';
            break;
          default:
            // For globals like navigation/footer/seo config, previewing home is good enough.
            pathname = '/';
        }

        const previewUrl = new URL('/api/preview', clientUrl);
        if (previewSecret) previewUrl.searchParams.set('secret', previewSecret);
        previewUrl.searchParams.set('url', pathname);
        previewUrl.searchParams.set('uid', uid);
        if (documentId) previewUrl.searchParams.set('documentId', String(documentId));
        if (locale) previewUrl.searchParams.set('locale', locale);
        if (status) previewUrl.searchParams.set('status', status);
        if (slug) previewUrl.searchParams.set('slug', slug);

        return previewUrl.toString();
      },
    },
  },
});
