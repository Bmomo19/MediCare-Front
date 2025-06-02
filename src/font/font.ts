import {Roboto, Jaro} from 'next/font/google';

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