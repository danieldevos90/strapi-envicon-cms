import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsAbout extends Struct.ComponentSchema {
  collectionName: 'components_sections_abouts';
  info: {
    description: 'About section with features';
    displayName: 'About Section';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    features: Schema.Attribute.Component<'ui.feature', true>;
    subtitle: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsContact extends Struct.ComponentSchema {
  collectionName: 'components_sections_contacts';
  info: {
    description: 'Contact section with methods and map';
    displayName: 'Contact Section';
  };
  attributes: {
    buttons: Schema.Attribute.JSON;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    map: Schema.Attribute.JSON;
    methods: Schema.Attribute.Component<'ui.contact-method', true>;
    subtitle: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    description: 'Hero section with title, subtitle, description and carousel';
    displayName: 'Hero Section';
  };
  attributes: {
    buttons: Schema.Attribute.JSON;
    carousel: Schema.Attribute.JSON;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    subtitle: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    videoUrl: Schema.Attribute.String;
  };
}

export interface SectionsProcessSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_process_sections';
  info: {
    description: 'Process section with steps';
    displayName: 'Process Section';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    subtitle: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface UiButton extends Struct.ComponentSchema {
  collectionName: 'components_ui_buttons';
  info: {
    description: 'Button component with text and link';
    displayName: 'Button';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    mobileHref: Schema.Attribute.String;
    mobileText: Schema.Attribute.String;
    showOnDesktop: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showOnMobile: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface UiContactMethod extends Struct.ComponentSchema {
  collectionName: 'components_ui_contact_methods';
  info: {
    description: 'Contact method with icon, title and value';
    displayName: 'Contact Method';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface UiFeature extends Struct.ComponentSchema {
  collectionName: 'components_ui_features';
  info: {
    description: 'Feature block with icon, title and description';
    displayName: 'Feature';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface UiFooterSection extends Struct.ComponentSchema {
  collectionName: 'components_ui_footer_sections';
  info: {
    description: 'Footer section with links';
    displayName: 'Footer Section';
  };
  attributes: {
    links: Schema.Attribute.JSON;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface UiLogo extends Struct.ComponentSchema {
  collectionName: 'components_ui_logos';
  info: {
    description: 'Logo component with src and alt text';
    displayName: 'Logo';
  };
  attributes: {
    alt: Schema.Attribute.String & Schema.Attribute.Required;
    src: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface UiMenuItem extends Struct.ComponentSchema {
  collectionName: 'components_ui_menu_items';
  info: {
    description: 'Navigation menu item';
    displayName: 'Menu Item';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    identifier: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface UiSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_ui_social_links';
  info: {
    description: 'Social media link';
    displayName: 'Social Link';
  };
  attributes: {
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'sections.about': SectionsAbout;
      'sections.contact': SectionsContact;
      'sections.hero': SectionsHero;
      'sections.process-section': SectionsProcessSection;
      'ui.button': UiButton;
      'ui.contact-method': UiContactMethod;
      'ui.feature': UiFeature;
      'ui.footer-section': UiFooterSection;
      'ui.logo': UiLogo;
      'ui.menu-item': UiMenuItem;
      'ui.social-link': UiSocialLink;
    }
  }
}
