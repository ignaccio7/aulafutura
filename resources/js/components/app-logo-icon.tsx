import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img
            src="/logo.png"
            alt="Logo de AulaFutura"
            className="bg-white object-cover object-center"
        />
    );
}
