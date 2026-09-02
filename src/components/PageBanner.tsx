import React from 'react';

type Props = {
  title?: string;
  subtitle?: string;
  image?: string;
  backgroundPosition?: string;
};

export default function PageBanner({ title, subtitle, image, backgroundPosition = 'center top' }: Props) {
  return (
    <div
      style={{
        marginBottom: '2.5rem',
        padding: '3rem 2rem',
        aspectRatio: '16 / 4',
        borderRadius: '16px',
        width: '100%',
        background: image
          ? `url(${image})`
          : 'linear-gradient(135deg, #1e293b, #0f172a)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        color: 'white',
      }}
    >
      {title && <h1 style={{ marginBottom: '0.5rem' }}>{title}</h1>}
      {subtitle && (
        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
