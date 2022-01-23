import React from 'react';
import { IntlProvider } from 'react-intl';
import { SitePageContext, Translation, WrapPageElement } from '../types';
import I18nHead from './components/I18nHead';

export const PageContext = React.createContext<SitePageContext>({});

export const wrapPageElement: WrapPageElement = ({ element, props }, options) => {
  const pageContext = props.pageContext as SitePageContext;
  const translations = (props.pageContext.translations as Translation[]) || [];
  const locale = pageContext.locale ?? options.defaultLocale;
  const currentLocale = options.locales.find((l) => l.locale === locale);
  const prefix = pageContext.prefix ?? currentLocale?.prefix;
  const currentMessages = { ...currentLocale?.messages, ...currentLocale?.slugs };

  if (currentMessages) {
    // Inject language names of all available languages into current messages
    options.locales.forEach((l) => {
      currentMessages[`languages.${l.locale}`] = l.messages.language;
    });
  }

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <PageContext.Provider value={{ locale, prefix }}>
      <IntlProvider defaultLocale={options.defaultLocale} locale={locale} messages={currentMessages}>
        <I18nHead currentLocale={locale} translations={translations} pathname={props.location.pathname} />
        {element}
      </IntlProvider>
    </PageContext.Provider>
  );
};
