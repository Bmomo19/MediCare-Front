import {Roboto, Jaro, Inter} from 'next/font/google';

export const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
});

export const jaro = Jaro({
  variable: '--font-jaro',
  subsets: ['latin'],
  weight: ['400'],
});

export const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});