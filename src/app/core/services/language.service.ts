import { Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type AppLang = 'en' | 'ar';

const LANG_KEY = 'speed_lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  lang = signal<AppLang>('en');
  ready = signal(false);

  private translations: Record<string, unknown> = {};

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem(LANG_KEY) as AppLang | null;
    const initial: AppLang = saved === 'ar' ? 'ar' : 'en';
    this.lang.set(initial);
    this.loadTranslations(initial);

    effect(() => {
      const current = this.lang();
      document.documentElement.setAttribute('lang', current);
      document.documentElement.setAttribute('dir', current === 'ar' ? 'rtl' : 'ltr');
    });
  }

  async setLang(lang: AppLang) {
    localStorage.setItem(LANG_KEY, lang);
    this.lang.set(lang);
    await this.loadTranslations(lang);
  }

  toggle() {
    this.setLang(this.lang() === 'en' ? 'ar' : 'en');
  }

  get isRTL(): boolean {
    return this.lang() === 'ar';
  }

  t(key: string): string {
    const parts = key.split('.');
    let node: any = this.translations;
    for (const part of parts) {
      if (node == null) return key;
      node = node[part];
    }
    return typeof node === 'string' ? node : key;
  }

  private async loadTranslations(lang: AppLang) {
    this.ready.set(false);
    try {
      this.translations = (await this.http.get<Record<string, unknown>>(`assets/i18n/${lang}.json`).toPromise()) || {};
    } catch {
      this.translations = {};
    }
    this.ready.set(true);
  }
}
