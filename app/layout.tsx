import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Spring Lab · Preparação AV1',description:'Estude Spring Boot com 11 módulos, 55 flashcards e simulados de 25 questões com análise de código.',icons:{icon:'/favicon.svg'},robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>}
