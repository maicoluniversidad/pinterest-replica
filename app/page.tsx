import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      textAlign: 'center',
      fontFamily: 'sans-serif' 
    }}>
      <h1 style={{ color: '#e60023', fontSize: '40px' }}>Pinterest Replica</h1>
      <p>¡Explora nuevas ideas!</p>
      <Link href="/register">
        <button style={{
          backgroundColor: '#e60023',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '20px',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '20px'
        }}>
          Registrarse ahora
        </button>
      </Link>
    </div>
  );
}