import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500'],
    variable: '--font-poppins',
});

export const metadata = {
    title: 'Lunchrun Clone',
    description: 'simple clone of lunchrun',
    icons: {
        icon: [
            {
                media: '(prefers-color-scheme: dark)',
                url: '/dark.png',
                href: '/dark.png',
            },
            {
                media: '(prefers-color-scheme: light)',
                url: '/light.png',
                href: '/light.png',
            },
        ],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={poppins.variable}>
            <body className="dark font-poppins">
                <main className="min-h-screen">{children}</main>

                <Toaster />
            </body>
        </html>
    );
}
