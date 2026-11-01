export default function Wave({ from, to }: { from: string; to: string }) {
    return (
        <div className="wave" aria-hidden="true" style={{ background: from }}>
            <svg viewBox="0 0 1440 110" preserveAspectRatio="none">
                <path
                    d="M0 58 C 170 18 370 100 580 64 C 790 28 930 92 1120 60 C 1280 34 1380 74 1440 52 L1440 110 L0 110 Z"
                    fill={to}
                />
            </svg>
        </div>
    );
}
