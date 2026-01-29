import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'I-Tracker - Smart Personal Finance Tracker';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0a0f0a 0%, #1a2a1a 50%, #0f1610 100%)',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Logo Circle */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 180,
                        height: 180,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #22c55e 0%, #06b6d4 100%)',
                        marginBottom: 40,
                        boxShadow: '0 0 60px rgba(34, 197, 94, 0.4)',
                    }}
                >
                    <span
                        style={{
                            fontSize: 100,
                            fontWeight: 'bold',
                            color: '#0a0f0a',
                        }}
                    >
                        $
                    </span>
                </div>

                {/* Title */}
                <div
                    style={{
                        display: 'flex',
                        fontSize: 72,
                        fontWeight: 'bold',
                        background: 'linear-gradient(90deg, #22c55e, #06b6d4)',
                        backgroundClip: 'text',
                        color: 'transparent',
                        marginBottom: 20,
                    }}
                >
                    I-Tracker
                </div>

                {/* Subtitle */}
                <div
                    style={{
                        fontSize: 32,
                        color: '#9ca3af',
                    }}
                >
                    Smart Personal Finance Tracker
                </div>

                {/* Features */}
                <div
                    style={{
                        display: 'flex',
                        gap: 40,
                        marginTop: 40,
                    }}
                >
                    {['Track Income', 'Manage Expenses', 'Visualize Data'].map((feature) => (
                        <div
                            key={feature}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                color: '#22c55e',
                                fontSize: 24,
                            }}
                        >
                            <span style={{ fontSize: 28 }}>✓</span>
                            {feature}
                        </div>
                    ))}
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
