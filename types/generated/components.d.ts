import type { Schema, Struct } from '@strapi/strapi';

export interface ContentTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_content_text_blocks';
  info: {
    description: 'A reusable text block with title and content';
    displayName: 'Text Block';
  };
  attributes: {
    content: Schema.Attribute.Text & Schema.Attribute.Required;
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

export interface SectionsSectorsSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_sectors_sections';
  info: {
    description: 'Sectors section titles';
    displayName: 'Sectors Section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'SECTOREN'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Ontdek maatwerk voor jouw sector'>;
  };
}

export interface SectionsServicesSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_services_sections';
  info: {
    description: 'Services section titles';
    displayName: 'Services Section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'DIENSTEN'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Volledige ontzorging voor jouw bouwproject'>;
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

export interface UiCompanyInfo extends Struct.ComponentSchema {
  collectionName: 'components_ui_company_infos';
  info: {
    description: 'Company legal information displayed in footer';
    displayName: 'Company Info';
  };
  attributes: {
    kvk: Schema.Attribute.String;
    vat: Schema.Attribute.String;
    copyright: Schema.Attribute.String;
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

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'content.text-block': ContentTextBlock;
      'sections.hero': SectionsHero;
      'sections.sectors-section': SectionsSectorsSection;
      'sections.services-section': SectionsServicesSection;
      'ui.button': UiButton;
      'ui.company-info': UiCompanyInfo;
      'ui.contact-method': UiContactMethod;
      'ui.feature': UiFeature;
      'ui.footer-section': UiFooterSection;
      'ui.logo': UiLogo;
      'ui.menu-item': UiMenuItem;
    }
  }
}
