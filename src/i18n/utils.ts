import { ui, defaultLang } from './ui';

export { defaultLang };
export type Locale = keyof typeof ui;

// Único idioma ativo (`defaultLang`) por enquanto. `getLangFromUrl` já existe
// para quando houver mais de um locale nas rotas — sem precisar reescrever
// os componentes que usam `useTranslations`.
export function getLangFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Locale;
  return defaultLang;
}

export function useTranslations(lang: Locale) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang]?.[key] ?? ui[defaultLang][key];
  };
}
